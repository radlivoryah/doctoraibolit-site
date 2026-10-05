/**
 * Pulse sync: keeps the operator's Pulse state (pulse-v1) identical on every device by
 * storing it in Telegram CloudStorage of the mini-app bot. Pure merge helpers are
 * exported for tests; the CloudStorage adapter is used only inside Telegram.
 *
 * Storage layout: two slots "a" and "b" of 4000-char chunks (pulse_a_0, pulse_a_1, ...)
 * and a pointer key pulse_ptr = "<slot>|<chunks>|<updatedAt>". A write fills the idle slot
 * first and flips the pointer last, so a reader never sees a half-written state.
 */
(function (root) {
  'use strict';

  var CHUNK = 4000; // CloudStorage value limit is 4096 chars
  var PTR = 'pulse_ptr';
  var ARRAYS = ['goals', 'habits', 'subs'];

  /** @param {object} o @returns {object} deep copy */
  function clone(o) { return JSON.parse(JSON.stringify(o || {})); }

  /** Union of two id-keyed arrays; tombstoned ids dropped; same id -> pick(a, b). */
  function unionById(a, b, dead, pick) {
    var out = [], seen = {};
    (a || []).concat(b || []).forEach(function (x) {
      if (!x || (x.id != null && dead[x.id])) return;
      var key = x.id != null ? 'id:' + x.id : 'text:' + (x.text || x.name || ''); // old items may lack ids
      if (seen[key] === undefined) { seen[key] = out.length; out.push(x); return; }
      out[seen[key]] = pick(out[seen[key]], x);
    });
    return out;
  }

  /** Prefer the copy that is ticked: an unticked twin is usually the stale one. */
  function preferDone(x, y) { return x.done || !y.done ? x : y; }

  /** Items seeded on two devices get different ids but the same text: keep one. */
  function dedupeByText(list) {
    var byText = {}, out = [];
    list.forEach(function (x) {
      var k = String(x.text || '').trim().toLowerCase();
      if (!k || byText[k] === undefined) { byText[k] = out.length; out.push(x); return; }
      out[byText[k]] = preferDone(out[byText[k]], x);
    });
    return out;
  }

  /** Two note versions: keep the longer if one contains the other, else keep both. */
  function mergeNote(a, b) {
    a = a || ''; b = b || '';
    if (a === b || b.indexOf(a) >= 0) return b.length >= a.length ? b : a;
    if (a.indexOf(b) >= 0) return a;
    return a + '\n\n' + b;
  }

  /**
   * Merge two Pulse states without losing anything either device wrote.
   * @param {object} local state of this device (wins on plain settings)
   * @param {object} remote state from the cloud
   * @returns {object} merged state
   */
  function merge(local, remote) {
    var a = clone(local), b = clone(remote), out = clone(a);
    var dead = Object.assign({}, b.deleted || {}, a.deleted || {});
    out.deleted = dead;

    out.lists = {};
    var pids = Object.keys(Object.assign({}, a.lists || {}, b.lists || {}));
    pids.forEach(function (pid) {
      var la = (a.lists || {})[pid] || {}, lb = (b.lists || {})[pid] || {};
      out.lists[pid] = {};
      Object.keys(Object.assign({}, la, lb)).forEach(function (lid) {
        out.lists[pid][lid] = dedupeByText(unionById(la[lid], lb[lid], dead, preferDone));
      });
    });

    ARRAYS.forEach(function (key) {
      out[key] = unionById(a[key], b[key], dead, key === 'habits' ? function (x, y) {
        var h = clone(x); h.log = Object.assign({}, y.log || {}, x.log || {}); return h;
      } : preferDone);
    });
    if (!a.subs && !b.subs) out.subs = null;

    out.notes = {};
    Object.keys(Object.assign({}, a.notes || {}, b.notes || {})).forEach(function (pid) {
      out.notes[pid] = mergeNote((a.notes || {})[pid], (b.notes || {})[pid]);
    });

    ['backlogDone', 'seeded', 'scores', 'open', 'showDone'].forEach(function (key) {
      out[key] = Object.assign({}, b[key] || {}, a[key] || {});
    });
    out.watered = Object.assign({}, b.watered || {});
    Object.keys(a.watered || {}).forEach(function (id) {
      if (!out.watered[id] || a.watered[id] > out.watered[id]) out.watered[id] = a.watered[id];
    });
    out.subsVer = Math.max(a.subsVer || 0, b.subsVer || 0) || undefined;
    out.rate = a.rate || b.rate;
    out.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
    return out;
  }

  /** @param {string} s @returns {string[]} chunks of at most CHUNK chars */
  function chunk(s) {
    var parts = [];
    for (var i = 0; i < s.length; i += CHUNK) parts.push(s.slice(i, i + CHUNK));
    return parts.length ? parts : [''];
  }

  /**
   * Decide what to do with local and cloud copies.
   * @returns {string} 'push' | 'take' | 'merge' | 'none'
   */
  function plan(local, cloud, meta) {
    if (!cloud) return 'push';
    var lt = local.updatedAt || 0, ct = cloud.updatedAt || 0, seen = meta.cloudTs || 0;
    if (!meta.mergedOnce) return 'merge';
    var localDirty = lt > seen, cloudMoved = ct > seen;
    if (localDirty && cloudMoved) return 'merge';
    if (cloudMoved) return 'take';
    if (localDirty) return 'push';
    return 'none';
  }

  /* ---------- Telegram CloudStorage adapter ---------- */

  function cloud() {
    var tg = root.Telegram && root.Telegram.WebApp;
    if (!tg || !tg.CloudStorage || !tg.isVersionAtLeast || !tg.isVersionAtLeast('6.9')) return null;
    return tg.CloudStorage;
  }

  function read(cs, cb) {
    cs.getItem(PTR, function (err, ptr) {
      if (err || !ptr) return cb(err || null, null);
      var p = ptr.split('|'), slot = p[0], n = +p[1], keys = [];
      for (var i = 0; i < n; i++) keys.push('pulse_' + slot + '_' + i);
      cs.getItems(keys, function (err2, vals) {
        if (err2) return cb(err2, null);
        try { cb(null, JSON.parse(keys.map(function (k) { return vals[k] || ''; }).join('')), slot); }
        catch (e) { cb(e, null); }
      });
    });
  }

  function write(cs, state, curSlot, cb) {
    var slot = curSlot === 'a' ? 'b' : 'a', parts = chunk(JSON.stringify(state)), left = parts.length, failed = false;
    parts.forEach(function (part, i) {
      cs.setItem('pulse_' + slot + '_' + i, part, function (err) {
        if (failed) return;
        if (err) { failed = true; return cb(err); }
        if (--left === 0) cs.setItem(PTR, slot + '|' + parts.length + '|' + (state.updatedAt || 0), function (e) { cb(e || null, slot); });
      });
    });
  }

  /**
   * Sync this device with the cloud.
   * @param {object} opts get(): state, set(state), metaGet(), metaSet(meta), done(changed)
   */
  function sync(opts) {
    var cs = cloud();
    if (!cs || sync.busy) return;
    sync.busy = true;
    function finish(changed) { sync.busy = false; if (opts.done) opts.done(changed); }
    read(cs, function (err, remote, slot) {
      if (err) return finish(false);
      var local = opts.get(), meta = opts.metaGet(), action = plan(local, remote, meta);
      if (action === 'none') return finish(false);
      if (action === 'take') { opts.set(remote); meta.cloudTs = remote.updatedAt || 0; opts.metaSet(meta); return finish(true); }
      var next = action === 'merge' ? merge(local, remote) : local;
      if (action === 'merge') { next.updatedAt = Date.now(); opts.set(next); }
      write(cs, next, slot, function (e) {
        if (!e) { meta.cloudTs = next.updatedAt || 0; meta.mergedOnce = true; opts.metaSet(meta); }
        finish(action === 'merge');
      });
    });
  }

  var api = { merge: merge, chunk: chunk, plan: plan, sync: sync, CHUNK: CHUNK };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PulseSync = api;
})(typeof window !== 'undefined' ? window : globalThis);

/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakRadio */
const { useState, useEffect, useRef } = React;

/* Resolve a resource by id (blob URL in standalone build) or fall back to its path */
const RES = (id, fallback) => (window.__resources && window.__resources[id]) || fallback;

/* ───────── Icons ───────── */
const Icon = {
  Arrow: (p) =>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>,

  Telegram: (p) =>
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
    </svg>

};

/* ───────── Scroll reveal hook ───────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), 60);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ───────── Top badge ───────── */
function TopBadge() {
  return (
    <div className="badge-top">
      <div className="badge-top-inner">
        <span className="lead">Ильдар Хайров</span>
        <span className="dot" />
        <em>Стоматолог-ортопед · AI-практик</em>
        <span className="dot hide-mobile" />
        <em className="hide-mobile">Москва · @il_khairov</em>
      </div>
    </div>);

}

/* ───────── Hero ───────── */
function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Timers tick reliably even while the bundle is in its off-paint
    // splash-unpack phase (rAF callbacks can stall there). Multiple
    // independent triggers guarantee the hero reveals no matter what.
    const t = setTimeout(() => setReady(true), 60);
    const onLoad = () => setReady(true);
    window.addEventListener('load', onLoad);
    return () => { clearTimeout(t); window.removeEventListener('load', onLoad); };
  }, []);
  return (
    <section className={`hero ${ready ? 'ready' : ''}`} id="top">
      <div className="hero-label hero-anim">Личное обращение</div>
      <h1 className="h1 hero-anim">
        Это не курс.<br />
        Это <em>рабочая система.</em>
      </h1>
      <p className="hero-sub hero-anim">
        Полтора года внедряю ИИ в свою практику — <strong>не бросая стоматологию.</strong>
        Прошёл десятки курсов, закрытых клубов и чатов, продолжаю состоять в нескольких. Потратил <strong>800k+ ₽</strong> на то, что в итоге не работает.
        Оставил то, что работает в кабинете и дома — и даю врачам и обычным людям. Без курсов на 30 часов.
      </p>
      <div className="hero-actions hero-anim">
        <a href="https://t.me/il_khairov" className="btn btn-gold btn-lg">
          <Icon.Telegram width="16" height="16" /> Написать в Telegram
        </a>
        <a href="#mirror" className="btn btn-ghost btn-lg">
          Сначала разбор
        </a>
      </div>
      <div className="hero-sender hero-anim">
        <div className="sender-avatar"><img src={RES('photoAvatar', 'photo-avatar.png')} alt="Ильдар Хайров" /></div>
        <div className="sender-info">
          <strong>Ильдар Рашидович Хайров</strong>
          Москва · Стоматолог-ортопед & AI-практик
        </div>
      </div>
    </section>);

}

/* ───────── Marquee ───────── */
function Marquee() {
  const items = [
  'Промпты, которые работают', 'Агенты в Telegram', 'Голосовое управление',
  'Без кода', '24/7', 'Личный ассистент', 'Методичка для врачей',
  'Консультация 2–3 часа', 'Под ключ', 'На твоём сервере',
  'Помнит контекст', 'Под твои привычки'];

  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>);

}

/* ───────── Principle (manifesto) ───────── */
function Principle() {
  return (
    <section id="principle">
      <div className="section-num reveal">02 / Принцип</div>
      <div className="section-eyebrow reveal">Подход к жизни</div>
      <h2 className="h2 reveal">
        ИИ — не профессия.<br />
        Это <em>способ остаться в своей.</em>
      </h2>

      <div className="principle-grid">
        <div className="principle-photo reveal">
          <img src={RES('photoPortrait', 'photo-portrait.png')} alt="Ильдар Хайров в кабинете" />
          <div className="principle-photo-label">
            <span>Кабинет · приём</span>
            <em>По сей день</em>
          </div>
        </div>
        <div className="manifesto reveal">
        <p>
          Я <strong>не бросил стоматологию ради нейросетей.</strong> Не «ушёл в IT»,
          не «сменил вектор», не «нашёл себя в новой нише». Я остался практикующим
          врачом — и встроил ИИ туда, где раньше тратил часы на рутину.
        </p>
        <p>
          Каждый день <strong>веду приём</strong>, протезирую, общаюсь с пациентами.
          Параллельно собираю агентов, тестирую инструменты, веду блог.
          Это не «между делом» — это и есть моя позиция.
        </p>
        <p className="manifesto-final">
          Изучать и внедрять новое, <em>не отказываясь от того, в чём ты уже силён.</em>
          И помогать другим сделать так же — без «бросай всё, переходи в digital».
        </p>
      </div>
      </div>
    </section>
  );
}

/* ───────── Mirror — типичные ситуации клиента ───────── */
function Mirror() {
  const items = [
  {
    q: '«Хочу попробовать ИИ, но не понимаю, с чего начать. Слишком много инструментов».',
    a: <>Это нормальное состояние. Я сам через него прошёл — и слил <strong>сотни тысяч</strong> на разбор. Тебе не нужно это повторять. На консультации мы за 2–3 часа смотрим твои конкретные задачи и собираем <strong>точную карту</strong>: что взять, что выкинуть, в каком порядке.</>
  },
  {
    q: '«У меня уже есть подписка на ChatGPT. Использую как Google».',
    a: <>Подписка — это движок. Я даю систему: <strong>куда его подключить, что в него говорить, какие задачи поручать.</strong> Большинство людей с подпиской остаются на уровне «обычного чата» — а он умеет в десятки раз больше.</>
  },
  {
    q: '«Боюсь, что ИИ нельзя использовать с медицинскими данными».',
    a: <>Можно — если правильно выбрать инструмент и настроить контур. Подбираю решения, которые работают <strong>на твоём сервере</strong> или обезличивают данные. Это разбираем отдельно: где можно, где нельзя, как организовать безопасно.</>
  },
  {
    q: '«Нет времени проходить курс на 30 часов».',
    a: <>И не надо. Я <strong>не продаю курс.</strong> Методичка — один вечер чтения. Консультация — одна встреча. Личный ассистент — настраиваю под ключ сам, ты пользуешься готовым. Курсов в моих продуктах нет.</>
  }];

  return (
    <section id="mirror">
      <div className="section-num reveal">03 / Зеркало</div>
      <div className="section-eyebrow reveal">Что я слышу чаще всего</div>
      <h2 className="h2 reveal">
        Типичная цитата.<br />
        <em>Мой ответ.</em>
      </h2>
      <p className="section-sub reveal">
        Без гадания и манипуляций. Беру то, что мне реально говорят на консультациях —
        и кладу рядом то, как я с этим работаю.
      </p>
      {items.map((it, i) =>
      <div className="mirror-card reveal" key={i}>
          <div className="mirror-quote">{it.q}</div>
          <div className="mirror-response">{it.a}</div>
        </div>
      )}
    </section>);

}

/* ───────── Why me ───────── */
function WhyMe() {
  const items = [
  {
    num: '01',
    tag: 'Опыт',
    title: 'Полтора года в ИИ, не выходя из стоматологии',
    body: 'Не курсовой спикер, не «эксперт по нейросетям». Практикующий врач, который параллельно строит и тестит ИИ-системы на себе. Знаю, как это делать без команды, без бюджета и между приёмами.'
  },
  {
    num: '02',
    tag: 'Цена ошибок',
    title: '800k+ ₽ потратил на обучение — за тебя',
    body: 'Прошёл через десятки курсов, подписок, инструментов. Слил деньги на то, что не работает. Тебе не надо это повторять — даю готовое: что взять, что выкинуть, в каком порядке.'
  },
  {
    num: '03',
    tag: 'Уже в деле',
    title: 'Мой агент работает у меня — не в презентации',
    body: 'Одно голосовое в Telegram — и рутина закрыта: записи, документы, напоминания, поиск, ответы. Это не демо для рекламы — это то, что у меня запущено каждый день. Покажу на своём примере.'
  },
  {
    num: '04',
    tag: 'Без воды',
    title: 'Говорю только из личного опыта',
    body: 'Не «по слухам», не «где-то читал», не «эксперты говорят». Если у меня в кабинете и дома это не работает — я не стану продавать это тебе. Точка.'
  }];

  return (
    <section id="why">
      <div className="section-num reveal">04 / Почему я</div>
      <div className="section-eyebrow reveal">По делу, без регалий</div>
      <h2 className="h2 reveal">
        Это не очередной курс<br />
        <em>«как использовать нейросети».</em>
      </h2>
      <p className="section-sub reveal">
        Я не теоретик, который записал 40 уроков и продаёт мечту.
        Делаю ровно то, чему учу — прямо сейчас, в своей практике.
      </p>
      <div className="why-grid">
        {items.map((it, i) =>
        <div className="why-item reveal" key={i}>
            <div className="why-num">
              {it.num}
              <em>{it.tag}</em>
            </div>
            <div className="why-text">
              <strong>{it.title}</strong>
              {it.body}
            </div>
          </div>
        )}
      </div>
    </section>);

}

/* ───────── Route — products as numbered blocks ───────── */
function Route() {
  const blocks = [
  {
    num: '01',
    label: 'Первый шаг',
    title: 'Методичка «ИИ для врача»',
    body: <>Структурированный сборник моих знаний об ИИ в медицине, проверенных на собственной практике. Не «50 промптов», а <strong>система</strong>: с чего начать, какие задачи решать, в каком порядке внедрять.</>,
    tags: ['PDF', 'Один вечер чтения', 'Готовые промпты', 'Для врачей'],
    outcome: <>Понимание, что ИИ <strong>уже умеет в твоей специальности</strong> — и точка, с которой можно начать на следующий день.</>,
    price: '1 990 ₽',
    priceNote: 'Разовая'
  },
  {
    num: '02',
    label: 'Глубокий разбор',
    title: 'Персональная консультация',
    body: <>2–3 часа один на один. Не просто «конкретный первый шаг» — <strong>полноценная структура запуска</strong> тебя как личности, эксперта или блогера через ИИ. Под твои задачи, твою специальность, твой контекст.</>,
    tags: ['2–3 часа', '1-на-1', 'Онлайн', 'Запись остаётся', 'Под твою практику'],
    outcome: <>Карта внедрения ИИ под тебя: инструменты, сценарии, последовательность, <strong>как избежать слива денег и времени</strong> — то, на что у меня ушло полтора года.</>,
    price: '25 000 ₽',
    priceNote: 'За встречу'
  },
  {
    num: '03',
    label: 'Под ключ',
    title: 'Личный ИИ-ассистент',
    body: <>Собираю агента под твои задачи и привычки. <strong>Голосовое в Telegram — и он закрывает рутину:</strong> записи, документы, поиск, напоминания. На твоём сервере. Помнит контекст. Говорит твоим тоном.</>,
    tags: ['Свой сервер', '24/7 в Telegram', 'Голосовое управление', 'Помнит контекст', 'Под твою специальность'],
    outcome: <>Рабочий ИИ-агент, запущенный за 1–2 недели, плюс <strong>месяц сопровождения.</strong> Уходишь не с обещанием — с системой, которая работает каждый день.</>,
    price: 'от 50 000 ₽',
    priceNote: 'Разовая настройка'
  }];

  return (
    <section className="wide" id="route">
      <div className="section-num reveal">05 / Маршрут</div>
      <div className="section-eyebrow reveal">Три уровня глубины</div>
      <h2 className="h2 reveal">
        От методички<br />
        до <em>агента под ключ.</em>
      </h2>
      <p className="section-sub reveal">
        Выбирай по запросу и бюджету. Каждый следующий уровень — глубже предыдущего,
        но любой работает сам по себе. Не нужно «проходить курс с первого блока».
      </p>
      {blocks.map((b, i) =>
      <div className="route-block reveal" key={i}>
          <div className="route-head">
            <div className="route-num">{b.num}</div>
            <div className="route-meta">
              <span className="route-label">{b.label}</span>
              <h3>{b.title}</h3>
            </div>
          </div>
          <div className="route-body">{b.body}</div>
          <div className="route-tags">
            {b.tags.map((t, j) => <span className="route-tag" key={j}>{t}</span>)}
          </div>
          <div className="route-outcome">
            <span className="route-outcome-label">На выходе</span>
            <span className="route-outcome-text">{b.outcome}</span>
          </div>
          <div className="route-price">
            <span className="route-price-amount">{b.price}</span>
            <span className="route-price-note">{b.priceNote}</span>
          </div>
        </div>
      )}
    </section>);

}

/* ───────── Personal touch ───────── */
function Touch() {
  const items = [
  {
    n: '/ 01',
    title: 'Делаю своими руками',
    body: 'Не делегирую помощникам. Агента, методичку, консультацию — собираю сам. То, что ты получаешь, прошло через мою практику.'
  },
  {
    n: '/ 02',
    title: 'Сопровождение, а не «удачи»',
    body: 'После запуска ассистента — месяц рядом. Отвечаю, чиню, дорабатываю. Не «зашёл в курс — выкручивайся».'
  },
  {
    n: '/ 03',
    title: 'Прямая связь',
    body: 'Личка в Telegram. Возникло — пиши. Без «обратитесь к куратору» и общих чатов на 200 человек.'
  },
  {
    n: '/ 04',
    title: 'Не продаю того, чего нет',
    body: 'Если для твоей задачи ИИ не подходит — скажу прямо и верну деньги. Лучше потерять чек, чем тратить твоё время.'
  }];

  return (
    <section id="touch">
      <div className="section-num reveal">06 / Подход</div>
      <div className="section-eyebrow reveal">Что я делаю лично</div>
      <h2 className="h2 reveal">
        Не «получишь PDF<br />
        и <em>удачи».</em>
      </h2>
      <p className="section-sub reveal">
        Я работаю с тобой как с одним человеком, а не как с потоком.
        Это ограничивает количество клиентов — и это сознательный выбор.
      </p>
      <div className="touch-list">
        {items.map((it, i) =>
        <div className="touch-item reveal" key={i}>
            <div className="touch-num">{it.n}</div>
            <h4>{it.title}</h4>
            <p>{it.body}</p>
          </div>
        )}
      </div>
    </section>);

}

/* ───────── Why now ───────── */
function WhyNow() {
  return (
    <section id="now">
      <div className="section-num reveal">07 / Почему сейчас</div>
      <div className="section-eyebrow reveal">Прямым текстом</div>
      <h2 className="h2 reveal">
        Не «как-нибудь<br />
        потом».<br />
        <em>Сейчас.</em>
      </h2>

      <div className="now-quote reveal">
        <p>«Я ещё подумаю. Может, через месяц-два разберусь сам.»</p>
        <cite>— ЧАСТЕНЬКО СЛЫШУ ТАКОЕ, САМ ЧЕРЕЗ ЭТО ПРОШЕЛ. НЕ РЕКОМЕНДУЮ</cite>
      </div>

      <div className="now-text reveal">
        <p>
          Через месяц-два ты не разберёшься сам. Ты <strong>выгоришь, попробуя 5 инструментов</strong>,
          и положишь это в папку «вернусь когда будет время». У меня было ровно так — полтора года назад.
        </p>
        <p>
          А вокруг тем временем коллеги уже начали <em>экономить часы каждый день.</em> Не потому что
          умнее — потому что у них кто-то один раз показал, что и в каком порядке делать.
        </p>
        <p>
          Я не продаю «успешный успех». <strong>Я продаю время</strong> — твоё, которое не уйдёт на ошибки.
          Полтора года и 800k+ ₽ моих — за пару часов и 25 000 ₽ твоих.
        </p>
      </div>
    </section>);

}

/* ───────── Final CTA ───────── */
function FinalCTA() {
  return (
    <section className="cta-section" id="cta">
      <div className="cta-box reveal">
        <h2 className="h2">
          Одно сообщение —<br />
          и ты уже <em>понимаешь, с чего начать.</em>
        </h2>
        <p>
          Небольшой диалог в переписке — и ты уже будешь понимать, с чего начать.
          Дам конкретный первый шаг, даже если дальше не будем работать.
        </p>
        <a href="https://t.me/il_khairov" className="cta-tg">
          <Icon.Telegram /> Написать в Telegram
        </a>
        <p className="cta-note">Telegram · @il_khairov · отвечаю в течение дня</p>
      </div>
    </section>);

}

/* ───────── Footer ───────── */
function Footer() {
  return (
    <footer>
      <p className="foot-name">Ильдар Рашидович Хайров</p>
      <p className="foot-meta">Стоматолог-ортопед · AI-практик · Москва</p>
      <div className="foot-links">
        <a href="https://t.me/il_khairov">@il_khairov</a>
        <a href="mailto:il.khairov@gmail.com">il.khairov@gmail.com</a>
      </div>
      <p style={{ marginTop: 18, opacity: .55 }}>© 2026 · Помогаю врачам и обычным людям внедрить ИИ — с первого дня.</p>
    </footer>);

}

/* ───────── Tweaks ───────── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "obsidian"
} /*EDITMODE-END*/;

const PALETTES = {
  obsidian: { bg: '#0A0A0A', bg2: '#141414', gold: '#E8A020', goldLight: '#f6b94a', teal: '#0D7377', tealLight: '#2bd4c8' },
  navy: { bg: '#0A1220', bg2: '#101a2e', gold: '#E8A020', goldLight: '#f6b94a', teal: '#0D7377', tealLight: '#2bd4c8' },
  charcoal: { bg: '#0E0E10', bg2: '#16161a', gold: '#D69437', goldLight: '#e6a953', teal: '#157C6E', tealLight: '#37c9b5' }
};
function applyPalette(p) {
  const c = PALETTES[p] || PALETTES.obsidian;
  const r = document.documentElement.style;
  r.setProperty('--bg', c.bg);
  r.setProperty('--bg-2', c.bg2);
  r.setProperty('--gold', c.gold);
  r.setProperty('--gold-light', c.goldLight);
  r.setProperty('--teal', c.teal);
  r.setProperty('--teal-light', c.tealLight);
}

/* ───────── App ───────── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();
  useEffect(() => {applyPalette(t.palette);}, [t.palette]);

  return (
    <>
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <TopBadge />
      <Hero />
      <Marquee />

      <Principle />
      <div className="divider" />

      <Mirror />
      <div className="divider" />

      <WhyMe />
      <div className="divider" />

      <Route />
      <div className="divider wide" />

      <Touch />
      <div className="divider" />

      <WhyNow />

      <FinalCTA />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Палитра">
          <TweakRadio
            label="Фон"
            value={t.palette}
            onChange={(v) => setTweak('palette', v)}
            options={[
            { label: 'Obsidian', value: 'obsidian' },
            { label: 'Navy', value: 'navy' },
            { label: 'Charcoal', value: 'charcoal' }]
            } />
          
        </TweakSection>
      </TweaksPanel>
    </>);

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
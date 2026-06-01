/**
 * Linkora — Language Switcher
 * Supports: RU, EN, ZH, ES, DE
 */

const TRANSLATIONS = {
  ru: {
    // Nav
    nav_how: 'Как работает',
    nav_pricing: 'Тарифы',
    nav_faq: 'FAQ',
    nav_offer: 'Оферта',
    nav_cta: 'Получить eSIM',

    // Hero
    hero_badge: 'Доступно в 200+ странах',
    hero_title_1: 'Свобода',
    hero_title_2: 'быть',
    hero_title_em: 'онлайн',
    hero_sub: 'Мгновенная eSIM для путешественников. Никаких физических карт — только чистое подключение в любой точке мира.',
    hero_btn_tg: 'Открыть в Telegram',
    hero_btn_more: 'Узнать больше',

    // Stats
    stat_countries: 'Стран',
    stat_speed: 'Скорость',
    stat_activation: 'Активация',
    stat_support: 'Поддержка',

    // How it works
    how_tag: 'Просто и быстро',
    how_title_1: 'Три шага до',
    how_title_em: 'свободного интернета',
    step1_title: 'Выберите тариф',
    step1_text: 'Откройте Telegram-бот и выберите подходящий тариф для вашей страны или региона.',
    step2_title: 'Оплатите',
    step2_text: 'Мгновенная оплата через Telegram Stars или криптовалюту. Без банковских карт.',
    step3_title: 'Активируйте',
    step3_text: 'Получите QR-код в Telegram и отсканируйте его в настройках телефона. Готово за минуту.',
    how_hint: 'Подробная инструкция по активации →',
    how_hint_link: 'Как активировать eSIM',

    // Features
    feat_tag: 'Почему Linkora',
    feat_title_1: 'Всё что нужно',
    feat_title_em: 'в путешествии',
    feat1_title: 'Мгновенная доставка',
    feat1_text: 'QR-код в Telegram за секунды после оплаты. Никакого ожидания и курьеров.',
    feat2_title: 'Глобальное покрытие',
    feat2_text: '200+ стран. Одно место для всех потребностей в связи во время путешествий.',
    feat3_title: 'Все устройства',
    feat3_text: 'iPhone XS+, Samsung Galaxy S20+, Google Pixel 3+ и большинство современных Android.',
    feat4_title: 'Безопасная оплата',
    feat4_text: 'Telegram Stars и криптовалюта для максимальной конфиденциальности. Никаких данных карт.',
    feat5_title: 'Поддержка 24/7',
    feat5_text: 'Команда доступна круглосуточно через Telegram для решения любых вопросов.',
    feat6_title: 'Сохраните номер',
    feat6_text: 'Ваша обычная SIM остаётся в телефоне. Местные данные + домашний номер одновременно.',

    // Pricing
    price_tag: 'Тарифы',
    price_title_1: 'Живые',
    price_title_em: 'тарифы',
    price_starter: 'Стартовый',
    price_recommended: 'Рекомендованный',
    price_explorer: 'Исследователь',
    price_badge: 'Рекомендованный',
    price_unlimited: '∞ Безлимит · 30 дней',
    price_buy: 'Купить',
    price_more: 'Больше тарифов в',
    price_tg_bot: 'Telegram-боте',
    price_more_end: '— региональные и страновые планы.',
    price_note: '✦ Активация за 1 минуту · Без контракта · Отмена в любой момент',

    // Regions
    regions_tag: 'Покрытие',
    regions_title_1: 'Работает',
    regions_title_em: 'везде',

    // CTA
    cta_tag: 'Начать',
    cta_title_1: 'Готов к',
    cta_title_em: 'свободному интернету?',
    cta_sub: 'Присоединяйтесь к путешественникам которые уже забыли о роуминге.',
    cta_btn: 'Открыть в Telegram',

    // FAQ
    faq_tag: 'Вопросы',
    faq_title_1: 'Частые',
    faq_title_em: 'вопросы',

    // Footer
    footer_company: 'Компания',
    footer_support: 'Поддержка',
    footer_rights: 'Все права защищены',
  },

  en: {
    nav_how: 'How it works',
    nav_pricing: 'Pricing',
    nav_faq: 'FAQ',
    nav_offer: 'Terms',
    nav_cta: 'Get eSIM',

    hero_badge: 'Available in 200+ countries',
    hero_title_1: 'Freedom',
    hero_title_2: 'to be',
    hero_title_em: 'online',
    hero_sub: 'Instant eSIM for travelers. No physical cards — just seamless connectivity anywhere in the world.',
    hero_btn_tg: 'Open in Telegram',
    hero_btn_more: 'Learn more',

    stat_countries: 'Countries',
    stat_speed: 'Speed',
    stat_activation: 'Activation',
    stat_support: 'Support',

    how_tag: 'Simple & Fast',
    how_title_1: 'Three steps to',
    how_title_em: 'free internet',
    step1_title: 'Choose a plan',
    step1_text: 'Open the Telegram bot and select the right plan for your country or region.',
    step2_title: 'Pay',
    step2_text: 'Instant payment via Telegram Stars or cryptocurrency. No bank cards needed.',
    step3_title: 'Activate',
    step3_text: 'Get a QR code in Telegram and scan it in your phone settings. Done in a minute.',
    how_hint: 'Detailed activation guide →',
    how_hint_link: 'How to activate eSIM',

    feat_tag: 'Why Linkora',
    feat_title_1: 'Everything you need',
    feat_title_em: 'while traveling',
    feat1_title: 'Instant delivery',
    feat1_text: 'QR code in Telegram seconds after payment. No waiting, no couriers.',
    feat2_title: 'Global coverage',
    feat2_text: '200+ countries. One place for all your connectivity needs while traveling.',
    feat3_title: 'All devices',
    feat3_text: 'iPhone XS+, Samsung Galaxy S20+, Google Pixel 3+ and most modern Android devices.',
    feat4_title: 'Secure payment',
    feat4_text: 'Telegram Stars and crypto for maximum privacy. No card data required.',
    feat5_title: '24/7 Support',
    feat5_text: 'Team available around the clock via Telegram to resolve any issues.',
    feat6_title: 'Keep your number',
    feat6_text: 'Your regular SIM stays in the phone. Local data + home number simultaneously.',

    price_tag: 'Pricing',
    price_title_1: 'Live',
    price_title_em: 'plans',
    price_starter: 'Starter',
    price_recommended: 'Recommended',
    price_explorer: 'Explorer',
    price_badge: 'Recommended',
    price_unlimited: '∞ Unlimited · 30 days',
    price_buy: 'Buy',
    price_more: 'More plans in',
    price_tg_bot: 'Telegram bot',
    price_more_end: '— regional and country plans.',
    price_note: '✦ 1 minute activation · No contract · Cancel anytime',

    regions_tag: 'Coverage',
    regions_title_1: 'Works',
    regions_title_em: 'everywhere',

    cta_tag: 'Get started',
    cta_title_1: 'Ready for',
    cta_title_em: 'free internet?',
    cta_sub: 'Join travelers who have already forgotten about roaming.',
    cta_btn: 'Open in Telegram',

    faq_tag: 'Questions',
    faq_title_1: 'Frequently',
    faq_title_em: 'asked',

    footer_company: 'Company',
    footer_support: 'Support',
    footer_rights: 'All rights reserved',
  },

  zh: {
    nav_how: '使用方法',
    nav_pricing: '价格',
    nav_faq: '常见问题',
    nav_offer: '条款',
    nav_cta: '获取eSIM',

    hero_badge: '覆盖200+国家',
    hero_title_1: '自由',
    hero_title_2: '随时',
    hero_title_em: '在线',
    hero_sub: '为旅行者提供即时eSIM。无需实体卡——在世界任何地方轻松连接。',
    hero_btn_tg: '在Telegram中打开',
    hero_btn_more: '了解更多',

    stat_countries: '国家',
    stat_speed: '速度',
    stat_activation: '激活',
    stat_support: '支持',

    how_tag: '简单快速',
    how_title_1: '三步实现',
    how_title_em: '自由上网',
    step1_title: '选择套餐',
    step1_text: '打开Telegram机器人，为您的国家或地区选择合适的套餐。',
    step2_title: '付款',
    step2_text: '通过Telegram Stars或加密货币即时付款。无需银行卡。',
    step3_title: '激活',
    step3_text: '在Telegram中获取二维码，在手机设置中扫描。一分钟完成。',
    how_hint: '详细激活指南 →',
    how_hint_link: '如何激活eSIM',

    feat_tag: '为何选择Linkora',
    feat_title_1: '旅行中',
    feat_title_em: '所需一切',
    feat1_title: '即时交付',
    feat1_text: '付款后几秒钟内在Telegram收到二维码。无需等待。',
    feat2_title: '全球覆盖',
    feat2_text: '200+国家。旅行中所有通信需求的一站式服务。',
    feat3_title: '全设备支持',
    feat3_text: 'iPhone XS+、三星Galaxy S20+、谷歌Pixel 3+及大多数现代安卓设备。',
    feat4_title: '安全支付',
    feat4_text: '使用Telegram Stars和加密货币保护最大隐私。无需卡片数据。',
    feat5_title: '24/7支持',
    feat5_text: '团队通过Telegram全天候提供支持。',
    feat6_title: '保留您的号码',
    feat6_text: '您的普通SIM卡继续留在手机中。同时使用本地数据和家庭号码。',

    price_tag: '价格',
    price_title_1: '实时',
    price_title_em: '套餐',
    price_starter: '入门版',
    price_recommended: '推荐版',
    price_explorer: '探索版',
    price_badge: '推荐',
    price_unlimited: '∞ 无限流量 · 30天',
    price_buy: '购买',
    price_more: '更多套餐在',
    price_tg_bot: 'Telegram机器人',
    price_more_end: '— 区域和国家套餐。',
    price_note: '✦ 1分钟激活 · 无合同 · 随时取消',

    regions_tag: '覆盖范围',
    regions_title_1: '全球',
    regions_title_em: '通用',

    cta_tag: '开始使用',
    cta_title_1: '准备好',
    cta_title_em: '自由上网了吗？',
    cta_sub: '加入已经忘记漫游费的旅行者行列。',
    cta_btn: '在Telegram中打开',

    faq_tag: '问题',
    faq_title_1: '常见',
    faq_title_em: '问题',

    footer_company: '公司',
    footer_support: '支持',
    footer_rights: '版权所有',
  },

  es: {
    nav_how: 'Cómo funciona',
    nav_pricing: 'Precios',
    nav_faq: 'FAQ',
    nav_offer: 'Términos',
    nav_cta: 'Obtener eSIM',

    hero_badge: 'Disponible en 200+ países',
    hero_title_1: 'Libertad',
    hero_title_2: 'de estar',
    hero_title_em: 'conectado',
    hero_sub: 'eSIM instantánea para viajeros. Sin tarjetas físicas — solo conectividad perfecta en cualquier lugar del mundo.',
    hero_btn_tg: 'Abrir en Telegram',
    hero_btn_more: 'Saber más',

    stat_countries: 'Países',
    stat_speed: 'Velocidad',
    stat_activation: 'Activación',
    stat_support: 'Soporte',

    how_tag: 'Simple y rápido',
    how_title_1: 'Tres pasos hacia',
    how_title_em: 'internet libre',
    step1_title: 'Elige un plan',
    step1_text: 'Abre el bot de Telegram y selecciona el plan adecuado para tu país o región.',
    step2_title: 'Paga',
    step2_text: 'Pago instantáneo con Telegram Stars o criptomoneda. Sin tarjetas bancarias.',
    step3_title: 'Activa',
    step3_text: 'Recibe un código QR en Telegram y escanéalo en la configuración del teléfono. Listo en un minuto.',
    how_hint: 'Guía detallada de activación →',
    how_hint_link: 'Cómo activar eSIM',

    feat_tag: 'Por qué Linkora',
    feat_title_1: 'Todo lo que necesitas',
    feat_title_em: 'al viajar',
    feat1_title: 'Entrega instantánea',
    feat1_text: 'Código QR en Telegram segundos después del pago. Sin esperas ni mensajeros.',
    feat2_title: 'Cobertura global',
    feat2_text: '200+ países. Un lugar para todas tus necesidades de conectividad al viajar.',
    feat3_title: 'Todos los dispositivos',
    feat3_text: 'iPhone XS+, Samsung Galaxy S20+, Google Pixel 3+ y la mayoría de Android modernos.',
    feat4_title: 'Pago seguro',
    feat4_text: 'Telegram Stars y cripto para máxima privacidad. Sin datos de tarjeta.',
    feat5_title: 'Soporte 24/7',
    feat5_text: 'Equipo disponible las 24 horas por Telegram para resolver cualquier problema.',
    feat6_title: 'Conserva tu número',
    feat6_text: 'Tu SIM normal se queda en el teléfono. Datos locales + número de casa simultáneamente.',

    price_tag: 'Precios',
    price_title_1: 'Planes',
    price_title_em: 'en vivo',
    price_starter: 'Básico',
    price_recommended: 'Recomendado',
    price_explorer: 'Explorador',
    price_badge: 'Recomendado',
    price_unlimited: '∞ Ilimitado · 30 días',
    price_buy: 'Comprar',
    price_more: 'Más planes en',
    price_tg_bot: 'bot de Telegram',
    price_more_end: '— planes regionales y por país.',
    price_note: '✦ Activación en 1 minuto · Sin contrato · Cancela cuando quieras',

    regions_tag: 'Cobertura',
    regions_title_1: 'Funciona',
    regions_title_em: 'en todas partes',

    cta_tag: 'Empezar',
    cta_title_1: '¿Listo para',
    cta_title_em: 'internet libre?',
    cta_sub: 'Únete a los viajeros que ya olvidaron el roaming.',
    cta_btn: 'Abrir en Telegram',

    faq_tag: 'Preguntas',
    faq_title_1: 'Preguntas',
    faq_title_em: 'frecuentes',

    footer_company: 'Empresa',
    footer_support: 'Soporte',
    footer_rights: 'Todos los derechos reservados',
  },

  de: {
    nav_how: 'Wie es funktioniert',
    nav_pricing: 'Preise',
    nav_faq: 'FAQ',
    nav_offer: 'AGB',
    nav_cta: 'eSIM holen',

    hero_badge: 'Verfügbar in 200+ Ländern',
    hero_title_1: 'Freiheit',
    hero_title_2: 'online',
    hero_title_em: 'zu sein',
    hero_sub: 'Sofortige eSIM für Reisende. Keine physischen Karten — nur nahtlose Konnektivität überall auf der Welt.',
    hero_btn_tg: 'In Telegram öffnen',
    hero_btn_more: 'Mehr erfahren',

    stat_countries: 'Länder',
    stat_speed: 'Geschwindigkeit',
    stat_activation: 'Aktivierung',
    stat_support: 'Support',

    how_tag: 'Einfach & Schnell',
    how_title_1: 'Drei Schritte zum',
    how_title_em: 'freien Internet',
    step1_title: 'Plan wählen',
    step1_text: 'Öffnen Sie den Telegram-Bot und wählen Sie den richtigen Plan für Ihr Land oder Ihre Region.',
    step2_title: 'Bezahlen',
    step2_text: 'Sofortige Zahlung per Telegram Stars oder Kryptowährung. Keine Bankkarten erforderlich.',
    step3_title: 'Aktivieren',
    step3_text: 'Erhalten Sie einen QR-Code in Telegram und scannen Sie ihn in den Telefoneinstellungen. Fertig in einer Minute.',
    how_hint: 'Detaillierte Aktivierungsanleitung →',
    how_hint_link: 'Wie man eSIM aktiviert',

    feat_tag: 'Warum Linkora',
    feat_title_1: 'Alles was Sie',
    feat_title_em: 'auf Reisen brauchen',
    feat1_title: 'Sofortige Lieferung',
    feat1_text: 'QR-Code in Telegram Sekunden nach der Zahlung. Kein Warten, keine Kuriere.',
    feat2_title: 'Globale Abdeckung',
    feat2_text: '200+ Länder. Ein Ort für alle Konnektivitätsbedürfnisse beim Reisen.',
    feat3_title: 'Alle Geräte',
    feat3_text: 'iPhone XS+, Samsung Galaxy S20+, Google Pixel 3+ und die meisten modernen Android-Geräte.',
    feat4_title: 'Sichere Zahlung',
    feat4_text: 'Telegram Stars und Krypto für maximale Privatsphäre. Keine Kartendaten erforderlich.',
    feat5_title: '24/7 Support',
    feat5_text: 'Team rund um die Uhr über Telegram erreichbar.',
    feat6_title: 'Nummer behalten',
    feat6_text: 'Ihre normale SIM bleibt im Telefon. Lokale Daten + Heimnummer gleichzeitig.',

    price_tag: 'Preise',
    price_title_1: 'Aktuelle',
    price_title_em: 'Tarife',
    price_starter: 'Starter',
    price_recommended: 'Empfohlen',
    price_explorer: 'Explorer',
    price_badge: 'Empfohlen',
    price_unlimited: '∞ Unbegrenzt · 30 Tage',
    price_buy: 'Kaufen',
    price_more: 'Mehr Tarife im',
    price_tg_bot: 'Telegram-Bot',
    price_more_end: '— regionale und Ländertarife.',
    price_note: '✦ Aktivierung in 1 Minute · Kein Vertrag · Jederzeit kündbar',

    regions_tag: 'Abdeckung',
    regions_title_1: 'Funktioniert',
    regions_title_em: 'überall',

    cta_tag: 'Loslegen',
    cta_title_1: 'Bereit für',
    cta_title_em: 'freies Internet?',
    cta_sub: 'Schließen Sie sich Reisenden an, die das Roaming vergessen haben.',
    cta_btn: 'In Telegram öffnen',

    faq_tag: 'Fragen',
    faq_title_1: 'Häufig gestellte',
    faq_title_em: 'Fragen',

    footer_company: 'Unternehmen',
    footer_support: 'Support',
    footer_rights: 'Alle Rechte vorbehalten',
  }
};

// Current language
// Detect language: saved > browser > ru
function detectLang() {
  const saved = localStorage.getItem('linkora_lang');
  if (saved && ['ru','en','zh','es','de'].includes(saved)) return saved;
  const browser = (navigator.language || navigator.userLanguage || 'ru').toLowerCase().slice(0,2);
  const map = { ru:'ru', en:'en', zh:'zh', es:'es', de:'de' };
  return map[browser] || 'ru';
}
let currentLang = detectLang();

// Language names for switcher
const LANG_NAMES = {
  ru: { flag: '🇷🇺', name: 'RU' },
  en: { flag: '🇬🇧', name: 'EN' },
  zh: { flag: '🇨🇳', name: 'ZH' },
  es: { flag: '🇪🇸', name: 'ES' },
  de: { flag: '🇩🇪', name: 'DE' },
};

function t(key) {
  return TRANSLATIONS[currentLang][key] || TRANSLATIONS['ru'][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('linkora_lang', lang);
  applyTranslations();
  updateLangSwitcher();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });
  // Update lang attribute
  document.documentElement.lang = currentLang;
}

function updateLangSwitcher() {
  const btn = document.getElementById('langCurrentBtn');
  if (btn) {
    const l = LANG_NAMES[currentLang] || LANG_NAMES['ru'];
    btn.innerHTML = `${l.flag} ${l.name} <span style="opacity:0.5;font-size:10px;">▾</span>`;
  }
  document.querySelectorAll('.lang-option').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === currentLang);
  });
}

function toggleLangMenu() {
  const menu = document.getElementById('langMenu');
  menu.classList.toggle('open');
}

// Close on outside click
document.addEventListener('click', e => {
  const switcher = document.getElementById('langSwitcher');
  if (switcher && !switcher.contains(e.target)) {
    document.getElementById('langMenu').classList.remove('open');
  }
});

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  updateLangSwitcher();
});

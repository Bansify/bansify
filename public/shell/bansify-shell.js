/*
 * Bansify shell for the Accounts dashboard.
 *
 * The same five cards as bansify.com, Mail and AI: the left panel, a search pill and the
 * social card above the content, the dashboard in the content card, and the app dock.
 * The dashboard's own nav buttons, theme toggle and account menu are still the controls
 * behind the shell, so no behaviour is reimplemented.
 */
(function () {
  'use strict';

  var CONFIG = window.BANSIFY_SHELL || {};
  var BRAND = CONFIG.brand || { name: 'Bansify', product: 'App', icon: '/icon-192.png' };
  var CONTENT = CONFIG.contentSelector || '#root';
  var SECTIONS = CONFIG.sections || [];

  var APPS = [
    { label: 'Mail', icon: 'mail', url: 'https://mail.bansify.com' },
    { label: 'Drive', icon: 'hard_drive', url: 'https://drive.bansify.com' },
    { label: 'Meet', icon: 'videocam', url: 'https://meet.bansify.com' },
    { label: 'Pay', icon: 'payments', url: 'https://pay.bansify.com' },
    { label: 'AI', icon: 'auto_awesome', url: 'https://ai.bansify.com' },
    { label: 'Store', icon: 'storefront', url: 'https://store.bansify.com' },
    { label: 'GitPlus', icon: 'code', url: 'https://gitplus.bansify.com' },
  ];

  var SOCIAL = [
    { label: 'Facebook', glyph: 'f', color: '#1877F2', url: 'https://facebook.com/bansifyofficial' },
    { label: 'Instagram', glyph: '◎', color: '#E1306C', url: 'https://instagram.com/bansifyofficial' },
    { label: 'YouTube', glyph: '▶', color: '#FF0000', url: 'https://youtube.com/@bansifyofficial' },
    { label: 'X', glyph: '𝕏', color: '#0F1419', url: 'https://x.com/bansifyofficial' },
    { label: 'LinkedIn', glyph: 'in', color: '#0A66C2', url: 'https://linkedin.com/company/bansifyofficial' },
    { label: 'Telegram', glyph: '✈', color: '#229ED9', url: 'https://t.me/bansifyofficial' },
    { label: 'GitHub', glyph: '⌨', color: '#181717', url: 'https://github.com/Bansify' },
  ];

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function sym(name) {
    return '<span class="msym">' + name + '</span>';
  }

  function selectSection(id) {
    var navSelector = (window.BANSIFY_SHELL && window.BANSIFY_SHELL.navSelector) || '.me-nav-item[data-section]';
    var target = document.querySelector(navSelector.replace('[data-section]', '[data-section="' + id + '"]'));
    if (target) target.click();
    syncActive(id);
  }

  function syncActive(id) {
    document.querySelectorAll('.bs-nav-item').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.section === id);
    });
  }

  function toggleTheme() {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) toggle.click();
    setTimeout(paintThemeIcon, 60);
  }

  function paintThemeIcon() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark');
    document.querySelectorAll('.bs-theme-inline').forEach(function (btn) {
      btn.innerHTML = sym(dark ? 'light_mode' : 'dark_mode');
    });
  }

  function openPane(app) {
    var existing = document.querySelector('.bs-pane');
    if (existing) existing.remove();

    var pane = el('section', 'bs-pane');
    pane.setAttribute('aria-label', app.label);

    var head = el('div', 'bs-pane-head');
    var mark = el('span', 'bs-dock-app', app.icon ? sym(app.icon) : '');
    if (app.logo) mark.innerHTML = '<img src="' + app.logo + '" alt="" />';
    head.appendChild(mark);
    head.appendChild(el('span', 'bs-pane-title', app.label));

    var open = el('a', 'bs-pane-btn', sym('open_in_new'));
    open.href = app.url;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.title = 'Open in tab';
    open.setAttribute('aria-label', 'Open in a new tab');
    head.appendChild(open);

    var close = el('button', 'bs-pane-btn', sym('close'));
    close.type = 'button';
    close.title = 'Close';
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', function () {
      pane.remove();
      document.body.classList.remove('bs-has-pane');
    });
    head.appendChild(close);

    var frame = document.createElement('iframe');
    frame.src = app.url;
    frame.title = app.label;
    frame.loading = 'lazy';

    pane.appendChild(head);
    pane.appendChild(frame);
    document.body.appendChild(pane);
    document.body.classList.add('bs-has-pane');
  }

  function buildPanel() {
    var panel = el('aside', 'bs-panel');
    panel.setAttribute('aria-label', 'Account navigation');

    var brand = el('div', 'bs-brand');
    var mark = el('button', 'bs-brand-mark', 'B');
    mark.type = 'button';
    mark.setAttribute('aria-label', 'Toggle panel');
    mark.addEventListener('click', function () {
      document.body.classList.toggle('bs-collapsed');
      try {
        localStorage.setItem('bs-shell-collapsed', document.body.classList.contains('bs-collapsed') ? '1' : '0');
      } catch (e) {}
    });
    brand.appendChild(mark);
    brand.appendChild(el('span', 'bs-brand-name', '<b>' + BRAND.name + '</b> ' + BRAND.product));

    var collapse = el('button', 'bs-collapse', sym('chevron_left'));
    collapse.type = 'button';
    collapse.setAttribute('aria-label', 'Collapse panel');
    collapse.addEventListener('click', function () {
      document.body.classList.add('bs-collapsed');
      try {
        localStorage.setItem('bs-shell-collapsed', '1');
      } catch (e) {}
    });
    brand.appendChild(collapse);
    panel.appendChild(brand);

    var nav = el('nav', 'bs-nav');
    SECTIONS.forEach(function (section) {
      var btn = el('button', 'bs-nav-item', sym(section.icon) + '<span>' + section.label + '</span>');
      btn.type = 'button';
      btn.dataset.section = section.id;
      btn.title = section.label;
      btn.addEventListener('click', function () {
        selectSection(section.id);
      });
      nav.appendChild(btn);
    });
    panel.appendChild(nav);

    var footer = el('div', 'bs-footer');
    footer.appendChild(el('div', 'bs-divider'));

    var profile = el('button', 'bs-profile');
    profile.type = 'button';
    var avatar = el('span', 'bs-avatar', 'B');
    var text = el('span', 'bs-profile-text');
    var name = el('span', 'bs-profile-name', 'Account');
    var email = el('span', 'bs-profile-email', '');
    text.appendChild(name);
    text.appendChild(email);
    var theme = el('span', 'bs-theme-inline', sym('dark_mode'));
    theme.setAttribute('role', 'button');
    theme.setAttribute('tabindex', '0');
    theme.setAttribute('aria-label', 'Toggle theme');
    theme.addEventListener('click', function (event) {
      event.stopPropagation();
      toggleTheme();
    });
    profile.appendChild(avatar);
    profile.appendChild(text);
    profile.appendChild(theme);
    profile.addEventListener('click', function () {
      var menu = document.getElementById('acct-switch-btn');
      if (menu) menu.click();
    });
    footer.appendChild(profile);
    panel.appendChild(footer);

    function refreshProfile() {
      var srcAvatar = document.getElementById('appbar-avatar');
      var srcName = document.getElementById('menu-name');
      var srcEmail = document.getElementById('menu-email');
      var avatarText = ((srcAvatar && srcAvatar.textContent) || 'B').trim().slice(0, 1).toUpperCase() || 'B';
      var nameText = ((srcName && srcName.textContent) || 'Account').trim() || 'Account';
      var emailText = ((srcEmail && srcEmail.textContent) || '').trim();
      avatar.textContent = avatarText;
      name.textContent = nameText;
      email.textContent = emailText === '…' ? '' : emailText;
      var dockAvatar = document.querySelector('.bs-dock-avatar');
      if (dockAvatar) dockAvatar.textContent = avatarText;
    }
    refreshProfile();
    setInterval(refreshProfile, 2000);

    return panel;
  }

  function buildTop() {
    var top = el('div', 'bs-top');

    var search = el('div', 'bs-search', sym('search'));
    var input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Search account settings';
    input.setAttribute('aria-label', 'Search account settings');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      document.querySelectorAll('.bs-nav-item').forEach(function (btn) {
        var label = (btn.textContent || '').toLowerCase();
        btn.style.display = !q || label.indexOf(q) !== -1 ? '' : 'none';
      });
    });
    search.appendChild(input);
    top.appendChild(search);

    var social = el('div', 'bs-social');
    SOCIAL.forEach(function (item) {
      var link = el('a', null, item.glyph);
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.title = item.label + ' · @bansifyofficial';
      link.setAttribute('aria-label', item.label + ' @bansifyofficial');
      link.style.background = item.color;
      social.appendChild(link);
    });
    top.appendChild(social);

    return top;
  }

  function buildDock() {
    var dock = el('aside', 'bs-dock');
    dock.setAttribute('aria-label', 'Bansify apps');

    var avatar = el('a', 'bs-dock-avatar', 'B');
    avatar.href = '/me';
    avatar.setAttribute('aria-label', 'Account');
    dock.appendChild(avatar);
    dock.appendChild(el('div', 'bs-dock-divider'));

    APPS.forEach(function (app) {
      var button = el('button', 'bs-dock-app');
      button.type = 'button';
      button.title = app.label;
      button.setAttribute('aria-label', 'Open ' + app.label);
      var logo = app.url.replace(/\/+$/, '') + '/icon-192.png';
      var img = document.createElement('img');
      img.src = logo;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = function () {
        button.innerHTML = sym(app.icon);
      };
      button.appendChild(img);
      app.logo = logo;
      button.addEventListener('click', function () {
        openPane(app);
      });
      dock.appendChild(button);
      dock.appendChild(el('div', 'bs-dock-divider'));
    });

    return dock;
  }

  function init() {
    var root = document.querySelector(CONTENT);
    if (!root) return;

    document.body.classList.add('bs-shell-on');
    root.classList.add('bs-content');
    document.body.appendChild(buildPanel());
    document.body.appendChild(buildTop());
    document.body.appendChild(buildDock());

    try {
      if (localStorage.getItem('bs-shell-collapsed') === '1') {
        document.body.classList.add('bs-collapsed');
      }
    } catch (e) {}

    var navSelector = CONFIG.navSelector || '.me-nav-item[data-section]';
    document.querySelectorAll(navSelector).forEach(function (btn) {
      btn.addEventListener('click', function () {
        syncActive(btn.dataset.section);
      });
    });
    syncActive('home');
    paintThemeIcon();
    setInterval(paintThemeIcon, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

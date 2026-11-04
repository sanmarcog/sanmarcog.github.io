(() => {
  const website = document.currentScript.dataset.websiteId;
  const hostname = 'sanmarcog.github.io';
  const pages = new Set([
    '/', '/index.html', '/about.html', '/ai-safety.html', '/math.html',
    '/teaching.html', '/mathematical-reasoning.html',
    '/symmetric-tensor-categories.html', '/topology.html', '/graph-theory.html'
  ]);
  const privacySignal = () => navigator.globalPrivacyControl === true ||
    [navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack]
      .some(value => value === '1' || value === 'yes');
  const optedOut = () => {
    try { return Boolean(localStorage.getItem('umami.disabled')); }
    catch { return true; }
  };

  const controls = document.getElementById('analytics-preferences');
  if (controls) {
    const status = document.getElementById('analytics-status');
    const button = document.getElementById('analytics-toggle');
    const update = () => {
      const signal = privacySignal();
      const disabled = optedOut();
      status.textContent = signal ? 'Analytics is off because of your browser’s privacy preference.' :
        disabled ? 'Analytics is off in this browser.' : 'Basic page statistics are enabled in this browser.';
      button.textContent = disabled ? 'Allow basic analytics' : 'Turn off analytics';
      button.disabled = signal;
    };
    controls.hidden = false;
    update();
    button.addEventListener('click', () => {
      try {
        if (optedOut()) localStorage.removeItem('umami.disabled');
        else localStorage.setItem('umami.disabled', '1');
        update();
      } catch {
        status.textContent = 'Your browser cannot save this preference. Analytics remains off.';
        button.disabled = true;
      }
    });
  }

  // Check privacy preferences before contacting Umami, including for its script.
  if (location.hostname !== hostname || !pages.has(location.pathname) ||
      privacySignal() || optedOut() || !website) return;

  let referrer = '';
  try {
    const source = new URL(document.referrer);
    if (['http:', 'https:'].includes(source.protocol) && source.hostname !== hostname) {
      referrer = source.origin;
    }
  } catch { /* Empty or invalid referrers are omitted. */ }

  const url = ['/', '/index.html', '/about.html'].includes(location.pathname) ? '/' : location.pathname;
  window.sanmarcoAnalyticsBeforeSend = (type, payload) => {
    if (type !== 'event' || payload.name || privacySignal() || optedOut()) return false;
    // Allow only a page view: no custom IDs, screen size, language or extra data.
    return { website, hostname, url, referrer };
  };

  const tracker = document.createElement('script');
  tracker.src = 'https://cloud.umami.is/script.js';
  tracker.async = true;
  tracker.referrerPolicy = 'no-referrer';
  Object.assign(tracker.dataset, {
    websiteId: website, domains: hostname, autoTrack: 'false',
    excludeSearch: 'true', excludeHash: 'true', doNotTrack: 'true',
    performance: 'false', errors: 'false', beforeSend: 'sanmarcoAnalyticsBeforeSend'
  });
  // Exactly one page view. No click, scroll, history or download listeners.
  tracker.addEventListener('load', () => {
    if (!privacySignal() && !optedOut()) window.umami?.track({ website, hostname, url, referrer });
  }, { once: true });
  document.head.appendChild(tracker);
})();

(() => {
  const endpoint = document.currentScript.dataset.counterEndpoint;
  const pages = new Set([
    '/', '/index.html', '/about.html', '/ai-safety.html', '/math.html',
    '/teaching.html', '/mathematical-reasoning.html',
    '/symmetric-tensor-categories.html', '/topology.html', '/graph-theory.html'
  ]);
  const privacySignal = () => navigator.globalPrivacyControl === true ||
    [navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack]
      .some(value => value === '1' || value === 'yes');
  const optedOut = () => {
    try {
      // Honor opt-outs saved before this aggregate counter replaced Umami.
      return Boolean(localStorage.getItem('site-counts.disabled') || localStorage.getItem('umami.disabled'));
    } catch { return true; }
  };

  if (!endpoint || location.hostname !== 'sanmarcog.github.io' ||
      !pages.has(location.pathname) || privacySignal() || optedOut()) return;
  // No page URL, referral, browser properties or identifier in the request.
  // Credentials and Referer are explicitly omitted. Do not retry or deduplicate.
  fetch(endpoint, {
    method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store',
    referrerPolicy: 'no-referrer', keepalive: true
  }).catch(() => {});
})();

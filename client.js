const DEFAULT_URL = 'https://recloud-turnstile.bunowave.shop';

let pending = null;

export function load(options = {}) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('The ReCloud widget can only be loaded in a browser.'));
  }
  if (window.recloud) {
    return Promise.resolve(window.recloud);
  }
  if (pending) {
    return pending;
  }

  const base = String(options.url || DEFAULT_URL).replace(/\/+$/, '');

  pending = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = base + '/recloud.js';
    script.async = true;
    script.onload = () => (window.recloud ? resolve(window.recloud) : reject(new Error('ReCloud failed to initialise.')));
    script.onerror = () => {
      pending = null;
      reject(new Error('Could not load the ReCloud script.'));
    };
    document.head.appendChild(script);
  });

  return pending;
}

export async function render(element, options) {
  const widget = await load({ url: options.url });

  widget.render(element, {
    sitekey: options.siteKey,
    theme: options.theme,
    size: options.size,
    align: options.align,
    accent: options.accent,
    language: options.language,
    callback: options.onVerify,
    'error-callback': options.onError,
  });

  return element;
}

export function reset(element) {
  if (typeof window !== 'undefined' && window.recloud) {
    window.recloud.reset(element);
  }
}

export function getResponse(element) {
  return typeof window !== 'undefined' && window.recloud ? window.recloud.getResponse(element) : null;
}

export function destroy(element) {
  if (typeof window !== 'undefined' && window.recloud) {
    window.recloud.destroy(element);
  }
}

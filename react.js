'use client';

import React from 'react';
import { render, destroy, reset, getResponse } from './client.js';

export const ReCloud = React.forwardRef(function ReCloud(props, ref) {
  const { siteKey, theme, size, align, accent, language, url, onVerify, onError, className, style } = props;
  const container = React.useRef(null);
  const node = React.useRef(null);
  const handlers = React.useRef({ onVerify, onError });
  handlers.current = { onVerify, onError };

  React.useImperativeHandle(ref, () => ({
    reset: () => {
      if (node.current) reset(node.current);
    },
    getResponse: () => (node.current ? getResponse(node.current) : null),
  }), []);

  React.useEffect(() => {
    const el = document.createElement('div');
    node.current = el;
    container.current.appendChild(el);
    let alive = true;

    render(el, {
      siteKey,
      theme,
      size,
      align,
      accent,
      language,
      url,
      onVerify: (token) => handlers.current.onVerify && handlers.current.onVerify(token),
      onError: (code) => handlers.current.onError && handlers.current.onError(code),
    }).catch(() => {
      if (alive && handlers.current.onError) handlers.current.onError('load-failed');
    });

    return () => {
      alive = false;
      destroy(el);
      el.remove();
      node.current = null;
    };
  }, [siteKey, theme, size, align, accent, language, url]);

  return React.createElement('div', { ref: container, className, style });
});

const DEFAULT_URL = 'https://recloud-turnstile.bunowave.shop';

export class RecloudError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RecloudError';
  }
}

function unavailable(options, code) {
  const open = options.failOpen === true;
  return { success: open, errorCodes: [code], hostname: null, risk: null, challengeTs: null, degraded: open };
}

export async function verify(token, options = {}) {
  const secret = options.secret || (typeof process !== 'undefined' && process.env ? process.env.RECLOUD_SECRET : undefined);
  if (!secret) {
    throw new RecloudError('A secret key is required. Pass options.secret or set RECLOUD_SECRET.');
  }

  const value = typeof token === 'string' ? token.trim() : '';
  if (!value) {
    return { success: false, errorCodes: ['missing-input'], hostname: null, risk: null, challengeTs: null, degraded: false };
  }

  const body = new URLSearchParams({ secret, response: value });
  if (options.remoteip) {
    body.set('remoteip', options.remoteip);
  }

  const base = String(options.url || DEFAULT_URL).replace(/\/+$/, '');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout ?? 10000);

  try {
    const res = await fetch(base + '/api/v1/siteverify', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
      signal: controller.signal,
    });
    const data = await res.json();

    if (!res.ok || typeof data !== 'object' || data === null) {
      return unavailable(options, 'bad-response');
    }

    return {
      success: data.success === true,
      errorCodes: data['error-codes'] || [],
      hostname: data.hostname ?? null,
      risk: typeof data.risk === 'number' ? data.risk : null,
      challengeTs: data.challenge_ts ?? null,
      degraded: false,
    };
  } catch {
    return unavailable(options, 'network-error');
  } finally {
    clearTimeout(timer);
  }
}

export function middleware(options = {}) {
  const getToken = options.getToken || ((req) => (req.body && req.body['recloud-response']) || (req.headers && req.headers['x-recloud-token']) || (req.query && req.query['recloud-response']));
  const getIp = options.getIp || ((req) => (options.sendIp ? req.ip : undefined));

  return async function recloud(req, res, next) {
    try {
      const result = await verify(getToken(req), { ...options, remoteip: getIp(req) });

      if (!result.success) {
        res.status(400).json({ error: 'Verification failed', errorCodes: result.errorCodes });
        return;
      }

      req.recloud = result;
      next();
    } catch (err) {
      next(err);
    }
  };
}

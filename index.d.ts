export interface VerifyOptions {
  secret?: string;
  url?: string;
  remoteip?: string;
  timeout?: number;
  failOpen?: boolean;
}

export interface VerifyResult {
  success: boolean;
  errorCodes: string[];
  hostname: string | null;
  risk: number | null;
  challengeTs: string | null;
  degraded: boolean;
}

export class RecloudError extends Error {}

export function verify(token: string | null | undefined, options?: VerifyOptions): Promise<VerifyResult>;

export interface MiddlewareOptions extends VerifyOptions {
  sendIp?: boolean;
  getToken?: (req: any) => string | undefined;
  getIp?: (req: any) => string | undefined;
}

export function middleware(options?: MiddlewareOptions): (req: any, res: any, next: (err?: unknown) => void) => Promise<void>;

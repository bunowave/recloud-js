export interface WidgetOptions {
  siteKey: string;
  theme?: 'auto' | 'light' | 'dark';
  size?: 'normal' | 'compact' | 'flexible';
  align?: 'left' | 'center' | 'right';
  accent?: string;
  language?: string;
  url?: string;
  onVerify?: (token: string) => void;
  onError?: (code: string) => void;
}

export function load(options?: { url?: string }): Promise<unknown>;
export function render(element: HTMLElement, options: WidgetOptions): Promise<HTMLElement>;
export function reset(element: HTMLElement): void;
export function getResponse(element: HTMLElement): string | null;
export function destroy(element: HTMLElement): void;

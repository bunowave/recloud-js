import * as React from 'react';

export interface ReCloudProps {
  siteKey: string;
  theme?: 'auto' | 'light' | 'dark';
  size?: 'normal' | 'compact' | 'flexible';
  align?: 'left' | 'center' | 'right';
  accent?: string;
  language?: string;
  url?: string;
  onVerify?: (token: string) => void;
  onError?: (code: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface ReCloudHandle {
  reset(): void;
  getResponse(): string | null;
}

export const ReCloud: React.ForwardRefExoticComponent<ReCloudProps & React.RefAttributes<ReCloudHandle>>;

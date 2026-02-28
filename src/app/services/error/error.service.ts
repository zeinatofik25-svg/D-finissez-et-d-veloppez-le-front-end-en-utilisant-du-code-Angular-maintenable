import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  handleError(err: Error | { message?: string } | unknown): string {
    const msg =
      err instanceof Error
        ? err.message
        : typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message ?? 'Erreur inconnue'
        : 'Erreur inconnue';
    // eslint-disable-next-line no-console
    console.error('[ErrorService]', err);
    return msg;
  }
}

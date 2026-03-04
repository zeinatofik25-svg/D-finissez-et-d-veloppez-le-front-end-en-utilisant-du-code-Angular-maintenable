import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  handleError(err: unknown): string {
    let msg = 'Erreur inconnue';

    if (err instanceof Error) {
      msg = err.message;
    } else if (typeof err === 'object' && err !== null && 'message' in err) {
      const maybeMessage = (err as { message?: unknown }).message;
      msg = typeof maybeMessage === 'string' ? maybeMessage : 'Erreur inconnue';
    }
    // eslint-disable-next-line no-console
    console.error('[ErrorService]', err);

    // Avoid exposing technical details to the user.
    if (/country\s+.*not found/i.test(msg)) {
      return 'Pays introuvable';
    }

    return 'Une erreur est survenue';
  }
}

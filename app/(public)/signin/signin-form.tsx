'use client';

import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCsrfToken } from 'next-auth/react';

import { getAuthErrorMessage } from '@/lib/auth-errors';

import { requestEmailSignIn } from './actions';
import {
  EMAIL_SIGN_IN_INITIAL_STATE,
  type EmailSignInFormState,
} from './email-signin-state';

type EmailSignInFormProps = {
  csrfToken?: string;
};

export function EmailSignInForm({ csrfToken }: EmailSignInFormProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? undefined;
  const queryErrorType = searchParams.get('error');
  const queryErrorMessage = getAuthErrorMessage(queryErrorType);

  const [state, formAction, isPending] = useActionState<
    EmailSignInFormState,
    FormData
  >(requestEmailSignIn, EMAIL_SIGN_IN_INITIAL_STATE);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [csrfTokenValue, setCsrfTokenValue] = useState<string | undefined>(csrfToken);
  const [csrfStatus, setCsrfStatus] = useState<'idle' | 'loading' | 'error'>(
    csrfToken ? 'idle' : 'loading',
  );

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
    }
  }, [state.status]);

  const ensureCsrfToken = useCallback(async () => {
    setCsrfStatus('loading');
    try {
      const token = await getCsrfToken();
      setCsrfTokenValue(token ?? undefined);
      setCsrfStatus(token ? 'idle' : 'error');
    } catch (error) {
      console.error('Échec du chargement du jeton CSRF NextAuth', error);
      setCsrfStatus('error');
    }
  }, []);

  useEffect(() => {
    if (csrfToken) {
      setCsrfTokenValue(csrfToken);
      setCsrfStatus('idle');
      return;
    }

    void ensureCsrfToken();
  }, [csrfToken, ensureCsrfToken]);

  useEffect(() => {
    if (state.errorType === 'MissingCSRF') {
      void ensureCsrfToken();
    }
  }, [ensureCsrfToken, state.errorType]);

  useEffect(() => {
    if (queryErrorType === 'MissingCSRF') {
      void ensureCsrfToken();
    }
  }, [ensureCsrfToken, queryErrorType]);

  const successQuery = searchParams.get('success');
  const successMessage =
    state.status === 'success'
      ? state.message
      : successQuery === 'verification'
        ? 'Le lien magique a été vérifié. Vous pouvez maintenant vous connecter.'
        : undefined;

  const csrfFetchErrorMessage =
    csrfStatus === 'error'
      ? 'Nous ne parvenons pas à sécuriser le formulaire pour le moment. Rafraîchissez la page puis réessayez.'
      : undefined;

  const errorMessages = useMemo(() => {
    const messages = new Set<string>();
    if (state.status === 'error' && state.message) {
      messages.add(state.message);
    }
    if (queryErrorMessage) {
      messages.add(queryErrorMessage);
    }
    if (csrfFetchErrorMessage) {
      messages.add(csrfFetchErrorMessage);
    }
    return Array.from(messages);
  }, [csrfFetchErrorMessage, queryErrorMessage, state.message, state.status]);

  const emailFieldErrors = state.errors?.email;

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {csrfTokenValue ? <input type="hidden" name="csrfToken" value={csrfTokenValue} /> : null}
      {callbackUrl ? <input type="hidden" name="callbackUrl" value={callbackUrl} /> : null}

      <label className="space-y-2 text-left">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="vous@example.com"
          aria-invalid={emailFieldErrors?.length ? 'true' : 'false'}
          aria-describedby={emailFieldErrors?.length ? 'email-error' : undefined}
        />
        {emailFieldErrors?.length ? (
          <p id="email-error" className="text-xs text-red-600">
            {emailFieldErrors[0]}
          </p>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={isPending || csrfStatus !== 'idle'}
        className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {isPending
          ? 'Envoi en cours…'
          : csrfStatus === 'loading'
            ? 'Initialisation…'
            : 'Recevoir un lien magique'}
      </button>

      <div className="space-y-2 text-sm">
        {successMessage ? (
          <p className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-green-700" role="status">
            {successMessage}
          </p>
        ) : null}
        {errorMessages.length > 0 ? (
          <div
            className="space-y-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700"
            role="alert"
          >
            {errorMessages.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        ) : null}
      </div>
    </form>
  );
}

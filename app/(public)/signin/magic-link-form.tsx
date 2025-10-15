'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { requestMagicLink, type MagicLinkActionState } from './actions';

const IDLE_STATE: MagicLinkActionState = { status: 'idle' };

export function MagicLinkForm({
  initialState = IDLE_STATE,
}: {
  initialState?: MagicLinkActionState;
}) {
  const [state, formAction] = useFormState(requestMagicLink, initialState);

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <label className="space-y-2 text-left">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="vous@example.com"
        />
      </label>
      <SubmitButton />
      {state.status !== 'idle' && state.message ? (
        <p
          className={
            state.status === 'success'
              ? 'text-sm text-green-600'
              : 'text-sm text-red-600'
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-80"
      disabled={pending}
    >
      {pending ? 'Envoi en cours…' : 'Recevoir un lien magique'}
    </button>
  );
}

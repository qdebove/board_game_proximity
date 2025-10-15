'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export type MagicLinkActionState =
  | { status: 'idle'; message?: undefined }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

const emailSchema = z.object({
  email: z
    .string({ required_error: "L'adresse email est requise." })
    .email("Merci d'indiquer une adresse email valide."),
});

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  MissingCSRF:
    'Votre session a expiré. Veuillez réessayer de demander un lien de connexion.',
  EmailSignInError:
    "Impossible d'envoyer le lien magique pour le moment. Merci de réessayer dans quelques instants.",
  SignInError:
    'Une erreur est survenue lors de la tentative de connexion. Veuillez réessayer.',
};

function getErrorMessage(type: string): string {
  return (
    AUTH_ERROR_MESSAGES[type] ??
    'Une erreur inattendue est survenue. Veuillez réessayer ou contacter le support si le problème persiste.'
  );
}

export async function requestMagicLink(
  _prevState: MagicLinkActionState,
  formData: FormData,
): Promise<MagicLinkActionState> {
  const rawEmail = formData.get('email');

  if (typeof rawEmail !== 'string') {
    return {
      status: 'error',
      message: "Merci d'indiquer une adresse email valide.",
    };
  }

  const parsed = emailSchema.safeParse({ email: rawEmail.trim() });

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? "Merci d'indiquer une adresse email valide.",
    };
  }

  const submission = new FormData();
  submission.set('email', parsed.data.email.toLowerCase());
  submission.set('redirect', 'false');

  try {
    await signIn('email', submission);

    return {
      status: 'success',
      message: 'Si cette adresse est connue, un lien de connexion vient de vous être envoyé.',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: 'error',
        message: getErrorMessage(error.type ?? 'SignInError'),
      };
    }

    console.error('Magic link request failed', error);

    return {
      status: 'error',
      message:
        'Une erreur inattendue est survenue. Veuillez réessayer ou contacter le support si le problème persiste.',
    };
  }
}

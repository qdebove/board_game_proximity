'use server';

import { signIn } from '@/lib/auth';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { AuthError } from 'next-auth';
import { z } from 'zod';

const emailSignInSchema = z.object({
  email: z
    .string({ required_error: 'Veuillez renseigner votre adresse email.' })
    .min(1, 'Veuillez renseigner votre adresse email.')
    .email('Cette adresse email n’est pas valide.'),
  callbackUrl: z.string().optional(),
  csrfToken: z.string().optional(),
});

export type EmailSignInFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: {
    email?: string[];
  };
};

export const EMAIL_SIGN_IN_INITIAL_STATE: EmailSignInFormState = {
  status: 'idle',
};

export async function requestEmailSignIn(
  _prevState: EmailSignInFormState,
  formData: FormData,
): Promise<EmailSignInFormState> {
  const rawEmail = formData.get('email');
  const rawCallbackUrl = formData.get('callbackUrl');
  const rawCsrfToken = formData.get('csrfToken');

  const parsed = emailSignInSchema.safeParse({
    email: rawEmail,
    callbackUrl:
      typeof rawCallbackUrl === 'string' && rawCallbackUrl.length > 0
        ? rawCallbackUrl
        : undefined,
    csrfToken:
      typeof rawCsrfToken === 'string' && rawCsrfToken.length > 0
        ? rawCsrfToken
        : undefined,
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();

    return {
      status: 'error',
      message: 'Merci de corriger les erreurs indiquées avant de réessayer.',
      errors: fieldErrors,
    };
  }

  try {
    const { email, callbackUrl, csrfToken } = parsed.data;

    const signInOptions: Record<string, unknown> = {
      email,
      redirect: false,
    };

    if (csrfToken) {
      signInOptions.csrfToken = csrfToken;
    }

    if (callbackUrl) {
      signInOptions.redirectTo = callbackUrl;
    }

    await signIn('email', signInOptions);

    return {
      status: 'success',
      message: 'Un lien magique vient de vous être envoyé. Consultez votre boîte mail.',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: 'error',
        message:
          getAuthErrorMessage(error.type) ??
          'Une erreur est survenue lors de l’envoi du lien magique. Veuillez réessayer.',
      };
    }

    return {
      status: 'error',
      message: 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.',
    };
  }
}

import { signIn } from '@/lib/auth'
import { getAuthErrorMessage } from '@/lib/auth-errors'
import { AuthError } from 'next-auth'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { z } from 'zod'
import type { EmailSignInFormState } from './email-signin-state'
import { EmailSignInForm } from './signin-form'

export const runtime = 'nodejs'        // ok de conserver
export const dynamic = 'force-dynamic' // pour éviter tout pré-rendu

const emailSignInSchema = z.object({
  email: z.string().min(1).email(),
  callbackUrl: z.string().optional(),
  csrfToken: z.string().optional(),
})

export default async function SignInPage() {
  const cookieStore = await cookies()
  const csrfCookie = cookieStore.get('authjs.csrf-token')?.value
  const csrfToken = csrfCookie?.split('|')[0]

  // ⬇️ Déclare l'action DANS le même fichier
  async function requestEmailSignIn(
    _prev: EmailSignInFormState,
    formData: FormData
  ): Promise<EmailSignInFormState> {
    'use server'

    const parsed = emailSignInSchema.safeParse({
      email: formData.get('email'),
      callbackUrl: formData.get('callbackUrl') || undefined,
      csrfToken: formData.get('csrfToken') || undefined,
    })

    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten()
      return {
        status: 'error',
        message: 'Merci de corriger les erreurs indiquées avant de réessayer.',
        errorType: 'ValidationError',
        errors: fieldErrors,
      }
    }

    const { email, callbackUrl, csrfToken } = parsed.data
    if (!csrfToken) {
      return {
        status: 'error',
        errorType: 'MissingCSRF',
        message:
          getAuthErrorMessage('MissingCSRF') ??
          'Votre session de sécurité a expiré. Rafraîchissez la page puis réessayez.',
      }
    }

    try {
      await signIn('email', {
        email,
        redirect: false,
        csrfToken,
        ...(callbackUrl ? { redirectTo: callbackUrl } : {}),
      })
      return {
        status: 'success',
        message: 'Un lien magique vient de vous être envoyé. Consultez votre boîte mail.',
      }
    } catch (e) {
      if (e instanceof AuthError) {
        return {
          status: 'error',
          errorType: e.type,
          message:
            getAuthErrorMessage(e.type) ??
            'Une erreur est survenue lors de l’envoi du lien magique. Veuillez réessayer.',
        }
      }
      return {
        status: 'error',
        errorType: 'UnknownError',
        message: 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.',
      }
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Rejoindre TableRonde</h1>
        <p className="mt-2 text-sm text-slate-500">
          Connectez-vous pour réserver ou organiser des sessions. L’authentification par email est momentanément privilégiée.
        </p>
      </div>
      {/* ⬇️ Passe l’action en prop */}
      <EmailSignInForm csrfToken={csrfToken} requestEmailSignIn={requestEmailSignIn} />
      <div className="space-y-3 text-center text-sm text-slate-500">
        <p>Les connexions sociales seront bientôt disponibles.</p>
        <Link href="/" className="text-brand-700 hover:text-brand-900">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  )
}

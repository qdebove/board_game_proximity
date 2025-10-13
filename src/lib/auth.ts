import NextAuth from 'next-auth';
import ResendProvider from 'next-auth/providers/resend';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { accounts, authSessions, users, verificationTokens } from '@/lib/db/schema';

const emailFrom = process.env.EMAIL_FROM;
const resendApiKey = process.env.RESEND_API_KEY;

if (!emailFrom) {
  throw new Error('EMAIL_FROM environment variable is required for authentication.');
}

if (!resendApiKey) {
  throw new Error('RESEND_API_KEY environment variable is required for authentication.');
}

const resendClient = new Resend(resendApiKey);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    users,
    accounts,
    sessions: authSessions,
    verificationTokens,
  }),
  session: { strategy: 'database' },
  trustHost: true,
  pages: {
    signIn: '/signin',
    verifyRequest: '/signin',
  },
  providers: [
    ResendProvider({
      apiKey: resendApiKey,
      from: emailFrom,
      sendVerificationRequest: async ({ identifier, url }) => {
        await resendClient.emails.send({
          from: emailFrom,
          to: identifier,
          subject: 'Votre lien de connexion TableRonde',
          html: `
            <div style="font-family: sans-serif; line-height: 1.6;">
              <h1>Connexion à TableRonde</h1>
              <p>Bonjour,</p>
              <p>Utilisez le lien ci-dessous pour vous connecter. Il expirera dans 10 minutes.</p>
              <p><a href="${url}" style="display:inline-block;padding:12px 20px;border-radius:9999px;background:#0f172a;color:#ffffff;text-decoration:none;">Se connecter</a></p>
              <p>Ou copiez-collez cette URL dans votre navigateur :</p>
              <p><a href="${url}">${url}</a></p>
              <p>À très vite pour une nouvelle partie !</p>
            </div>
          `,
        });
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

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

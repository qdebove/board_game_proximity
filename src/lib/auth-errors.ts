const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: 'Accès refusé. Vérifiez vos autorisations.',
  CallbackRouteError: 'Une erreur est survenue pendant la connexion. Veuillez réessayer.',
  Configuration: "Le service d’authentification est momentanément indisponible.",
  CredentialsSignin: 'Identifiants invalides. Veuillez vérifier votre adresse email ou votre mot de passe.',
  EmailSignin: 'Impossible d’envoyer le lien de connexion pour le moment. Réessayez plus tard.',
  InvalidCallbackUrl: 'L’URL de redirection fournie est invalide.',
  OAuthAccountNotLinked: 'Ce compte est déjà associé à un autre fournisseur.',
  OAuthSignin: 'La connexion via le fournisseur OAuth a échoué.',
  OAuthCallback: 'Le fournisseur OAuth n’a pas pu finaliser la connexion.',
  SessionRequired: 'Vous devez être connecté pour accéder à cette page.',
  Verification: 'Le lien de vérification a expiré ou a déjà été utilisé.',
};

export function getAuthErrorMessage(errorType?: string | null) {
  if (!errorType) {
    return undefined;
  }

  return (
    AUTH_ERROR_MESSAGES[errorType] ??
    'Une erreur est survenue lors de la tentative de connexion. Veuillez réessayer.'
  );
}

export { AUTH_ERROR_MESSAGES };

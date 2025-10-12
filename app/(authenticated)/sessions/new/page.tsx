import { SessionWizard } from '@/components/forms/session-wizard';

export default function NewSessionPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Créer une session</h1>
        <p className="text-sm text-slate-500">
          Complétez ces étapes pour proposer une session de jeux. Vous pourrez inviter vos amis ensuite.
        </p>
      </header>
      <SessionWizard />
    </div>
  );
}
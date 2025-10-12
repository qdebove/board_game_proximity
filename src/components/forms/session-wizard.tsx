'use client';

import { useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sessionFormSchema, type SessionFormValues } from '@/lib/validation/session';
import { cn } from '@/lib/utils';
import { ChipFilter } from '@/components/ui/chip-filter';
import { useToast } from '@/components/ui/use-toast';

const gameOptions = ['Catan', 'Pandemic', 'Wingspan', 'Root', 'Dixit'];
const steps = ['Infos', 'Lieu', 'Disponibilité', 'Contributions', 'Aperçu'];
const stepFields: (keyof SessionFormValues)[][] = [
  ['title', 'description', 'games'],
  ['addressApprox', 'latitude', 'longitude'],
  ['startsAt', 'endsAt', 'capacity', 'visibility'],
  ['contributionType', 'contributionNote', 'priceCents'],
  [],
];

export function SessionWizard() {
  const methods = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      title: '',
      description: '',
      games: [],
      addressApprox: '',
      capacity: 4,
      visibility: 'PUBLIC',
      contributionType: 'NONE',
    },
  });
  const { publish } = useToast();
  const [step, setStep] = useState(0);

  const onSubmit = methods.handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    publish({ title: 'Session créée', description: 'Votre session est prête à être publiée.' });
    console.log('session', values);
  });

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prev = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <Progress step={step} />
        {step === 0 && <StepInfos />}
        {step === 1 && <StepLocation />}
        {step === 2 && <StepAvailability />}
        {step === 3 && <StepContributions />}
        {step === 4 && <StepPreview />}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Retour
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={async () => {
                const fields = stepFields[step];
                const valid = fields.length ? await methods.trigger(fields) : true;
                if (valid) next();
              }}
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Continuer
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Publier
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap gap-2 text-sm">
      {steps.map((label, index) => (
        <li
          key={label}
          className={cn(
            'flex items-center gap-2 rounded-full border px-3 py-1 transition-colors',
            index === step ? 'border-brand-500 bg-brand-100 text-brand-700' : 'border-transparent bg-slate-100 text-slate-500'
          )}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold">{index + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

function StepInfos() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SessionFormValues>();

  const selectedGames = watch('games');

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Quel type de session ?</h2>
      <div className="mt-4 grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Titre</span>
          <input
            {...register('title')}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="Soirée jeux coopératifs"
          />
          {errors.title ? <p className="text-xs text-red-500">{errors.title.message}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            {...register('description')}
            className="min-h-[120px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="Décrivez l'ambiance, les jeux, etc."
          />
        </label>
        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Jeux proposés</span>
          <div className="flex flex-wrap gap-2">
            {gameOptions.map((game) => (
              <ChipFilter
                key={game}
                label={game}
                selected={selectedGames?.includes(game)}
                onClick={() => {
                  const updated = selectedGames?.includes(game)
                    ? selectedGames.filter((item) => item !== game)
                    : [...(selectedGames ?? []), game];
                  setValue('games', updated, { shouldValidate: true, shouldDirty: true });
                }}
              />
            ))}
          </div>
          {errors.games ? <p className="text-xs text-red-500">{errors.games.message as string}</p> : null}
        </div>
      </div>
    </section>
  );
}

function StepLocation() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SessionFormValues>();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Où cela se passe ?</h2>
      <p className="text-sm text-slate-500">Indiquez un secteur général, l'adresse précise sera partagée après confirmation.</p>
      <div className="mt-4 space-y-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Quartier / secteur</span>
          <input
            {...register('addressApprox')}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="Lyon 3e - quartier Part-Dieu"
          />
          {errors.addressApprox ? <p className="text-xs text-red-500">{errors.addressApprox.message}</p> : null}
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Latitude</span>
            <input
              type="number"
              step="0.0001"
              {...register('latitude', { valueAsNumber: true })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Longitude</span>
            <input
              type="number"
              step="0.0001"
              {...register('longitude', { valueAsNumber: true })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
        </div>
      </div>
    </section>
  );
}

function StepAvailability() {
  const { register, formState: { errors } } = useFormContext<SessionFormValues>();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Quand et combien ?</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Début</span>
          <input
            type="datetime-local"
            {...register('startsAt', { valueAsDate: true })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.startsAt ? <p className="text-xs text-red-500">{errors.startsAt.message as string}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Fin</span>
          <input
            type="datetime-local"
            {...register('endsAt', { valueAsDate: true })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          {errors.endsAt ? <p className="text-xs text-red-500">{errors.endsAt.message as string}</p> : null}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Capacité</span>
          <input
            type="number"
            min={2}
            max={12}
            {...register('capacity', { valueAsNumber: true })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Visibilité</span>
          <div className="grid grid-cols-3 gap-2">
            {['PUBLIC', 'FRIENDS', 'LINK'].map((value) => (
              <label
                key={value}
                className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-600 hover:border-brand-300"
              >
                <input type="radio" value={value} {...register('visibility')} className="sr-only" />
                <span>{value === 'PUBLIC' ? 'Publique' : value === 'FRIENDS' ? 'Amis' : 'Lien'}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepContributions() {
  const { register, watch, control } = useFormContext<SessionFormValues>();
  const type = watch('contributionType');

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Contributions</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Type</span>
          <select
            {...register('contributionType')}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option value="NONE">Aucune</option>
            <option value="MONEY">Contribution financière</option>
            <option value="ITEMS">Apporter quelque chose</option>
          </select>
        </label>
        {type === 'MONEY' ? (
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Montant suggéré (€)</span>
            <Controller
              name="priceCents"
              render={({ field }) => (
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={field.value !== undefined ? field.value / 100 : ''}
                  onChange={(event) => {
                    const raw = event.target.value;
                    field.onChange(raw === '' ? undefined : Math.round(Number(raw) * 100));
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
              )}
            />
          </div>
        ) : (
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Détails / liste</span>
            <textarea
              {...register('contributionNote')}
              className="min-h-[100px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              placeholder="Ex: Apporter une boisson, un dessert, etc."
            />
          </label>
        )}
      </div>
    </section>
  );
}

function StepPreview() {
  const values = useFormContext<SessionFormValues>().getValues();
  const summary = useMemo(
    () => [
      { label: 'Titre', value: values.title },
      { label: 'Jeux', value: values.games?.join(', ') },
      { label: 'Secteur', value: values.addressApprox },
      { label: 'Capacité', value: values.capacity ? `${values.capacity} joueurs` : '' },
      { label: 'Visibilité', value: values.visibility },
      { label: 'Contribution', value: values.contributionType },
    ],
    [values]
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Aperçu</h2>
      <ul className="mt-4 grid gap-3 text-sm text-slate-600">
        {summary.map((item) => (
          <li key={item.label} className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="font-medium text-slate-500">{item.label}</span>
            <span>{item.value || '—'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
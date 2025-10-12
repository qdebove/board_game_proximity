import { z } from 'zod';

export const sessionFormSchema = z
  .object({
    title: z.string().min(4, 'Titre trop court'),
    description: z.string().max(800).optional(),
    games: z.array(z.string()).min(1, 'Sélectionnez au moins un jeu'),
    addressApprox: z.string().min(3),
    latitude: z.number({ invalid_type_error: 'Latitude invalide' }).optional(),
    longitude: z.number({ invalid_type_error: 'Longitude invalide' }).optional(),
    startsAt: z.date(),
    endsAt: z.date(),
    capacity: z.number().min(2).max(12),
    visibility: z.enum(['PUBLIC', 'FRIENDS', 'LINK']).default('PUBLIC'),
    contributionType: z.enum(['NONE', 'MONEY', 'ITEMS']).default('NONE'),
    contributionNote: z.string().optional(),
    priceCents: z.number().min(0).max(10000).optional(),
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: 'La fin doit être après le début',
    path: ['endsAt'],
  })
  .refine(
    (data) => {
      if (data.contributionType === 'MONEY') {
        return typeof data.priceCents === 'number';
      }
      return true;
    },
    {
      message: 'Indiquez un montant',
      path: ['priceCents'],
    }
  );

export type SessionFormValues = z.infer<typeof sessionFormSchema>;
import { z } from 'zod';
import { Platform, GameStatus } from '@/constants/game';

export const gameSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  coverImage: z.string().optional(),
  platform: z.enum(Platform, { message: 'Platform is required' }),
  status: z.enum(GameStatus, { message: 'Status is required' }),
  rating: z.number().min(0).max(10).optional(),
  notes: z.string().optional(),
});

export type GameFormValues = z.infer<typeof gameSchema>;

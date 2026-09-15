import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { AlertTriangle, Trash2, Plus } from 'lucide-react';
import { useCreateGameMutation, useUpdateGameMutation } from '@/hooks/useGames';
import { STATUS_FORM_OPTIONS, PLATFORM_FORM_OPTIONS, Platform, GameStatus } from '@/constants/game';
import { createObjective } from '@/utils/game';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Game, GameObjective } from '@/types/game';

interface FormProps {
  mode: 'add' | 'edit';
  initialData?: Game;
  onSuccess: () => void;
  loading?: boolean;
}

interface FormValues {
  title: string;
  platform: Platform;
  status: GameStatus;
  rating?: number;
  coverImage?: string;
  notes?: string;
}

export default function Form({ mode, initialData, onSuccess, loading = false }: FormProps) {
  const createMutation = useCreateGameMutation();
  const updateMutation = useUpdateGameMutation();
  const [objectives, setObjectives] = useState<GameObjective[]>(initialData?.objectives ?? []);
  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title ?? '',
      platform: initialData?.platform ?? Platform.OTHER,
      status: initialData?.status ?? GameStatus.UNPLAYED,
      rating: initialData?.rating,
      coverImage: initialData?.coverImage ?? '',
      notes: initialData?.notes ?? '',
    },
  });

  const watchedStatus = watch('status');

  const hasIncompleteObjectives = objectives.some((objective) => !objective.completed);
  const showFinishedWarning = watchedStatus === GameStatus.FINISHED && hasIncompleteObjectives;

  const handleRemoveObjective = (objectiveId: string) => {
    setObjectives((prev) => prev.filter((objective) => objective.id !== objectiveId));
  };

  const handleAddObjective = () => {
    const title = newObjectiveTitle.trim();
    if (!title) return;
    setObjectives((prev) => [...prev, createObjective(title)]);
    setNewObjectiveTitle('');
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (mode === 'add') {
        await createMutation.mutateAsync({ ...data, objectives });
      } else if (mode === 'edit' && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data: { ...data, objectives } });
      }
      onSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
        <input
          type="text"
          {...register('title', { required: true })}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
        />
        {errors.title && <span className="text-xs text-rose-600">Title is required</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image (URL)</label>
        <input
          type="text"
          placeholder="https://..."
          {...register('coverImage')}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Platform</label>
        <Controller
          name="platform"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              data={PLATFORM_FORM_OPTIONS}
              placeholder="Select platform"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          )}
        />
        {errors.platform && <span className="text-xs text-rose-600">Platform is required</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
        <Controller
          name="status"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              data={STATUS_FORM_OPTIONS}
              placeholder="Select status"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          )}
        />
        {errors.status && <span className="text-xs text-rose-600">Status is required</span>}
        {showFinishedWarning && (
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              This game still has {objectives.filter((o) => !o.completed).length} of {objectives.length} objective
              {objectives.length === 1 ? '' : 's'} unticked. You can still mark it as Finished, but consider completing
              the checklist first.
            </span>
          </div>
        )}
      </div>

      {watchedStatus !== GameStatus.UNPLAYED && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rating (0‑10)</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            {...register('rating', { min: 0, max: 10 })}
            className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Objectives</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newObjectiveTitle}
            onChange={(e) => setNewObjectiveTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddObjective();
              }
            }}
            placeholder="Add a new objective..."
            className="flex-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2 text-sm"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddObjective}
            disabled={!newObjectiveTitle.trim()}
            aria-label="Add objective"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {objectives.length > 0 ? (
          <ul className="space-y-2">
            {objectives.map((objective) => (
              <li
                key={objective.id}
                className="flex items-center justify-between gap-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              >
                <span
                  className={`text-sm truncate ${
                    objective.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {objective.title}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveObjective(objective.id)}
                  aria-label={`Remove objective: ${objective.title}`}
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-400 italic">No objectives yet.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
        <textarea
          {...register('notes')}
          rows={4}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
        />
      </div>

      <Button type="submit" variant="primary" loading={loading} disabled={loading} className="w-full sm:w-auto">
        {mode === 'add' ? 'Add Game' : 'Save Changes'}
      </Button>
    </form>
  );
}
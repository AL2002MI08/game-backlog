import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useCreateGameMutation, useUpdateGameMutation } from '@/hooks/useGames';
import { STATUS_FORM_OPTIONS, PLATFORM_FORM_OPTIONS, Platform, GameStatus } from '@/constants/game';
import Select from '@/components/ui/Select';
import { Game } from '@/types/game';

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
  notes?: string;
}

export default function Form({ mode, initialData, onSuccess, loading = false }: FormProps) {
  const createMutation = useCreateGameMutation();
  const updateMutation = useUpdateGameMutation();

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
      notes: initialData?.notes ?? '',
    },
  });

  const watchedStatus = watch('status');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (mode === 'add') {
        await createMutation.mutateAsync(data);
      } else if (mode === 'edit' && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
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

      {/* Platform */}
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

      {/* Status */}
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
      </div>

      {/* Rating – shown only when not UNPLAYED */}
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

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
        <textarea
          {...register('notes')}
          rows={4}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
      >
        {mode === 'add' ? 'Add Game' : 'Save Changes'}
      </button>
    </form>
  );
}
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Trash2, Plus, GripVertical, Sparkles, Loader2, RefreshCw, Check } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateGameMutation, useUpdateGameMutation, GAME_QUERY_KEYS } from '@/hooks/useGames';
import { updateGameStatus } from '@/services/gameService';
import { addObjective, deleteObjective, reorderObjectives } from '@/services/objectiveService';
import { OBJECTIVE_QUERY_KEYS } from '@/hooks/useObjectives';
import { STATUS_FORM_OPTIONS, PLATFORM_FORM_OPTIONS, GameStatus, Platform } from '@/constants/game';
import { createObjective } from '@/utils/game';
import { gameSchema, GameFormValues } from '@/schemas/game';
import { searchGameCover } from '@/services/coverService';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Game, GameObjective } from '@/types/game';

interface FormProps {
  mode: 'add' | 'edit';
  initialData?: Game;
  onSuccess: () => void;
  onError?: (message: string) => void;
  loading?: boolean;
}

export default function Form({ mode, initialData, onSuccess, onError, loading = false }: FormProps) {
  const queryClient = useQueryClient();
  const createMutation = useCreateGameMutation();
  const updateMutation = useUpdateGameMutation();
  const [objectives, setObjectives] = useState<GameObjective[]>(initialData?.objectives ?? []);
  const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
  const [isSearchingCover, setIsSearchingCover] = useState(false);

  useEffect(() => {
    setObjectives(initialData?.objectives ?? []);
  }, [initialData]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
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
  const watchedTitle = watch('title');
  const watchedCoverImage = watch('coverImage');

  // Automatically find cover when title is typed if coverImage is not already set
  useEffect(() => {
    const trimmedTitle = watchedTitle?.trim();
    if (!trimmedTitle || trimmedTitle.length < 2) return;

    // If game already has a cover from initialData and title unchanged, don't auto-replace
    if (initialData?.coverImage && watchedCoverImage === initialData.coverImage && watchedTitle === initialData.title) {
      return;
    }

    if (watchedCoverImage) return;

    const timer = setTimeout(async () => {
      setIsSearchingCover(true);
      try {
        const coverUrl = await searchGameCover(trimmedTitle);
        if (coverUrl) {
          setValue('coverImage', coverUrl, { shouldValidate: true, shouldDirty: true });
        }
      } catch {
        // Ignore error
      } finally {
        setIsSearchingCover(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [watchedTitle]);

  const handleManualFindCover = async () => {
    const trimmedTitle = watchedTitle?.trim();
    if (!trimmedTitle || trimmedTitle.length < 2) return;

    setIsSearchingCover(true);
    try {
      const coverUrl = await searchGameCover(trimmedTitle);
      if (coverUrl) {
        setValue('coverImage', coverUrl, { shouldValidate: true, shouldDirty: true });
      }
    } catch {
      // Ignore
    } finally {
      setIsSearchingCover(false);
    }
  };

  const hasIncompleteObjectives = objectives.some((objective) => !objective.completed);
  const showFinishedWarning = watchedStatus === GameStatus.FINISHED && hasIncompleteObjectives;

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const items = [...objectives];
    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    setObjectives(items);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleRemoveObjective = (objectiveId: string) => {
    setObjectives((prev) => prev.filter((objective) => objective.id !== objectiveId));
  };

  const handleAddObjective = () => {
    const title = newObjectiveTitle.trim();
    if (!title) return;
    setObjectives((prev) => [...prev, createObjective(title)]);
    setNewObjectiveTitle('');
  };

  const onSubmit: SubmitHandler<GameFormValues> = async (data) => {
    try {
      const pendingTitle = newObjectiveTitle.trim();
      const allObjectives = pendingTitle
        ? [...objectives, createObjective(pendingTitle)]
        : objectives;

      if (mode === 'add') {
        const newGame = await createMutation.mutateAsync({ ...data });
        if (newGame?.id && allObjectives.length > 0) {
          await Promise.all(allObjectives.map((obj) => addObjective(newGame.id, obj.label)));
          queryClient.invalidateQueries({ queryKey: OBJECTIVE_QUERY_KEYS.list(newGame.id) });
          queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.detail(newGame.id) });
        }
      } else if (mode === 'edit' && initialData) {
        const { status, ...gameFields } = data;
        const statusChanged = status !== initialData.status;

        if (statusChanged) {
          await updateGameStatus(initialData.id, status);
        }

        await updateMutation.mutateAsync({ id: initialData.id, data: gameFields });

        const initialObjs = initialData.objectives ?? [];
        const initialIds = new Set(initialObjs.map((o) => o.id));

        const toAdd = allObjectives.filter((o) => !initialIds.has(o.id));
        const currentIds = new Set(allObjectives.map((o) => o.id));
        const toDelete = initialObjs.filter((o) => !currentIds.has(o.id));

        await Promise.all([
          ...toAdd.map((o) => addObjective(initialData.id, o.label)),
          ...toDelete.map((o) => deleteObjective(initialData.id, o.id)),
        ]);

        const remainingExistingIds = allObjectives
          .filter((o) => initialIds.has(o.id))
          .map((o) => o.id);
        const originalExistingIds = initialObjs
          .filter((o) => currentIds.has(o.id))
          .map((o) => o.id);
        const orderChanged = remainingExistingIds.some((id, idx) => id !== originalExistingIds[idx]);

        if (orderChanged && remainingExistingIds.length > 1) {
          await reorderObjectives(initialData.id, remainingExistingIds);
        }

        queryClient.invalidateQueries({ queryKey: OBJECTIVE_QUERY_KEYS.list(initialData.id) });
        queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.detail(initialData.id) });
      }

      onSuccess();
    } catch (e) {
      onError?.(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
        <input
          type="text"
          {...register('title')}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
        />
        {errors.title && <span className="text-xs text-rose-600">{errors.title.message}</span>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Cover Image
          </label>
          <button
            type="button"
            onClick={handleManualFindCover}
            disabled={isSearchingCover || !watchedTitle?.trim()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isSearchingCover ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching cover...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-find Cover</span>
              </>
            )}
          </button>
        </div>

        {watchedCoverImage ? (
          <div className="mb-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3">
            <div className="w-14 h-18 rounded-md overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shrink-0">
              <img
                src={watchedCoverImage}
                alt="Cover Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <Check className="w-3.5 h-3.5" />
                <span>Cover ready to save to database</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {watchedCoverImage}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setValue('coverImage', '', { shouldDirty: true });
                  }}
                  className="text-[11px] font-medium text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Remove cover
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <button
                  type="button"
                  onClick={handleManualFindCover}
                  disabled={isSearchingCover}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Change / Re-search
                </button>
              </div>
            </div>
          </div>
        ) : (
          <input
            type="text"
            placeholder="Type a title above to auto-find, or paste a URL here"
            {...register('coverImage')}
            className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2 text-sm"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Platforms</label>
        <Controller
          name="platform"
          control={control}
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
        {errors.platform && <span className="text-xs text-rose-600">{errors.platform.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
        <Controller
          name="status"
          control={control}
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
        {errors.status && <span className="text-xs text-rose-600">{errors.status.message}</span>}
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
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rating (1‑10)</label>
          <input
            type="number"
            min={1}
            max={10}
            step={1}
            {...register('rating', { setValueAs: (v) => (v === '' || v == null ? null : Number(v)) })}
            className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          />
          {errors.rating && <span className="text-xs text-rose-600">{errors.rating.message}</span>}
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
            {objectives.map((objective, index) => {
              const isDragging = draggedIndex === index;
              const isDragOver = dragOverIndex === index && draggedIndex !== index;

              return (
                <li
                  key={objective.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between gap-2 rounded-md border bg-white dark:bg-slate-800 px-3 py-2 transition-all ${
                    isDragging
                      ? 'opacity-40 border-dashed border-teal-500 scale-[0.98]'
                      : isDragOver
                      ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-500/10'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 -ml-1 transition-colors"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-sm truncate ${
                        objective.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {objective.label}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveObjective(objective.id)}
                    aria-label={`Remove objective: ${objective.label}`}
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Button>
                </li>
              );
            })}
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
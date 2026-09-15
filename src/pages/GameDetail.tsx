import { useState } from "react";
import { useParams, useNavigate, useOutletContext, Link } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useGameDetailQuery, useUpdateGameMutation, useDeleteGameMutation } from "@/hooks/useGames";
import { GameStatus } from "@/constants/game";
import { createObjective } from "@/utils/game";
import GameDetailBanner from "@/components/game-detail/GameDetailBanner";
import GameDetailObjectives from "@/components/game-detail/GameDetailObjectives";
import FormModal from "@/components/FormModal";
import Form from "@/components/game-detail/Form";
import ConfirmModal from "@/components/ConfirmModal";
import Button from "@/components/ui/Button";
import { RootLayoutContext } from "@/layouts/RootLayout";

function getErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Something went wrong. Please try again.";
}

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useOutletContext<RootLayoutContext>();
  const gameId = id;
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { data: game, isLoading, isError, error, refetch } = useGameDetailQuery(gameId);
  const updateMutation = useUpdateGameMutation();
  const deleteMutation = useDeleteGameMutation();

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-center">
        <Loader2 className="w-10 h-10 text-teal-600 dark:text-teal-400 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Fetching game details...</p>
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="py-16 max-w-lg mx-auto bg-white dark:bg-[#090e1c] border border-rose-500/30 rounded-2xl p-8 text-center space-y-4 shadow-xl">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Game Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{error?.message || `No game found with ID #${id}.`}</p>
        <div className="flex justify-center gap-3 pt-2">
          <button onClick={() => refetch()} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold">Retry</button>
          <Link to="/games" className="px-4 py-2 bg-teal-500 text-slate-950 rounded-xl text-xs font-bold">Back to Library</Link>
        </div>
      </div>
    );
  }

  const handleToggle = async (objId: string) => {
    if (!game.objectives) return;
    const updated = game.objectives.map((objective) => (objective.id === objId ? { ...objective, completed: !objective.completed } : objective));
    const allDone = updated.every((objective) => objective.completed);
    const status = allDone && game.status === GameStatus.PLAYING ? GameStatus.FINISHED : game.status;
    try {
      await updateMutation.mutateAsync({ id: game.id, data: { objectives: updated, status } });
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  const handleRemoveObjective = async (objId: string) => {
    if (!game.objectives) return;
    const updated = game.objectives.filter((objective) => objective.id !== objId);
    try {
      await updateMutation.mutateAsync({ id: game.id, data: { objectives: updated } });
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  const handleAddObjective = async (title: string) => {
    const updated = [...(game.objectives ?? []), createObjective(title)];
    try {
      await updateMutation.mutateAsync({ id: game.id, data: { objectives: updated } });
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(game.id);
      navigate("/games");
      showToast("Game deleted successfully");
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  return (
    <div className="w-full space-y-6 pb-16 px-2">
      <FormModal opened={showEdit} onClose={() => setShowEdit(false)} title="Edit Game">
        <Form
          mode="edit"
          initialData={game}
          onSuccess={() => { setShowEdit(false); refetch(); }}
          onError={(message) => showToast(message, "error")}
          loading={updateMutation.isPending}
        />
      </FormModal>
      <ConfirmModal opened={showDelete} onClose={() => setShowDelete(false)} title="Delete Game">
        <p>
          Are you sure you want to delete this game? It's objective checklist will be permanently
          cleared as well.
        </p>
        <div className="flex gap-3 items-center justify-center pt-4">
          <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger-solid" onClick={handleDelete} loading={deleteMutation.isPending}>Delete</Button>
        </div>
      </ConfirmModal>
      <GameDetailBanner
        game={game}
        onOpenDelete={() => setShowDelete(true)}
        onOpenEdit={() => setShowEdit(true)}

      />
      <GameDetailObjectives
        game={game}
        onToggle={handleToggle}
        onRemove={handleRemoveObjective}
        onAdd={handleAddObjective}
      />
    </div>
  );
}
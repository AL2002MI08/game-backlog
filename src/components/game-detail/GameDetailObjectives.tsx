import { useState } from "react";
import { CheckCircle2, Circle, Trash2, Plus } from "lucide-react";
import { Game } from "@/types/game";
import { getGameProgress } from "@/utils/game";
import Button from "@/components/ui/Button";

interface GameDetailObjectivesProps {
  game: Game;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (title: string) => void;
}

export default function GameDetailObjectives({ game, onToggle, onRemove, onAdd }: GameDetailObjectivesProps) {
  const { total, completed, percent } = getGameProgress(game);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    const title = newTitle.trim();
    if (!title) return;
    onAdd(title);
    setNewTitle("");
  };

  return (
    <div className="bg-white dark:bg-[#090e1c] p-6 sm:p-8 space-y-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-[#18233c] pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Checklist</span>
        </h2>
        <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
          {completed} of {total} completed ({percent}%)
        </span>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${percent === 100 ? "bg-emerald-500" : percent > 0 ? "bg-teal-500" : "bg-slate-400 dark:bg-slate-600"
            }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {total > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {game.objectives?.map((obj) => (
            <div
              key={obj.id}
              onClick={() => onToggle(obj.id)}
              className={`group flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                obj.completed
                  ? "bg-teal-50/50 hover:bg-teal-100/50 dark:bg-[#050811]/90 dark:hover:bg-[#090e1c] border-teal-500/30 text-teal-800 dark:text-teal-300"
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-[#050811]/40 dark:hover:bg-[#050811] border-slate-200 dark:border-[#1c2945] text-slate-800 dark:text-slate-200"
              }`}
            >
              {obj.completed ? (
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span
                className={`text-xs sm:text-sm flex-1 transition-all ${
                  obj.completed
                    ? "line-through opacity-70 group-hover:opacity-100"
                    : "font-medium"
                }`}
              >
                {obj.title}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(obj.id);
                }}
                aria-label={`Remove objective: ${obj.title}`}
                className="shrink-0"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-6 text-slate-400 text-xs italic">
          No objectives tracked yet. Add your first one below.
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Add a new objective..."
          className="flex-1 rounded-xl border border-dashed border-slate-300 dark:border-[#1c2945] bg-slate-50 dark:bg-[#050811]/40 text-slate-800 dark:text-slate-200 text-xs sm:text-sm px-3.5 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleAdd}
          disabled={!newTitle.trim()}
          aria-label="Add objective"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

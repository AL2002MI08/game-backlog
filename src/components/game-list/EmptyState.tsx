import { Gamepad2, Plus, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";

interface EmptyStateProps {
    hasFilters: boolean;
    onReset: () => void;
    onAddGame: () => void;
}

export default function EmptyState({ hasFilters, onReset, onAddGame }: EmptyStateProps) {
    return (
        <div className="py-16 text-center bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-[#18233c] rounded-2xl p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 dark:bg-slate-800/60 border border-teal-200 dark:border-slate-700/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No games match your criteria</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {hasFilters
                    ? "No match found."
                    : "Your library is empty. Add your first title to start tracking!"}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
                {hasFilters && (
                    <Button variant="outline" size="sm" onClick={onReset}>
                        <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                    </Button>
                )}
                <Button variant="primary" size="sm" onClick={onAddGame}>
                    <Plus className="w-3.5 h-3.5" /> Add Game
                </Button>
            </div>
        </div>
    );
}

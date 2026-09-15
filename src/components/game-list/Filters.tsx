import { Search } from "lucide-react";
import Select from "@/components/ui/Select";
import {
  STATUS_FILTER_OPTIONS,
  PLATFORM_FILTER_OPTIONS,
  PROGRESS_FILTER_OPTIONS,
} from "@/constants/game";
import { ProgressCategory } from "@/utils/game";

interface LibraryFiltersProps {
  search: string;
  updateSearch: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  progress?: ProgressCategory;
  setProgress?: (value: ProgressCategory) => void;
  resetFilters?: () => void;
  hasActiveFilters?: boolean;
}

export default function LibraryFilters({
  search,
  updateSearch,
  platform,
  setPlatform,
  status,
  setStatus,
  progress,
  setProgress,
}: LibraryFiltersProps) {
  return (
    <div className="w-full bg-white dark:bg-[#17202d] text-slate-800 dark:text-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between border border-slate-200 dark:border-[#101721] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto scrollbar-none">
        <Select
          placeholder="Status"
          data={STATUS_FILTER_OPTIONS}
          value={status}
          onChange={(val) => setStatus(val ?? "ALL")}
        />
        <Select
          placeholder="Platform"
          data={PLATFORM_FILTER_OPTIONS}
          value={platform}
          onChange={(val) => setPlatform(val ?? "ALL")}
        />
        {progress !== undefined && setProgress && (
          <Select
            placeholder="Progress"
            data={PROGRESS_FILTER_OPTIONS}
            value={progress}
            onChange={(val) => setProgress((val ?? "ALL") as ProgressCategory)}
          />
        )}
      </div>
      <div className="px-3 py-1.5 flex items-center justify-end w-full md:w-auto">
        <div className="relative flex items-center w-full md:w-64">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search library..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-full border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );
}

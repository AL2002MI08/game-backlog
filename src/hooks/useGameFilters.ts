import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { filterGames, filterOptions } from "@/utils/filter";
import { Game } from "@/types/game";
import { ProgressCategory } from "@/utils/game";

export function useGameFilters(games: Game[] = []) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [platform, setPlatform] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("ALL");
  const [progress, setProgress] = useState<ProgressCategory>("ALL");

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const updateSearch = (value: string) => {
    setSearch(value);
    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set("search", value.trim());
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams, { replace: true });
  };

  const resetFilters = () => {
    updateSearch("");
    setPlatform("ALL");
    setStatus("ALL");
    setProgress("ALL");
  };

  const criteria: filterOptions = { search, platform, status, progress };
  const filteredGames = useMemo(() => filterGames(games, criteria), [games, criteria]);

  const hasActiveFilters = search.trim() !== "" || platform !== "ALL" || status !== "ALL" || progress !== "ALL";

  return {
    search,
    updateSearch,
    platform,
    setPlatform,
    status,
    setStatus,
    progress,
    setProgress,
    resetFilters,
    filteredGames,
    hasActiveFilters,
  };
}

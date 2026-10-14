import { getPlatformBadgeStyle, getStatusBadgeStyle } from "@/utils/game";
import { PLATFORM_LABELS, GAME_STATUS_LABELS } from "@/constants/game";
import { Platform, GameStatus } from "@/constants/game";

export type BadgeSize = "sm" | "md";

const BADGE_SIZE_STYLES: Record<BadgeSize, string> = {
  sm: "text-[11px] py-0.5 px-2 rounded-md",
  md: "text-xs sm:text-sm py-1 px-2.5 rounded-lg",
};

interface PlatformBadgeProps {
  platform: Platform | string;
  size?: BadgeSize;
}
interface StatusBadgeProps {
  status: GameStatus | string;
  size?: BadgeSize;
}

export function PlatformBadge({ platform, size = "sm" }: PlatformBadgeProps) {
  return (
    <span
      className={`font-bold tracking-wider text-center uppercase border truncate ${BADGE_SIZE_STYLES[size]} ${getPlatformBadgeStyle(platform as any)}`}
    >
      {PLATFORM_LABELS[platform as Platform] || platform}
    </span>
  );
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  return (
    <span
      className={`font-bold tracking-wider text-center uppercase border truncate ${BADGE_SIZE_STYLES[size]} ${getStatusBadgeStyle(status as any)}`}
    >
      {GAME_STATUS_LABELS[status as GameStatus] || status}
    </span>
  );
}

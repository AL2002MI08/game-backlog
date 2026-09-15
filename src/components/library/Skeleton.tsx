import { Skeleton } from "@mantine/core";

export default function LibrarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} height={350} radius="md" />
      ))}
    </div>
  );
}
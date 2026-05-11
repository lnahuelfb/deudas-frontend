export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div 
      className={`animate-pulse bg-white/5 rounded-2xl ${className}`}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 space-y-4 h-[200px]">
    <div className="flex justify-between items-start">
      <Skeleton className="w-24 h-8" />
      <Skeleton className="w-12 h-12 rounded-full" />
    </div>
    <div className="space-y-2 pt-4">
      <Skeleton className="w-32 h-10" />
      <Skeleton className="w-20 h-4" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 h-[400px] flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <Skeleton className="w-48 h-8" />
      <Skeleton className="w-24 h-8" />
    </div>
    <div className="flex-1 flex gap-8 items-center">
      <Skeleton className="w-64 h-64 rounded-full" />
      <div className="flex-1 space-y-4">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </div>
    </div>
  </div>
);

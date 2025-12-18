import { Skeleton } from "@/components/ui/skeleton";

const HighestViewsBlogsSkeleton = () => {
  return (
    <section className="w-full px-5 md:px-10 lg:px-20 py-10">
     
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="group flex-1">
            <div className="relative h-full min-h-[140px] rounded-xl overflow-hidden bg-card border border-border/50 hover:shadow-lg transition-shadow">
              <div className="flex h-full">
                {/* Image Skeleton */}
                <div className="relative w-1/3 min-w-[140px] overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>

                {/* Content Skeleton */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  {/* Top Section - Category & Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="w-16 h-5 rounded-full" />
                    <Skeleton className="w-20 h-4" />
                  </div>

                  {/* Title */}
                  <div className="space-y-2 mb-3">
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-4/5 h-5" />
                  </div>

                  {/* Bottom Section - Author & Views */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                      <Skeleton className="w-20 h-4" />
                    </div>
                    <Skeleton className="w-16 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighestViewsBlogsSkeleton

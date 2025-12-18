
import { CategoriesAsync } from "@/components/AsyncComponent";
import CategoriesSkeleton from "@/components/skeletonLoading/CategoriesSkeleton";
import React, { Suspense } from "react";

const CategoriesPage = () => {
  return (
    <div className="py-20">
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesAsync />
      </Suspense>
    </div>
  );
};

export default CategoriesPage;

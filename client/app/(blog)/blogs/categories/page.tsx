import { CategoriesAsync } from "@/components/AsyncComponent";
import Categories from "@/components/Categories";
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

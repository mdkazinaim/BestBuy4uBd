import { useMemo } from "react";
import { useGetAllCategoriesQuery } from "../../../../../../store/Api/CategoriesApi";
import CategorySection from "./CategorySection";
import RecommendedSkeleton from "../../../../../../common/Skeleton/RecommendedSkeleton";

const RecommendedSection = () => {
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery({});

  const categories = useMemo(() => {
    return (
      categoriesData?.data?.map((cat: any) => ({
        id: cat.name,
        name: cat.name,
      })) || []
    );
  }, [categoriesData]);

  if (isCategoriesLoading) {
    return <RecommendedSkeleton />;
  }

  return (
    <div className="flex flex-col gap-10 sm:gap-20">
      {categories.map((category: any) => (
        <CategorySection
          key={category.id}
          category={category.name}
          label={category.name}
        />
      ))}
    </div>
  );
};

export default RecommendedSection;

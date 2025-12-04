import { computed } from "vue";

export function useTableSkeleton(loadingRef: Ref<boolean>) {
  // สร้าง dummy data 10 แถวเมื่อ loading
  const skeletonData = computed(() => {
    return loadingRef.value ? Array(10).fill({}) : null;
  });

  const shouldShowSkeleton = computed(() => loadingRef.value);

  return {
    skeletonData,
    shouldShowSkeleton,
  };
}

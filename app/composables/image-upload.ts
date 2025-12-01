import type { IImageEntity } from "~/types/entities/image.entity";
import { ref } from "vue";

export const useImageUpload = () => {
  const { run } = useFormHandler();
  const loading = ref(false);

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  /**
   * Upload multiple images
   * @param files - Array of File objects to upload
   * @returns Array of image URLs
   */
  const uploadImages = async (files: File[]): Promise<IImageEntity[]> => {
    const result = await run(async () => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await useApi().post<IImageEntity[]>("/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res;
    }, setLoading);

    return result || [];
  };

  /**
   * Upload single image
   * @param file - File object to upload
   * @returns Image URL
   */
  const uploadImage = async (file: File): Promise<string> => {
    const result = await uploadImages([file]);
    return result && result.length > 0 && result[0] ? result[0].url : "";
  };

  /**
   * Delete image
   * @param id - Image ID to delete
   */
  const deleteImage = async (id: number) => {
    return await run(async () => {
      const res = await useApi().delete(`/images/${id}`);
      return res;
    }, setLoading);
  };

  return {
    loading,
    uploadImages,
    uploadImage,
    deleteImage,
  };
};

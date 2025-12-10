import type { IImageEntity } from "~/types/entities/image.entity";
import { ref } from "vue";

export const useImageUpload = () => {
  const loading = ref(false);

  /**
   * Upload multiple images
   * @param files - Array of File objects to upload
   * @returns Array of image URLs
   */
  const uploadImages = async (files: File[]): Promise<IImageEntity[]> => {
    try {
      loading.value = true;
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await useApi().post<IImageEntity[]>("/files/upload-multi", formData);
       console.log('Uploaded images response:', res);
      return res || [];
    } catch (error) {
      console.error('Failed to upload images:', error);
      throw error;
    } finally {
      loading.value = false;
    }
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
    try {
      loading.value = true;
      const res = await useApi().delete(`/images/${id}`);
      return res;
    } catch (error) {
      console.error('Failed to delete image:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    uploadImages,
    uploadImage,
    deleteImage,
  };
};

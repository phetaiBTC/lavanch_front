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
    } catch (error: any) {
      console.error('Failed to upload images:', error);
      
      // Re-throw with enhanced error information
      if (error?.response?.data) {
        const errorData = error.response.data;
        
        // Check if it's an invalid file type error
        if (errorData.error === 'INVALID_FILE_TYPE' && errorData.details) {
          throw {
            type: 'INVALID_FILE_TYPE',
            message: errorData.message,
            fileName: errorData.details.fileName,
            fileType: errorData.details.fileType,
            allowedTypes: errorData.details.allowedTypes,
            allowedMimeTypes: errorData.details.allowedMimeTypes,
          };
        }
        
        // Check if it's an image processing error
        if (errorData.error === 'IMAGE_PROCESSING_ERROR' && errorData.details) {
          throw {
            type: 'IMAGE_PROCESSING_ERROR',
            message: errorData.message,
            fileName: errorData.details.fileName,
            reason: errorData.details.reason,
          };
        }
        
        // Check if it's a file size error
        if (errorData.error === 'FILE_TOO_LARGE' && errorData.details) {
          throw {
            type: 'FILE_TOO_LARGE',
            message: errorData.message,
            fileName: errorData.details.fileName,
            fileSize: errorData.details.fileSize,
            maxSize: errorData.details.maxSize,
            fileSizeBytes: errorData.details.fileSizeBytes,
            maxSizeBytes: errorData.details.maxSizeBytes,
          };
        }
        
        // Handle other API errors
        throw {
          type: 'UPLOAD_ERROR',
          message: errorData.message || 'Failed to upload image',
        };
      }
      
      // Handle network or unknown errors
      throw {
        type: 'UNKNOWN_ERROR',
        message: 'Failed to upload image. Please check your connection and try again.',
      };
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

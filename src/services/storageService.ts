import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from './firebase';

export interface ImageUploadResult {
  url: string;
  source: 'firebase_storage' | 'embedded';
  name: string;
  size: number;
}

/**
 * Compresses an image file in the browser using HTML5 Canvas
 * Produces an optimized data URL suitable for embedding or fast uploading.
 */
export async function compressImageToDataUrl(
  file: File,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first if supported, else JPEG
        let mime = 'image/webp';
        let dataUrl = canvas.toDataURL(mime, quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          mime = 'image/jpeg';
          dataUrl = canvas.toDataURL(mime, quality);
        }

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to read and parse image file.'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file:
 * 1. Tries Firebase Storage first
 * 2. If Firebase Storage is unavailable, unprovisioned, or blocked by CORS, falls back to compressed data URL
 */
export async function uploadImageFile(
  file: File,
  folder = 'articles'
): Promise<ImageUploadResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image. Please choose a JPG, PNG, WebP, GIF, or SVG file.');
  }

  // Maximum file size limit: 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image file is too large (exceeds 10MB). Please select a smaller image.');
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const userId = auth.currentUser?.uid || 'editorial';
  const storagePath = `${folder}/${userId}/${timestamp}_${cleanName}`;

  try {
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        originalName: file.name,
      },
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);
    return {
      url: downloadUrl,
      source: 'firebase_storage',
      name: file.name,
      size: file.size,
    };
  } catch (storageError) {
    console.warn(
      'Firebase Storage upload unavailable or unprovisioned, using browser-optimized embedded image fallback:',
      storageError
    );

    // Reliable fallback: Compress to lightweight data URL
    const compressedDataUrl = await compressImageToDataUrl(file);
    return {
      url: compressedDataUrl,
      source: 'embedded',
      name: file.name,
      size: file.size,
    };
  }
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiUpload, FiX } from "react-icons/fi";
import axiosInstance from "@/lib/axios";

export default function ProductCustomization({
  product,
  onCustomizationChange,
  uploading,
  setUploading,
  removing,
  setRemoving,
}) {
  const customization = product?.customization;

  const [text, setText] = useState("");

  const [font, setFont] = useState(
    customization?.allowedFonts?.[0] || "Poppins",
  );

  const [images, setImages] = useState([]);

  if (!customization?.enabled) {
    return null;
  }

  const updateParent = (updatedData) => {
    console.log(updatedData);
    onCustomizationChange?.(updatedData);
  };

  // Text
  const handleTextChange = (value) => {
    if (value.length > customization.maxCharacters) {
      return;
    }

    setText(value);

    validateCustomization(value, images);
  };

  // Font
  const handleFontChange = (value) => {
    setFont(value);

    onCustomizationChange?.({
      text,
      font: value,
      images,
      isValid: validateCustomization(text, images).isValid,
    });
  };

  // Image Upload
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (!files.length) return;

    const totalImages = images.length + files.length;

    if (totalImages > customization.maxImages) {
      toast.error(`Maximum ${customization.maxImages} images allowed`);

      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      // send all files together
      files.forEach((file) => {
        formData.append("images", file);
      });

      const { data } = await axiosInstance.post(
        "/products/customization/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const uploadedImages = (data.images || []).map((image, index) => ({
        url: image.url,
        public_id: image.public_id,
        name: files[index]?.name,
      }));

      const updated = [...images, ...uploadedImages];

      setImages(updated);

      validateCustomization(text, updated);

      toast.success("Images uploaded!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Remove Image
  const removeImage = async (index) => {
    try {
      setRemoving(true);
      const image = images[index];

      // delete from cloudinary
      if (image.public_id) {
        await axiosInstance.delete(
          `/products/customization/${encodeURIComponent(image.public_id)}`,
        );
      }

      // remove from state
      const updated = images.filter((_, i) => i !== index);

      setImages(updated);

      validateCustomization(text, updated);

      toast.success("Image removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove image");
    } finally {
      setRemoving(false);
    }
  };

  const validateCustomization = (customText = text, customImages = images) => {
    const errors = [];

    // text validation
    if (customization.allowText && !customText.trim()) {
      errors.push("Custom text is required");
    }

    // image validation
    if (
      customization.allowImage &&
      customImages.length < (customization.minImages || 0)
    ) {
      errors.push(`Minimum ${customization.minImages} image required`);
    }

    const isValid = errors.length === 0;

    const payload = {
      text: customText,
      font,
      images: customImages,
      isValid,
      errors,
    };

    onCustomizationChange?.(payload);

    return payload;
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          ✨ Personalize Your Gift
        </h3>

        <p className="text-sm text-muted-foreground">
          Add a custom message or upload photos.
        </p>
      </div>

      {/* Text */}
      {customization.allowText && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="space-y-4"
        >
          <label className="font-semibold text-foreground">Custom Text</label>

          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            maxLength={customization.maxCharacters}
            placeholder="Enter your personalized message..."
            style={{
              fontFamily:
                font === "Monotype Corsiva"
                  ? '"Monotype Corsiva", "Apple Chancery", cursive'
                  : font,
            }}
            className="min-h-28 w-full rounded-2xl border border-border bg-background p-4 text-foreground outline-none transition focus:border-primary"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Fonts */}
            <select
              value={font}
              onChange={(e) => handleFontChange(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none"
            >
              {customization.allowedFonts?.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <span className="text-xs text-muted-foreground">
              {text.length}/{customization.maxCharacters}
            </span>
          </div>
        </motion.div>
      )}

      {/* Images */}
      {customization.allowImage && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">
              Upload Photos
            </label>

            <div className="text-right">
              <span className="text-xs text-muted-foreground">
                {images.length}/{customization.maxImages}
              </span>

              {customization.minImages > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  Min {customization.minImages} image required
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          {!!images.length && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl border border-border"
                >
                  <img
                    src={image.url}
                    alt="Preview"
                    className="h-32 w-full object-cover"
                  />

                  <button
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white cursor-pointer"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload */}
          {images.length < customization.maxImages && (
            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-border p-6 text-center transition hover:border-primary hover:bg-secondary/50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <FiUpload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                Click to upload images
              </p>
            </label>
          )}
          {customization.allowImage &&
            images.length < customization.minImages && (
              <p className="text-sm font-medium text-red-500">
                Please upload at least {customization.minImages} image before
                adding to cart.
              </p>
            )}

          {customization.allowText && !text.trim() && (
            <p className="text-sm font-medium text-red-500">
              Please enter custom text.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

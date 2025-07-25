import { useState } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";

const ImageUploadComponent = ({
  label,
  maxImages,
  previews,
  setPreviews,
  formDataKey,
  setFormData,
  existingImages = [],
}) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (previews.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    const newImages = [...existingImages, ...files];
    setFormData((prev) => ({
      ...prev,
      [formDataKey]: newImages,
    }));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = existingImages.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      [formDataKey]: newImages,
    }));
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id={`${formDataKey}-images`}
        />
        <label
          htmlFor={`${formDataKey}-images`}
          className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors"
        >
          <div className="text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload {label.toLowerCase()}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG up to 10MB each</p>
          </div>
        </label>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview || "/placeholder.svg"}
                alt={`${label} ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadComponent;
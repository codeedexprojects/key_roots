import { useState } from "react";
import ImageUploadComponent from "./ImageUploadComponent";

const PlaceFormSection = ({ formData, handleInputChange, setFormData }) => {
  const [placeImagePreviews, setPlaceImagePreviews] = useState([]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Places *</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Place Name
        </label>
        <input
          type="text"
          name="placeName"
          value={formData.placeName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          name="placeDescription"
          value={formData.placeDescription}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      <ImageUploadComponent
        label="Place Images"
        maxImages={3}
        previews={placeImagePreviews}
        setPreviews={setPlaceImagePreviews}
        formDataKey="place_images"
        setFormData={setFormData}
        existingImages={formData.place_images || []}
      />
    </div>
  );
};

export default PlaceFormSection;
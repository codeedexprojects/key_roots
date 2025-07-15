import React, { useState, useEffect, useCallback } from "react";
import {
  FaArrowLeft,
  FaDownload,
  FaWifi,
  FaMusic,
  FaChargingStation,
  FaSnowflake,
  FaCouch,
  FaVideo,
  FaSolarPanel,
  FaStar,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaUpload,
  FaCheck,
} from "react-icons/fa";
import { toast } from "sonner";

import { LoadingSpinner } from "@/components/common";
import {
  getBusById,
  formatPrice,
  getStatusColor,
  editBusById,
} from "../services/busService";

const BusDetails = ({ bus, onBack }) => {
  const [busDetails, setBusDetails] = useState(bus);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  // Add this function to handle image deletion
  const handleDeleteImage = (index, isNewImage) => {
    if (isNewImage) {
      setNewImages(newImages.filter((_, i) => i !== index));
    } else {
      // Add the entire image object to imagesToDelete array
      setImagesToDelete([...imagesToDelete, busDetails.rawImages[index]]);
    }
  };

  // Add this function to set main image
  const handleSetMainImage = (index) => {
    setMainImageIndex(index);
  };
  const loadBusDetails = useCallback(
    async (busId) => {
      setIsLoading(true);
      try {
        const response = await getBusById(busId);
        console.log(response);
        if (response && !response.error) {
          setBusDetails({
            ...bus,
            ...response,
            rawAmenities: response.amenities || [],
            rawFeatures: response.features || [],
            rawImages: response.images || [],
            documents: {
              travels_logo: response.travels_logo,
              rc_certificate: response.rc_certificate,
              license: response.license,
              contract_carriage_permit: response.contract_carriage_permit,
              passenger_insurance: response.passenger_insurance,
              vehicle_insurance: response.vehicle_insurance,
            },
          });
          // Initialize editedData with current values
          setEditedData({
            bus_name: response.bus_name || bus.bus_name,
            bus_number: response.bus_number || bus.bus_number,
            capacity: response.capacity || bus.capacity,
            base_price: response.base_price || bus.base_price,
            price_per_km: response.price_per_km || bus.price_per_km,
            minimum_fare: response.minimum_fare || bus.minimum_fare,
            bus_type: response.bus_type || bus.bus_type,
            vehicle_rc_number:
              response.vehicle_rc_number || bus.vehicle_rc_number,
            vehicle_description:
              response.vehicle_description || bus.vehicle_description,
            location: response.location || bus.location,
            status: response.status || bus.status,
          });
        } else {
          toast.error(response?.message || "Failed to load bus details");
        }
      } catch (error) {
        console.error("Error fetching bus details:", error);
        toast.error("Failed to load bus details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [bus]
  );

  useEffect(() => {
    if (bus?.id) {
      loadBusDetails(bus.id);
    }
  }, [bus?.id, loadBusDetails]);

  const allImages = busDetails.rawImages?.map(img => img.bus_view_image) || [];


  const downloadDocument = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      toast.error("Document not available");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      // Append all edited fields to formData
      Object.entries(editedData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append new images
      newImages.forEach((image) => {
        formData.append("bus_images", image);
      });

      // Append images to delete - as an array of integers
      if (imagesToDelete.length > 0) {
        // Convert the array of IDs to integers
        const idsToDelete = imagesToDelete.map((img) => parseInt(img.id));

        // Append each ID separately with the same field name
        idsToDelete.forEach((id) => {
          formData.append("remove_image_ids", id);
        });
      }

      // Append main image index if it's different
      if (mainImageIndex !== 0) {
        formData.append("main_image_index", mainImageIndex);
      }

      const response = await editBusById(bus.id, formData);

      if (response && !response.error) {
        toast.success("Bus details updated successfully");
        await loadBusDetails(bus.id);
        setIsEditing(false);
        setNewImages([]);
        setImagesToDelete([]);
        setMainImageIndex(0);
      } else {
        toast.error(response?.message || "Failed to update bus details");
      }
    } catch (error) {
      console.error("Error updating bus details:", error);
      toast.error("Failed to update bus details. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <button
            className="flex items-center gap-2 text-red-700 font-medium focus:outline-none"
            onClick={onBack}
          >
            <FaArrowLeft /> Back
          </button>
        </div>
        <div className="flex justify-center items-center min-h-[500px]">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <button
          className="flex items-center gap-2 text-red-700 font-medium focus:outline-none hover:text-red-800 transition-colors"
          onClick={onBack}
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {isSaving ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaEdit /> Edit Bus
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Enhanced Image Gallery */}
     <div className="mb-6">
  <div className="w-full rounded-lg overflow-hidden mb-4 relative bg-gray-50">
    <div className="w-full max-w-4xl mx-auto" style={{ aspectRatio: "16/9" }}>
      <img
        src={
          (isEditing && newImages[mainImageIndex]
            ? URL.createObjectURL(newImages[mainImageIndex])
            : allImages[activeImageIndex]) ||
          busDetails.image ||
          "/placeholder.svg"
        }
        alt={busDetails.bus_name || busDetails.title}
        className="w-full h-full object-scale-down"
      />
    </div>
    {busDetails.isPopular && (
      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        Popular
      </div>
    )}
    <div
      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
        busDetails.status
      )}`}
    >
      {busDetails.status?.charAt(0).toUpperCase() +
        busDetails.status?.slice(1) || "Available"}
    </div>
  </div>

  {/* Image Thumbnails */}
  <div className="flex gap-2 overflow-x-auto pb-2">
    {isEditing && (
      <label className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
        <FaUpload className="text-gray-400" />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
    )}

    {isEditing
      ? [
          ...busDetails.rawImages
            .filter(
              (image) =>
                !imagesToDelete.some((img) => img.id === image.id)
            )
            .map((image, index) => (
              <div
                key={`existing-${image.id}`}
                className="relative flex-shrink-0 group"
              >
                <button
                  onClick={() => handleDeleteImage(index, false)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                >
                  <FaTrash size={10} />
                </button>
                <button
                  onClick={() => handleSetMainImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    mainImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image.bus_view_image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            )),
          ...newImages.map((image, index) => (
            <div
              key={`new-${index}`}
              className="relative flex-shrink-0 group"
            >
              <button
                onClick={() => handleDeleteImage(index, true)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
              >
                <FaTrash size={10} />
              </button>
              <button
                onClick={() =>
                  handleSetMainImage(
                    busDetails.rawImages.length + index
                  )
                }
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  mainImageIndex === busDetails.rawImages.length + index
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          )),
        ]
      : allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveImageIndex(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              activeImageIndex === index
                ? "border-red-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={image}
              alt={`View ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
  </div>
</div>

        {/* Bus Header with Rating */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bus Name
                  </label>
                  <input
                    type="text"
                    name="bus_name"
                    value={editedData.bus_name || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ) : (
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {busDetails.bus_name || busDetails.title}
                </h2>
              )}

              {isEditing ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bus Number
                  </label>
                  <input
                    type="text"
                    name="bus_number"
                    value={editedData.bus_number || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ) : (
                <p className="text-lg text-gray-600 mb-2">
                  {busDetails.bus_number || busDetails.vehicleNo}
                </p>
              )}

              {isEditing ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editedData.location || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ) : (
                busDetails.location && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{busDetails.location}</span>
                  </div>
                )
              )}
            </div>
            {busDetails.average_rating > 0 && (
              <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
                <FaStar className="text-yellow-500 mr-2" />
                <span className="font-semibold text-lg">
                  {busDetails.average_rating.toFixed(1)}
                </span>
                <span className="text-gray-600 ml-1">
                  ({busDetails.total_reviews} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xs uppercase text-gray-500 mb-1">CAPACITY</h3>
            {isEditing ? (
              <input
                type="number"
                name="capacity"
                value={editedData.capacity || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-2xl font-medium text-gray-800">
                {busDetails.capacity} seats
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xs uppercase text-gray-500 mb-1">BASE PRICE</h3>
            {isEditing ? (
              <input
                type="number"
                name="base_price"
                value={editedData.base_price || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-2xl font-medium text-gray-800">
                {formatPrice(busDetails.base_price || busDetails.basePrice)}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xs uppercase text-gray-500 mb-1">
              PRICE PER KM
            </h3>
            {isEditing ? (
              <input
                type="number"
                name="price_per_km"
                value={editedData.price_per_km || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-2xl font-medium text-gray-800">
                {formatPrice(busDetails.price_per_km || busDetails.pricePerKm)}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xs uppercase text-gray-500 mb-1">
              MINIMUM FARE
            </h3>
            {isEditing ? (
              <input
                type="number"
                name="minimum_fare"
                value={editedData.minimum_fare || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-2xl font-medium text-gray-800">
                {formatPrice(busDetails.minimum_fare || busDetails.minimumFare)}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xs uppercase text-gray-500 mb-1">BUS TYPE</h3>
            {isEditing ? (
              <select
                name="bus_type"
                value={editedData.bus_type || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Luxury">Luxury</option>
                <option value="Sleeper">Sleeper</option>
              </select>
            ) : (
              <p className="text-2xl font-medium text-gray-800">
                {busDetails.bus_type || busDetails.busType || "Standard"}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xs uppercase text-gray-500 mb-1">RC NUMBER</h3>
            {isEditing ? (
              <input
                type="text"
                name="vehicle_rc_number"
                value={editedData.vehicle_rc_number || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-2xl font-medium text-gray-800">
                {busDetails.vehicle_rc_number || busDetails.rcNumber}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xs uppercase text-gray-500 mb-1">STATUS</h3>
              <select
                name="status"
                value={editedData.status || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="booked">Booked</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-xs uppercase text-gray-500 mb-2">
            VEHICLE DESCRIPTION
          </h3>
          {isEditing ? (
            <textarea
              name="vehicle_description"
              value={editedData.vehicle_description || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md h-32"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {busDetails.vehicle_description ||
                busDetails.description ||
                "No description available"}
            </p>
          )}
        </div>

        {/* Save button when in edit mode */}
        {isEditing && (
          <div className="flex justify-end mb-8">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {isSaving ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        )}

        {/* Enhanced Amenities & Features */}
        <div className="mb-8">
          <h3 className="text-xs uppercase text-gray-500 mb-3">
            AMENITIES & FEATURES
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Render amenities from API */}
            {busDetails.rawAmenities?.map((amenity) => (
              <div
                key={amenity.id}
                className="flex items-center gap-2 text-green-500"
              >
                {amenity.name.toLowerCase().includes("wifi") && (
                  <FaWifi className="text-lg" />
                )}
                {amenity.name.toLowerCase().includes("music") && (
                  <FaMusic className="text-lg" />
                )}
                {amenity.name.toLowerCase().includes("charger") && (
                  <FaChargingStation className="text-lg" />
                )}
                {amenity.name.toLowerCase().includes("cctv") && (
                  <FaVideo className="text-lg" />
                )}
                {!["wifi", "music", "charger", "cctv"].some((keyword) =>
                  amenity.name.toLowerCase().includes(keyword)
                ) && <span className="text-lg">✓</span>}
                <span className="capitalize">{amenity.name}</span>
              </div>
            ))}

            {/* Render features from API */}
            {busDetails.rawFeatures?.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center gap-2 text-blue-500"
              >
                {feature.name.toLowerCase().includes("ac") && (
                  <FaSnowflake className="text-lg" />
                )}
                {feature.name.toLowerCase().includes("pushback") && (
                  <FaCouch className="text-lg" />
                )}
                {feature.name.toLowerCase().includes("solar") && (
                  <FaSolarPanel className="text-lg" />
                )}
                {!["ac", "pushback", "solar"].some((keyword) =>
                  feature.name.toLowerCase().includes(keyword)
                ) && <span className="text-lg">★</span>}
                <span className="capitalize">{feature.name}</span>
              </div>
            ))}

            {/* Show message if no amenities/features */}
            {!busDetails.rawAmenities?.length &&
              !busDetails.rawFeatures?.length && (
                <div className="col-span-full text-gray-500 text-center py-4">
                  No amenities or features listed
                </div>
              )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Documents
          </h3>

          {busDetails.documents?.rc_certificate && (
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-xs uppercase text-gray-500">
                RC CERTIFICATE
              </h3>
              <button
                onClick={() =>
                  downloadDocument(busDetails.documents.rc_certificate)
                }
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors"
              >
                <FaDownload /> View RC Certificate
              </button>
            </div>
          )}

          {busDetails.documents?.license && (
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-xs uppercase text-gray-500">LICENSE</h3>
              <button
                onClick={() => downloadDocument(busDetails.documents.license)}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors"
              >
                <FaDownload /> View Travel License
              </button>
            </div>
          )}

          {busDetails.documents?.contract_carriage_permit && (
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-xs uppercase text-gray-500">
                CONTRACT CARRIAGE PERMIT
              </h3>
              <button
                onClick={() =>
                  downloadDocument(
                    busDetails.documents.contract_carriage_permit
                  )
                }
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors"
              >
                <FaDownload /> View Contract Carriage Permit
              </button>
            </div>
          )}

          {busDetails.documents?.passenger_insurance && (
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-xs uppercase text-gray-500">
                PASSENGER INSURANCE
              </h3>
              <button
                onClick={() =>
                  downloadDocument(busDetails.documents.passenger_insurance)
                }
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors"
              >
                <FaDownload /> View Passenger Insurance
              </button>
            </div>
          )}

          {busDetails.documents?.vehicle_insurance && (
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-xs uppercase text-gray-500">
                VEHICLE INSURANCE
              </h3>
              <button
                onClick={() =>
                  downloadDocument(busDetails.documents.vehicle_insurance)
                }
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors"
              >
                <FaDownload /> View Vehicle Insurance
              </button>
            </div>
          )}

          {busDetails.documents?.travels_logo && (
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-xs uppercase text-gray-500">TRAVELS LOGO</h3>
              <button
                onClick={() =>
                  downloadDocument(busDetails.documents.travels_logo)
                }
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 md:mt-0 transition-colors"
              >
                <FaDownload /> View Travels Logo
              </button>
            </div>
          )}

          {/* Show message if no documents */}
          {!Object.values(busDetails.documents || {}).some(Boolean) && (
            <div className="text-gray-500 text-center py-4">
              No documents available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDetails;

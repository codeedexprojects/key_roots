import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Upload, MapPin, DollarSign, Calendar, Bus } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import {
  getAllCategories,
  getSubCategoriesByCategoryId,
  transformSubCategoryData,
  createPackage
} from "../services/vendorService";
import { useParams } from "react-router";

const AddPackageForm = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    sub_category: "",
    header_image: null,
    places: "",
    days: "",
    ac_available: false,
    guide_included: false,
    buses: [],
    package_images: [],
    bus_location: "",
    price_per_person: "",
    extra_charge_per_km: "",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [headerImagePreview, setHeaderImagePreview] = useState(null);
  const [busImagePreviews, setBusImagePreviews] = useState([]);
  const { vendorId } = useParams();


  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return formData.latitude && formData.longitude ? (
      <Marker position={[formData.latitude, formData.longitude]} />
    ) : null;
  }

  useEffect(() => {
    if (formData.bus_location && formData.bus_location.trim() !== "") {
      const provider = new OpenStreetMapProvider();

      const searchLocation = async () => {
        const results = await provider.search({ query: formData.bus_location });
        if (results.length > 0) {
          const { x: lng, y: lat, label } = results[0];
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            bus_location: label,
          }));
        }
      };

      const timer = setTimeout(searchLocation, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.bus_location]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleHeaderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        header_image: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setHeaderImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePackageImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 10;

    if (formData.package_images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    const newImages = [...formData.package_images, ...files];
    setFormData((prev) => ({
      ...prev,
      package_images: newImages,
    }));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await getAllCategories();
      console.log(response);

      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    try {
      const response = await getSubCategoriesByCategoryId(categoryId);
      console.log(response);

      if (response && response.subcategories) {
        const transformedSubCategories = transformSubCategoryData(
          response.subcategories
        );
        setSubCategories(transformedSubCategories);
      } else {
        setSubCategories([]);
        toast.error(response?.message || "Failed to load subcategories");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to load subcategories");
      setSubCategories([]);
    }
  };
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      sub_category: "", // Reset subcategory when category changes
    }));
    fetchSubCategories(categoryId);
  };

  const handleSubCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      sub_category: e.target.value,
    }));
  };

  const removePackageImage = (index) => {
    const newImages = formData.package_images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      package_images: newImages,
    }));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("vendor_id", vendorId);


      // Add basic fields
      const basicFields = [
        "sub_category",
        "places",
        "days",
        "ac_available",
        "guide_included",
        "bus_location",
        "price_per_person",
        "extra_charge_per_km",
        
      ];

      basicFields.forEach((field) => {
        if (formData[field] !== null && formData[field] !== undefined) {
          submitData.append(field, formData[field]);
        }
      });

      // Add files
      if (formData.header_image) {
        submitData.append("header_image", formData.header_image);
      }

      // Add arrays
      formData.package_images.forEach((image) => {
        submitData.append("package_images", image);
      });

      formData.buses.forEach((bus) => {
        submitData.append("buses", bus);
      });

      // Here you would typically call your API to submit the form data
      const response = await createPackage(submitData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Package added successfully!");
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error adding package:", error);
      toast.error("Failed to add package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      sub_category: "",
      header_image: null,
      places: "",
      days: "",
      ac_available: false,
      guide_included: false,
      buses: [],
      package_images: [],
      bus_location: "",
      price_per_person: "",
      extra_charge_per_km: "",
    });
    setImagePreviews([]);
    setHeaderImagePreview(null);
    setBusImagePreviews([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Bus className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Package
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Package Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={loadingCategories}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {loadingCategories && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading categories...
                  </p>
                )}
              </div>

              {/* Subcategory Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category *
                </label>
                <select
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleSubCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={!formData.category || subCategories.length === 0}
                >
                  <option value="">Select a subcategory</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
                {formData.category && subCategories.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No subcategories available for this category
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Places *
                </label>
                <input
                  type="text"
                  name="places"
                  value={formData.places}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days *
                </label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="ac_available"
                  checked={formData.ac_available}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500 mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  AC Available
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="guide_included"
                  checked={formData.guide_included}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500 mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Guide Included
                </label>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Pricing Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Per Person (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price_per_person"
                  value={formData.price_per_person}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extra Charge per KM (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="extra_charge_per_km"
                  value={formData.extra_charge_per_km}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Bus Location
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Location *
                </label>
                <input
                  type="text"
                  name="bus_location"
                  value={formData.bus_location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  placeholder="Search for bus location"
                />
              </div>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapContainer
                  center={
                    formData.latitude && formData.longitude
                      ? [formData.latitude, formData.longitude]
                      : [20.5937, 78.9629]
                  }
                  zoom={formData.latitude && formData.longitude ? 15 : 5}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Header Image */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Header Image
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderImageChange}
                  className="hidden"
                  id="header-image"
                />
                <label
                  htmlFor="header-image"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors"
                >
                  {headerImagePreview ? (
                    <img
                      src={headerImagePreview}
                      alt="Header preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload header image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Package Images */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Package Images (Max 10)
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePackageImagesUpload}
                  className="hidden"
                  id="package-images"
                />
                <label
                  htmlFor="package-images"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload package images
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG up to 10MB each
                    </p>
                  </div>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Package image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePackageImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Package..." : "Add Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPackageForm;

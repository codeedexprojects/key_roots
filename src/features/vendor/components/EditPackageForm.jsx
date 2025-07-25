import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Upload, MapPin, DollarSign, Calendar, Bus } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import {
  getAllCategories,
  getSubCategoriesByCategoryId,
  transformSubCategoryData,
  editPackage,
  getPackageDetails,
  getVendorBuses,
} from "../services/vendorService";
import { getImageUrl } from "@/lib/getImageUrl";

const EditPackageForm = ({ isOpen, onClose, pkg }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [buses, setBuses] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBuses, setLoadingBuses] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    sub_category: "",
    header_image: null,
    places: "",
    days: "",
    ac_available: false,
    guide_included: false,
    buses: "",
    package_images: [],
    bus_location: "",
    price_per_person: "",
    extra_charge_per_km: "",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [headerImagePreview, setHeaderImagePreview] = useState(null);
  const [existingHeaderImage, setExistingHeaderImage] = useState("");
  const [existingPackageImages, setExistingPackageImages] = useState([]);
  const { vendorId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && pkg) {
      fetchPackageDetails();
      fetchCategories();
      fetchBuses();
    }
  }, [isOpen, pkg]);

  const fetchPackageDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getPackageDetails(pkg.id);
      console.log("Package details response:", response);
      const packageData = response.data;

      // Set existing images
      if (packageData.header_image) {
        setExistingHeaderImage(packageData.header_image);
      }
      if (packageData.package_images && packageData.package_images.length > 0) {
        setExistingPackageImages(packageData.package_images);
      }

      // Fetch subcategories for the package's category
      if (packageData.sub_category?.category_id) {
        await fetchSubCategories(packageData.sub_category.category_id);
      }

      setFormData({
        category: packageData.sub_category?.category_id || "",
        sub_category: packageData.sub_category?.id || "",
        places: packageData.places || "",
        days: packageData.days || "",
        ac_available: packageData.ac_available || false,
        guide_included: packageData.guide_included || false,
        buses: packageData.buses?.id || "",
        bus_location: packageData.bus_location || "",
        price_per_person: packageData.price_per_person || "",
        extra_charge_per_km: packageData.extra_charge_per_km || "",
        header_image: null,
        package_images: [],
      });

    } catch (error) {
      console.error("Error fetching package details:", error);
      toast.error("Failed to load package details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchBuses = async () => {
    setLoadingBuses(true);
    try {
      const response = await getVendorBuses(vendorId);
      setBuses(response.data || []);
    } catch (error) {
      console.error("Error fetching buses:", error);
      toast.error("Failed to load buses");
    } finally {
      setLoadingBuses(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    try {
      const response = await getSubCategoriesByCategoryId(categoryId);
      if (response && response.subcategories) {
        const transformedSubCategories = transformSubCategoryData(
          response.subcategories
        );
        setSubCategories(transformedSubCategories);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      sub_category: "",
    }));
    fetchSubCategories(categoryId);
  };

  const handleBusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      buses: e.target.value,
    }));
  };

  const handleSubCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      sub_category: e.target.value,
    }));
  };

  const handleHeaderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        header_image: file,
      }));
      setExistingHeaderImage("");

      const reader = new FileReader();
      reader.onload = (e) => {
        setHeaderImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePackageImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 10 - existingPackageImages.length;

    if (formData.package_images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} more images`);
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

  const removePackageImage = (index) => {
    const newImages = formData.package_images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      package_images: newImages,
    }));
    setImagePreviews(newPreviews);
  };

  const removeExistingPackageImage = (index) => {
    const newImages = [...existingPackageImages];
    newImages.splice(index, 1);
    setExistingPackageImages(newImages);
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
        "buses",
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

      // Add files if they've been changed
      if (formData.header_image) {
        submitData.append("header_image", formData.header_image);
      } else if (existingHeaderImage) {
        // If no new header image but existing one should be kept
        submitData.append("existing_header_image", existingHeaderImage);
      }

      // Add new package images
      formData.package_images.forEach((image) => {
        submitData.append("package_images", image);
      });

      // Add existing package images that haven't been removed
      existingPackageImages.forEach((image) => {
        submitData.append("existing_package_images[]", image);
      });

      await editPackage(pkg.id, submitData);

      toast.success("Package updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating package:", error);
      toast.error(error.response?.data?.message || "Failed to update package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6">
          <p>Loading package details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Bus className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Edit Package</h2>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buses *
                </label>
                <select
                  name="buses"
                  value={formData.buses}
                  onChange={handleBusChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  disabled={loadingBuses}
                >
                  <option value="">Select a Bus</option>
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.bus_name}
                    </option>
                  ))}
                </select>
                {loadingBuses && (
                  <p className="text-xs text-gray-500 mt-1">Loading buses...</p>
                )}
              </div>
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
                  ) : existingHeaderImage ? (
                    <img
                      src={getImageUrl(existingHeaderImage)}
                      alt="Existing header"
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

              {/* Existing images */}
              {existingPackageImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingPackageImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={getImageUrl(image)}
                        alt={`Existing package image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingPackageImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Newly uploaded images */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img
                        src={preview}
                        alt={`New package image ${index + 1}`}
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
              {isSubmitting ? "Updating Package..." : "Update Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPackageForm;
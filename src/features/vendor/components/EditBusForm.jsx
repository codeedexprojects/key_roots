import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  X,
  Upload,
  MapPin,
  DollarSign,
  FileText,
  Camera,
  Settings,
  Bus,
} from "lucide-react";
import { editBusById, getAllAmenities, getBusDetails } from "../services/vendorService";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

const EditBusForm = ({ isOpen, onClose, bus, vendorId, onBusUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    bus_name: "",
    bus_number: "",
    bus_type: "",
    capacity: "",
    vehicle_description: "",
    status: "available",
    is_popular: false,

    // Pricing
    base_price: "",
    base_price_km: "",
    price_per_km: "",
    night_allowance: "",
    minimum_fare: "",

    // Location
    location: "",
    latitude: "",
    longitude: "",

    // Documents
    travels_logo: null,
    rc_certificate: null,
    license: null,
    contract_carriage_permit: null,
    passenger_insurance: null,
    vehicle_insurance: null,

    // Arrays
    bus_images: [],
    amenities: [],
    features: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [documentPreviews, setDocumentPreviews] = useState({});
  
  // Initialize leaflet icon
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
    if (formData.location && formData.location.trim() !== "") {
      const provider = new OpenStreetMapProvider();

      const searchLocation = async () => {
        const results = await provider.search({ query: formData.location });
        if (results.length > 0) {
          const { x: lng, y: lat, label } = results[0];
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            location: label,
          }));
        }
      };

      const timer = setTimeout(searchLocation, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.location]);

  useEffect(() => {
    if (isOpen && bus) {
      loadAmenities();
      initializeFormData();
    }
  }, [isOpen, bus]);
  
  useEffect(() => {
    if (isOpen && bus) {
      loadAmenities();
      fetchBusData();
    }
  }, [isOpen, bus]);
    const fetchBusData = async () => {
    setIsLoading(true);
    try {
      const response = await getBusDetails(bus.id);
      console.log(response);
      

      if (response) {
        const data = response;
        initializeFormData(data);
        
        // Set document previews
        const docFields = {
          'travels_logo': data.travels_logo,
          'rc_certificate': data.rc_certificate,
          'license': data.license,
          'contract_carriage_permit': data.contract_carriage_permit,
          'passenger_insurance': data.passenger_insurance,
          'vehicle_insurance': data.vehicle_insurance
        };
        
        const newDocPreviews = {};
        Object.entries(docFields).forEach(([field, value]) => {
          if (value) {
            newDocPreviews[field] = value;
          }
        });
        setDocumentPreviews(newDocPreviews);
      }
    } catch (error) {
      console.error('Error fetching bus details:', error);
      toast.error('Failed to load bus details');
    } finally {
      setIsLoading(false);
    }
  };


const initializeFormData = (data = bus) => {
  // Transform the bus data to match the form structure
  const transformedBus = {
    bus_name: data.bus_name || "",
    bus_number: data.bus_number || "",
    bus_type: data.bus_type ||  "",
    capacity: data.capacity || "",
    vehicle_description: data.vehicle_description || "",
    status: data.status || "available",
    is_popular: data.is_popular || false,
    base_price: data.base_price || "",
    base_price_km: data.base_price_km || "",
    price_per_km: data.price_per_km || "",
    night_allowance: data.night_allowance || "",
    minimum_fare: data.minimum_fare || "",
    location: data.location || "",
    latitude: data.latitude || "",
    longitude: data.longitude || "",
    travels_logo: data.travels_logo || null,
    rc_certificate: data.rc_certificate || null,
    license: data.license || null,
    contract_carriage_permit: data.contract_carriage_permit || null,
    passenger_insurance: data.passenger_insurance || null,
    vehicle_insurance: data.vehicle_insurance || null,
    bus_images: data.images?.map(img => img.bus_view_image) || [],
    amenities: data.amenities?.map(amenity => amenity.id) || [],
    features: data.features?.map(feature => feature.id) || [],
  };

  setFormData(transformedBus);

  // Set image previews
  if (data.images && data.images.length > 0) {
    setImagePreviews(data.images.map(img => img.bus_view_image));
  }

  // Set document previews if available
  const docFields = [
    'travels_logo', 'rc_certificate', 'license', 
    'contract_carriage_permit', 'passenger_insurance', 'vehicle_insurance'
  ];
  
  const newDocPreviews = {};
  docFields.forEach(field => {
    if (data[field]) {
      newDocPreviews[field] = data[field];
    }
  });
  setDocumentPreviews(newDocPreviews);
};

  const loadAmenities = async () => {
    try {
      const response = await getAllAmenities();
      if (response && !response.error) {
        setAvailableAmenities(response.data || response || []);
      }
    } catch (error) {
      console.error("Error loading amenities:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));

      // Create preview for documents
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentPreviews((prev) => ({
          ...prev,
          [fieldName]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 7;

    if (formData.bus_images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    const newImages = [...formData.bus_images, ...files];
    setFormData((prev) => ({
      ...prev,
      bus_images: newImages,
    }));

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = formData.bus_images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      bus_images: newImages,
    }));
    setImagePreviews(newPreviews);
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const FEATURE_MAPPING = {
    AC: 3,
    Pushback: 4,
  };

  const handleFeatureToggle = (featureName) => {
    const featureId = FEATURE_MAPPING[featureName];

    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((id) => id !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add basic fields
      const basicFields = [
        "bus_name",
        "bus_number",
        "bus_type",
        "capacity",
        "vehicle_description",
        "status",
        "base_price",
        "base_price_km",
        "price_per_km",
        "night_allowance",
        "minimum_fare",
        "location",
        "latitude",
        "longitude",
        "is_popular",
      ];

      basicFields.forEach((field) => {
        if (formData[field] !== null && formData[field] !== undefined) {
          submitData.append(field, formData[field]);
        }
      });

      // Add document files if they are new files
      const documentFields = [
        "travels_logo",
        "rc_certificate",
        "license",
        "contract_carriage_permit",
        "passenger_insurance",
        "vehicle_insurance",
      ];

      documentFields.forEach((field) => {
        if (formData[field] && formData[field] instanceof File) {
          submitData.append(field, formData[field]);
        }
      });

      // Add bus images array (only new images)
      formData.bus_images.forEach((image) => {
        if (image instanceof File) {
          submitData.append(`bus_images`, image);
        }
      });

      // Add amenities array
      formData.amenities.forEach((amenityId) => {
        submitData.append("amenities", amenityId);
      });

      // Add features array
      formData.features.forEach((featureId) => {
        submitData.append("features", featureId);
      });

      const response = await editBusById(bus.id, submitData);

      if (response && !response.error) {
        toast.success("Bus updated successfully!");
        onBusUpdated(response.data);
        onClose();
      } else {
        toast.error(response?.message || "Failed to update bus");
      }
    } catch (error) {
      console.error("Error updating bus:", error);
      toast.error("Failed to update bus. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Bus className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Edit Bus</h2>
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
              <Settings className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Basic Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Name *
                </label>
                <input
                  type="text"
                  name="bus_name"
                  value={formData.bus_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Number *
                </label>
                <input
                  type="text"
                  name="bus_number"
                  value={formData.bus_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Type
                </label>
                <select
                  name="bus_type"
                  value={formData.bus_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Bus Type</option>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                  <option value="Sleeper">Sleeper</option>
                  <option value="Semi-Sleeper">Semi-Sleeper</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_popular"
                  checked={formData.is_popular}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500 mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Mark as Popular
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Description
              </label>
              <textarea
                name="vehicle_description"
                value={formData.vehicle_description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Describe the vehicle features and amenities..."
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price per KM (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="base_price_km"
                  value={formData.base_price_km}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per KM (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price_per_km"
                  value={formData.price_per_km}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Night Allowance (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="night_allowance"
                  value={formData.night_allowance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Fare (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="minimum_fare"
                  value={formData.minimum_fare}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Location Information
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  placeholder="Search for a location"
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

          {/* Bus Images */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Camera className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Bus Images (Max 7)
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="bus-images"
                />
                <label
                  htmlFor="bus-images"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload bus images
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
                        src={preview}
                        alt={`Bus image ${index + 1}`}
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
          </div>

          {/* Documents */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Documents</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "travels_logo", label: "Travels Logo" },
                { key: "rc_certificate", label: "RC Certificate" },
                { key: "license", label: "License" },
                {
                  key: "contract_carriage_permit",
                  label: "Contract Carriage Permit",
                },
                { key: "passenger_insurance", label: "Passenger Insurance" },
                { key: "vehicle_insurance", label: "Vehicle Insurance" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, key)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {documentPreviews[key] && (
                    <div className="mt-2">
                      <img
                        src={documentPreviews[key]}
                        alt={label}
                        className="w-20 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Amenities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableAmenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Features
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(FEATURE_MAPPING).map((featureName) => (
                <label
                  key={featureName}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.features.includes(
                      FEATURE_MAPPING[featureName]
                    )}
                    onChange={() => handleFeatureToggle(featureName)}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{featureName}</span>
                </label>
              ))}
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
              {isSubmitting ? "Updating Bus..." : "Update Bus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBusForm;
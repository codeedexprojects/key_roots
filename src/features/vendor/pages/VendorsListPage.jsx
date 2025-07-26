import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useNavigate } from "react-router";
import { getAllVendors } from "../services/vendorService";
import { LoadingSpinner, EmptyState } from "@/components/common";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/getImageUrl";

export const VendorsListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL params
  const getInitialState = () => ({
    currentPage: parseInt(searchParams.get("page") || "1", 10),
    searchTerm: searchParams.get("search") || "",
    sortBy: searchParams.get("sort_by") || "name",
    filterState: searchParams.get("state") || "all",
    filterDistrict: searchParams.get("district") || "all",
    filterCity: searchParams.get("city") || "all",
    minBuses: searchParams.get("min_buses") || "",
    maxBuses: searchParams.get("max_buses") || "",
    minPackages: searchParams.get("min_packages") || "",
    maxPackages: searchParams.get("max_packages") || "",
    hasPackages: searchParams.get("has_packages") || "all",
    hasBuses: searchParams.get("has_buses") || "all",
    packageStatus: searchParams.get("package_status") || "all",
  });

  // State management
  const [state, setState] = useState(getInitialState());
  const [searchInput, setSearchInput] = useState(state.searchTerm); // For input field
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Data state
  const [vendors, setVendors] = useState({
    data: [],
    count: 0,
    next: null,
    previous: null,
  });

  const [vendorStats, setVendorStats] = useState({
    total_vendors: 0,
    active_vendors: 0,
    inactive_vendors: 0,
    total_buses: 0,
    vendors_with_bookings: 0,
    vendors_without_bookings: 0,
    vendors_with_packages: 0,
    vendors_without_packages: 0,
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update URL params when state changes
  const updateURLParams = useCallback((newState) => {
    const params = new URLSearchParams();
    
    if (newState.currentPage > 1) params.set("page", newState.currentPage.toString());
    if (newState.searchTerm) params.set("search", newState.searchTerm);
    if (newState.sortBy !== "name") params.set("sort_by", newState.sortBy);
    if (newState.filterState !== "all") params.set("state", newState.filterState);
    if (newState.filterDistrict !== "all") params.set("district", newState.filterDistrict);
    if (newState.filterCity !== "all") params.set("city", newState.filterCity);
    if (newState.minBuses) params.set("min_buses", newState.minBuses);
    if (newState.maxBuses) params.set("max_buses", newState.maxBuses);
    if (newState.minPackages) params.set("min_packages", newState.minPackages);
    if (newState.maxPackages) params.set("max_packages", newState.maxPackages);
    if (newState.hasPackages !== "all") params.set("has_packages", newState.hasPackages);
    if (newState.hasBuses !== "all") params.set("has_buses", newState.hasBuses);
    if (newState.packageStatus !== "all") params.set("package_status", newState.packageStatus);

    setSearchParams(params);
  }, [setSearchParams]);

  // Debounced search function
  const debouncedSearch = useCallback((searchValue) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setState(prev => ({
        ...prev,
        searchTerm: searchValue,
        currentPage: 1, // Reset to first page on search
      }));
    }, 500); // 500ms delay

    setSearchTimeout(timeout);
  }, [searchTimeout]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  // Fetch vendors data
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      // Prepare filters for API
      const filters = {};
      
      if (state.searchTerm.trim()) {
        filters.search = state.searchTerm.trim();
      }
      
      if (state.sortBy && state.sortBy !== "name") {
        filters.sort_by = state.sortBy;
      }
      
      if (state.filterState !== "all") {
        filters.state = state.filterState;
      }
      
      if (state.filterDistrict !== "all") {
        filters.district = state.filterDistrict;
      }

      if (state.filterCity !== "all") {
        filters.city = state.filterCity;
      }

      if (state.minBuses) {
        filters.min_buses = state.minBuses;
      }

      if (state.maxBuses) {
        filters.max_buses = state.maxBuses;
      }

      if (state.minPackages) {
        filters.min_packages = state.minPackages;
      }

      if (state.maxPackages) {
        filters.max_packages = state.maxPackages;
      }

      if (state.hasPackages !== "all") {
        filters.has_packages = state.hasPackages;
      }

      if (state.hasBuses !== "all") {
        filters.has_buses = state.hasBuses;
      }

      if (state.packageStatus !== "all") {
        filters.package_status = state.packageStatus;
      }

      const response = await getAllVendors(state.currentPage, filters);
      console.log(response);

      if (response) {
        const transformedVendors = response.results.data.map((vendor) => ({
          id: vendor.user_id,
          name: vendor.travels_name || vendor.full_name,
          location: vendor.location || vendor.city || "Not specified",
          state: vendor.state || "Unknown",
          district: vendor.district || "Not specified",
          city: vendor.city || "Not specified",
          busesCount: vendor.bus_count || 0,
          packagesCount: vendor.package_count || 0,
          availableBuses: vendor.buses?.length || 0,
          ongoingBuses: vendor.ongoing_buses?.length || 0,
          bookings: vendor.bookings?.length || 0,
          earnings: vendor.earnings || 0,
          status: vendor.is_active ? "active" : "inactive",
          image:
            vendor.buses?.[0]?.travels_logo ||
            "/placeholder.svg?height=48&width=48",
          created_at: vendor.created_at || new Date().toISOString(),
          hasBookings: (vendor.bookings?.length || 0) > 0,
          hasPackages: (vendor.package_count || 0) > 0,
        }));

        setVendors({
          data: transformedVendors,
          count: response.count,
          next: response.next,
          previous: response.previous,
        });

        // Calculate stats from response if available, otherwise calculate locally
        if (response.stats) {
          setVendorStats(response.stats);
        } else {
          // Fallback: calculate stats locally (only for current page data)
          const totalVendors = response.count;
          const activeVendors = transformedVendors.filter(
            (v) => v.status === "active"
          ).length;
          const inactiveVendors = transformedVendors.filter(
            (v) => v.status === "inactive"
          ).length;
          const totalBuses = transformedVendors.reduce(
            (sum, v) => sum + v.busesCount,
            0
          );
          const vendorsWithBookings = transformedVendors.filter(
            (v) => v.hasBookings
          ).length;
          const vendorsWithPackages = transformedVendors.filter(
            (v) => v.hasPackages
          ).length;

          setVendorStats({
            total_vendors: totalVendors,
            active_vendors: activeVendors,
            inactive_vendors: inactiveVendors,
            total_buses: totalBuses,
            vendors_with_bookings: vendorsWithBookings,
            vendors_without_bookings:
              transformedVendors.length - vendorsWithBookings,
            vendors_with_packages: vendorsWithPackages,
            vendors_without_packages:
              transformedVendors.length - vendorsWithPackages,
          });
        }

        setError(null);
      } else {
        setError("Failed to load vendors");
        toast.error("Failed to load vendors");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to load vendors. Please try again later.");
      toast.error("Failed to load vendors. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [state]);

  // Effect to fetch data when state changes
  useEffect(() => {
    fetchVendors();
    updateURLParams(state);
  }, [fetchVendors, updateURLParams, state]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Handle sorting change
  const handleSortChange = (newSortBy) => {
    setState(prev => ({
      ...prev,
      sortBy: newSortBy,
      currentPage: 1,
      // Reset district filter if not sorting by state
      filterDistrict: newSortBy !== "state" && prev.filterState === "all" ? "all" : prev.filterDistrict,
    }));
  };

  // Handle state filter change
  const handleStateFilterChange = (newState) => {
    setState(prev => ({
      ...prev,
      filterState: newState,
      filterDistrict: "all", // Reset district when state changes
      filterCity: "all", // Reset city when state changes
      currentPage: 1,
    }));
  };

  // Handle district filter change
  const handleDistrictFilterChange = (newDistrict) => {
    setState(prev => ({
      ...prev,
      filterDistrict: newDistrict,
      filterCity: "all", // Reset city when district changes
      currentPage: 1,
    }));
  };

  // Handle city filter change
  const handleCityFilterChange = (newCity) => {
    setState(prev => ({
      ...prev,
      filterCity: newCity,
      currentPage: 1,
    }));
  };

  // Handle advanced filter changes
  const handleAdvancedFilterChange = (filterName, value) => {
    setState(prev => ({
      ...prev,
      [filterName]: value,
      currentPage: 1,
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    const resetState = {
      currentPage: 1,
      searchTerm: "",
      sortBy: "name",
      filterState: "all",
      filterDistrict: "all",
      filterCity: "all",
      minBuses: "",
      maxBuses: "",
      minPackages: "",
      maxPackages: "",
      hasPackages: "all",
      hasBuses: "all",
      packageStatus: "all",
    };
    setState(resetState);
    setSearchInput("");
  };

  // Check if any advanced filters are applied
  const hasAdvancedFilters = () => {
    return state.minBuses || state.maxBuses || state.minPackages || state.maxPackages || 
           state.hasPackages !== "all" || state.hasBuses !== "all" || state.packageStatus !== "all";
  };

  // Pagination
  const vendorsPerPage = 10; // Should match your API's items per page
  const totalPages = Math.ceil(vendors.count / vendorsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setState(prev => ({
        ...prev,
        currentPage: pageNumber,
      }));
    }
  };

  // Get unique states, districts, and cities for filters
  const availableStates = Array.from(
    new Set(vendors.data.map((v) => v.state).filter(Boolean))
  ).sort();

  const availableDistricts = Array.from(
    new Set(
      vendors.data
        .filter((vendor) =>
          state.filterState !== "all"
            ? vendor.state.toLowerCase() === state.filterState.toLowerCase()
            : true
        )
        .map((vendor) => vendor.district)
        .filter(Boolean)
    )
  ).sort();

  const availableCities = Array.from(
    new Set(
      vendors.data
        .filter((vendor) => {
          let stateMatch = state.filterState !== "all" 
            ? vendor.state.toLowerCase() === state.filterState.toLowerCase() 
            : true;
          let districtMatch = state.filterDistrict !== "all" 
            ? vendor.district.toLowerCase() === state.filterDistrict.toLowerCase() 
            : true;
          return stateMatch && districtMatch;
        })
        .map((vendor) => vendor.city)
        .filter(Boolean)
    )
  ).sort();

  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(
      1,
      state.currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Sort options mapping - Updated with newest first
  const sortOptions = [
    { value: "name", label: "Sort by: Name (A-Z)" },
    { value: "name_desc", label: "Sort by: Name (Z-A)" },
    { value: "location", label: "Sort by: Location" },
    { value: "created_desc", label: "Sort by: Newest First" },
    { value: "created_asc", label: "Sort by: Oldest First" },
    { value: "bus_count", label: "Sort by: Bus Count" },
    { value: "package_count", label: "Sort by: Package Count" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Vendors</h1>
        <Link
          to="/admin/vendors/create"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Link>
      </div>

      {/* Vendor Stats */}
      {loading && state.currentPage === 1 ? (
        <div className="flex justify-center items-center min-h-[100px]">
          <LoadingSpinner size="medium" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Vendors",
              value: vendorStats.total_vendors,
              icon: "vendor",
            },
            {
              label: "Active Vendors",
              value: vendorStats.active_vendors,
              icon: "active",
            },
            {
              label: "Inactive Vendors",
              value: vendorStats.inactive_vendors,
              icon: "inactive",
            },
            {
              label: "Total Buses",
              value: vendorStats.total_buses,
              icon: "bus",
            },
           
          ].map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      stat.icon === "vendor"
                        ? "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        : stat.icon === "active"
                        ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        : stat.icon === "inactive"
                        ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        : stat.icon === "bus"
                        ? "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        : stat.icon === "bookings"
                        ? "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        : stat.icon === "no-bookings"
                        ? "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        : stat.icon === "packages"
                        ? "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        : "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4m0 0l4-2m-4 2v-4"
                    }
                  />
                </svg>
                <h3 className="text-gray-600 text-sm">{stat.label}</h3>
              </div>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-md shadow-sm p-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Search and Basic Filters Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search by name, place, or mobile number"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm w-full"
                value={searchInput}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  value={state.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  value={state.filterState}
                  onChange={(e) => handleStateFilterChange(e.target.value)}
                >
                  <option value="all">Filter by: State</option>
                  {availableStates.map((stateOption) => (
                    <option key={stateOption} value={stateOption}>
                      {stateOption}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>

              {/* District Filter Dropdown (Conditional) */}
              {(state.filterState !== "all" || state.sortBy === "state") &&
                availableDistricts.length > 0 && (
                  <div className="relative">
                    <select
                      className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white"
                      value={state.filterDistrict}
                      onChange={(e) => handleDistrictFilterChange(e.target.value)}
                    >
                      <option value="all">Filter by: District</option>
                      {availableDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                )}

              {/* City Filter Dropdown (Conditional) */}
              {(state.filterState !== "all" || state.filterDistrict !== "all") &&
                availableCities.length > 0 && (
                  <div className="relative">
                    <select
                      className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm bg-white"
                      value={state.filterCity}
                      onChange={(e) => handleCityFilterChange(e.target.value)}
                    >
                      <option value="all">Filter by: City</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                )}

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                  hasAdvancedFilters() 
                    ? 'bg-blue-50 text-blue-700 border-blue-300' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                {hasAdvancedFilters() && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                    •
                  </span>
                )}
              </button>

              {(state.searchTerm || state.filterState !== "all" || state.filterDistrict !== "all" || 
                state.filterCity !== "all" || hasAdvancedFilters()) && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Bus Count Filters */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Min Buses
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={state.minBuses}
                    onChange={(e) => handleAdvancedFilterChange('minBuses', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Max Buses
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={state.maxBuses}
                    onChange={(e) => handleAdvancedFilterChange('maxBuses', e.target.value)}
                  />
                </div>

                {/* Package Count Filters */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Min Packages
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={state.minPackages}
                    onChange={(e) => handleAdvancedFilterChange('minPackages', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Max Packages
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={state.maxPackages}
                    onChange={(e) => handleAdvancedFilterChange('maxPackages', e.target.value)}
                  />
                </div>

                {/* Has Packages Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Has Packages
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={state.hasPackages}
                    onChange={(e) => handleAdvancedFilterChange('hasPackages', e.target.value)}
                  >
                    <option value="all">All Vendors</option>
                    <option value="true">With Packages</option>
                    <option value="false">Without Packages</option>
                  </select>
                </div>

                {/* Has Buses Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Has Buses
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={state.hasBuses}
                    onChange={(e) => handleAdvancedFilterChange('hasBuses', e.target.value)}
                  >
                    <option value="all">All Vendors</option>
                    <option value="true">With Buses</option>
                    <option value="false">Without Buses</option>
                  </select>
                </div>

                {/* Package Status Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Package Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={state.packageStatus}
                    onChange={(e) => handleAdvancedFilterChange('packageStatus', e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="medium" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-gray-200 rounded-lg p-6 text-center min-h-[300px] flex items-center justify-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : vendors.data.length === 0 ? (
          <EmptyState
            title="No vendors found"
            description="There are no vendors matching your criteria."
            icon="default"
          />
        ) : (
          /* Vendor Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
            {vendors.data.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() =>
                  navigate(`/admin/vendors/${vendor.id}?page=${state.currentPage}`)
                }
              >
                {/* Three dots menu */}
                <button className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </button>

                {/* Vendor Profile */}
                <div className="flex flex-col items-center mb-4">
                  <img
                    className="h-12 w-12 rounded-full mb-2"
                    src={
                      vendor.image !== "/placeholder.svg?height=48&width=48"
                        ? getImageUrl(vendor.image)
                        : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    }
                    alt={vendor.name}
                  />
                  <h3
                    className="text-sm font-medium text-gray-900 text-center leading-tight truncate w-full"
                    title={vendor.name}
                  >
                    {vendor.name}
                  </h3>
                  <p
                    className="text-xs text-gray-500 mt-1 truncate w-full text-center"
                    title={vendor.location}
                  >
                    Located in {vendor.location || "Not specified"}
                  </p>
                  <p
                    className="text-xs text-gray-500 mt-1 truncate w-full text-center"
                    title={vendor.district}
                  >
                    District: {vendor.district || "Not specified"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Amount earned [₹{vendor.earnings.toLocaleString()}]
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500">
                      Buses
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {vendor.busesCount.toString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500">
                      Packages
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {vendor.packagesCount.toString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500">
                      Bookings
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {vendor.bookings.toString()}
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Has Bookings</span>
                    <span className="text-xs font-medium text-gray-900">
                      {vendor.hasBookings ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Has Packages</span>
                    <span className="text-xs font-medium text-gray-900">
                      {vendor.hasPackages ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {vendors.data.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(state.currentPage - 1) * vendorsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(state.currentPage * vendorsPerPage, vendors.count)}
                </span>{" "}
                of <span className="font-medium">{vendors.count}</span> vendors
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={() => paginate(state.currentPage - 1)}
                  disabled={state.currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                    state.currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {state.currentPage > Math.floor(maxVisiblePages / 2) + 1 && (
                  <>
                    <button
                      onClick={() => paginate(1)}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      1
                    </button>
                    {state.currentPage > Math.floor(maxVisiblePages / 2) + 2 && (
                      <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                  </>
                )}

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      state.currentPage === page
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    } rounded-md`}
                  >
                    {page}
                  </button>
                ))}

                {state.currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
                  <>
                    {state.currentPage <
                      totalPages - Math.floor(maxVisiblePages / 2) - 1 && (
                      <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => paginate(totalPages)}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => paginate(state.currentPage + 1)}
                  disabled={state.currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                    state.currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
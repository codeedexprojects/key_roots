import React, { useState } from 'react';
import { addDayPlans } from '../services/vendorService';
import { useParams } from 'react-router';

function AddPackageDay({ onClose }) {
  const [places, setPlaces] = useState([{ name: '', description: '', images: [] }]);
  const { vendorId,packageId } = useParams();
  const [stays, setStays] = useState([{ 
    resortName: '', 
    location: '', 
    images: [], 
    roomTypes: [{ type: 'AC', breakfastIncluded: false }] 
  }]);
  const [meals, setMeals] = useState([{
    mealType: '',
    description: '',
    restaurantName: '',
    mealTime: '',
    location: '',
    images: [],
    included: true
  }]);
  const [activities, setActivities] = useState([{
    heading: '',
    time: '',
    description: '',
    images: [],
  }]);
  const [nightStayIncluded, setNightStayIncluded] = useState(false);
  const [description , setDescription] = useState('');

  const handlePlaceChange = (index, field, value) => {
    const updatedPlaces = [...places];
    updatedPlaces[index][field] = value;
    setPlaces(updatedPlaces);
  };

  const handleAddPlace = () => {
    setPlaces([...places, { name: '', description: '', images: [] }]);
  };

  const handleRemovePlace = (index) => {
    const updatedPlaces = places.filter((_, i) => i !== index);
    setPlaces(updatedPlaces);
  };

  const handleStayChange = (stayIndex, field, value) => {
    const updatedStays = [...stays];
    updatedStays[stayIndex][field] = value;
    setStays(updatedStays);
  };

  const handleRoomTypeChange = (stayIndex, roomIndex, field, value) => {
    const updatedStays = [...stays];
    updatedStays[stayIndex].roomTypes[roomIndex][field] = value;
    setStays(updatedStays);
  };

  const handleAddStay = () => {
    setStays([...stays, { 
      resortName: '', 
      location: '', 
      images: [], 
      roomTypes: [{ type: 'AC', breakfastIncluded: false }] 
    }]);
  };

  const handleRemoveStay = (index) => {
    const updatedStays = stays.filter((_, i) => i !== index);
    setStays(updatedStays);
  };

  const handleMealChange = (index, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index][field] = value;
    setMeals(updatedMeals);
  };

  const handleAddMeal = () => {
    setMeals([...meals, {
      mealType: '',
      description: '',
      restaurantName: '',
      mealTime: '',
      location: '',
      images: [],
      included: true
    }]);
  };

  const handleRemoveMeal = (index) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals);
  };

  const handleActivityChange = (index, field, value) => {
    const updatedActivities = [...activities];
    updatedActivities[index][field] = value;
    setActivities(updatedActivities);
  };

  const handleAddActivity = () => {
    setActivities([...activities, {
      heading: '',
      time: '',
      description: '',
      images: [],
      nightStayIncluded: false
    }]);
  };

  const handleRemoveActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
  };

  const handleImageUpload = (array, setArray, index, files) => {
    const updatedItems = [...array];
    updatedItems[index].images = [...updatedItems[index].images, ...files];
    setArray(updatedItems);
  };

  const handleRemoveImage = (array, setArray, itemIndex, imageIndex) => {
    const updatedItems = [...array];
    updatedItems[itemIndex].images = updatedItems[itemIndex].images.filter((_, i) => i !== imageIndex);
    setArray(updatedItems);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    console.log('Starting form submission...');
    const formData = new FormData();    
    formData.append('day', '1'); 
    formData.append('description', description); 
    formData.append('night_stay_included', nightStayIncluded);

    
    // Prepare and send places as JSON array
    const placesData = places
      .filter(place => place.name.trim() || place.description.trim())
      .map(place => ({
        name: place.name,
        description: place.description
      }));
    formData.append('places', JSON.stringify(placesData));
    
    // Prepare and send stays as JSON array - corrected structure
    const staysData = stays
      .filter(stay => stay.resortName.trim() || stay.location.trim())
      .map(stay => ({
        hotel_name: stay.resortName,  // Changed from resort_name to hotel_name
        description: '',  // Add description if needed
        location: stay.location,
        is_ac: stay.roomTypes.some(room => room.type.includes('AC')), // Convert to boolean
        has_breakfast: stay.roomTypes.some(room => room.breakfastIncluded) // Convert to boolean
      }));
    formData.append('stay', JSON.stringify(staysData));
    
    // Prepare and send meals as JSON array - corrected structure
    const mealsData = meals
      .filter(meal => meal.mealType.trim() || meal.restaurantName.trim())
      .map(meal => ({
        type: meal.mealType,
        description: meal.description,
        restaurant_name: meal.restaurantName,
        time: meal.mealTime,
        location: meal.location,
        included: meal.included
      }));
    formData.append('meal', JSON.stringify(mealsData));
    
    // Prepare and send activities as JSON array - corrected structure
    const activitiesData = activities
      .filter(activity => activity.heading.trim() || activity.description.trim())
      .map(activity => ({
        name: activity.heading,  
        description: activity.description,
        time: activity.time,
        night_stay_included: activity.nightStayIncluded
      }));
    formData.append('activity', JSON.stringify(activitiesData));
    
    // Add all images with indexed keys
    places.forEach((place, placeIndex) => {
      place.images.forEach((image, imgIndex) => {
        if (typeof image !== 'string') {
          formData.append(`place_image_${placeIndex}_${imgIndex}`, image);
        }
      });
    });

    stays.forEach((stay, stayIndex) => {
      stay.images.forEach((image, imgIndex) => {
        if (typeof image !== 'string') {
          formData.append(`stay_image_${stayIndex}_${imgIndex}`, image);
        }
      });
    });

    meals.forEach((meal, mealIndex) => {
      meal.images.forEach((image, imgIndex) => {
        if (typeof image !== 'string') {
          formData.append(`meal_image_${mealIndex}_${imgIndex}`, image);
        }
      });
    });

    activities.forEach((activity, activityIndex) => {
      activity.images.forEach((image, imgIndex) => {
        if (typeof image !== 'string') {
          formData.append(`activity_image_${activityIndex}_${imgIndex}`, image);
        }
      });
    });

    // Add vendor ID and package ID
    formData.append('vendor_id', vendorId);
    formData.append('package_id', packageId);

    // Log final FormData entries for debugging
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, value.name);
      } else {
        console.log(key, value);
      }
    }

    // Call the API
    const response = await addDayPlans(formData, packageId);
    
    if (response.success) {
      console.log('Day plan added successfully:', response);
      onClose();
    } else {
      console.error('Failed to add day plan:', response.message);
      // Show error message to the user
    }
  } catch (error) {
    console.error('Error adding day plan:', error);
    // Handle error (show error message, etc.)
  }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Add Package Day</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Places Section */}
              <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                rows="3"
              />
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Places to Visit</h3>
               <div className="flex items-center">
                <input
                  type="checkbox"
                  id="night-stay-included"
                  checked={nightStayIncluded}
                  onChange={(e) => setNightStayIncluded(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="night-stay-included" className="ml-2 block text-sm font-medium text-gray-700">
                  Night stay included for this day
                </label>
              </div>
              {places.map((place, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Place {index + 1}</h4>
                    {places.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePlace(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Place Name</label>
                      <input
                        type="text"
                        value={place.name}
                        onChange={(e) => handlePlaceChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={place.description}
                        onChange={(e) => handlePlaceChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows="3"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleImageUpload(places, setPlaces, index, e.target.files)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {place.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img 
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
                            alt={`Place ${index + 1}`} 
                            className="h-20 w-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(places, setPlaces, index, imgIndex)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddPlace}
                className="mt-2 flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Place
              </button>
            </div>

            {/* Stay Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Stay Details</h3>
              
              {stays.map((stay, stayIndex) => (
                <div key={stayIndex} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Stay {stayIndex + 1}</h4>
                    {stays.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStay(stayIndex)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resort Name</label>
                      <input
                        type="text"
                        value={stay.resortName}
                        onChange={(e) => handleStayChange(stayIndex, 'resortName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={stay.location}
                        onChange={(e) => handleStayChange(stayIndex, 'location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resort Images</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleImageUpload(stays, setStays, stayIndex, e.target.files)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stay.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img 
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
                            alt={`Stay ${stayIndex + 1}`} 
                            className="h-20 w-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(stays, setStays, stayIndex, imgIndex)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Room Types</h5>
                    
                    {stay.roomTypes.map((room, roomIndex) => (
                      <div key={roomIndex} className="mb-3 p-3 bg-white rounded border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={room.type}
                              onChange={(e) => handleRoomTypeChange(stayIndex, roomIndex, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <option value="AC">AC</option>
                              <option value="Non-AC">Non-AC</option>
                              <option value="Deluxe">Deluxe</option>
                              <option value="Suite">Suite</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`breakfast-${stayIndex}-${roomIndex}`}
                              checked={room.breakfastIncluded}
                              onChange={(e) => handleRoomTypeChange(stayIndex, roomIndex, 'breakfastIncluded', e.target.checked)}
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`breakfast-${stayIndex}-${roomIndex}`} className="ml-2 block text-sm text-gray-700">
                              Breakfast Included
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddStay}
                className="mt-2 flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Stay Option
              </button>
            </div>

            {/* Meals Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Meal Details</h3>
              
              {meals.map((meal, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Meal {index + 1}</h4>
                    {meals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMeal(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                      <select
                        value={meal.mealType}
                        onChange={(e) => handleMealChange(index, 'mealType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      >
                        <option value="">Select Meal Type</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        value={meal.restaurantName}
                        onChange={(e) => handleMealChange(index, 'restaurantName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meal Time</label>
                      <input
                        type="time"
                        value={meal.mealTime}
                        onChange={(e) => handleMealChange(index, 'mealTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={meal.location}
                        onChange={(e) => handleMealChange(index, 'location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meal Description</label>
                    <textarea
                      value={meal.description}
                      onChange={(e) => handleMealChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows="3"
                      required
                    />
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id={`meal-included-${index}`}
                      checked={meal.included}
                      onChange={(e) => handleMealChange(index, 'included', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`meal-included-${index}`} className="ml-2 block text-sm text-gray-700">
                      This meal is included in the package
                    </label>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meal Images</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleImageUpload(meals, setMeals, index, e.target.files)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {meal.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img 
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
                            alt={`Meal ${index + 1}`} 
                            className="h-20 w-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(meals, setMeals, index, imgIndex)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddMeal}
                className="mt-2 flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Meal
              </button>
            </div>

            {/* Activities Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Activities</h3>
              
              {activities.map((activity, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Activity {index + 1}</h4>
                    {activities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                      <input
                        type="text"
                        value={activity.heading}
                        onChange={(e) => handleActivityChange(index, 'heading', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={activity.time}
                        onChange={(e) => handleActivityChange(index, 'time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={activity.description}
                      onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows="3"
                      required
                    />
                  </div>
                  
                
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Images</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleImageUpload(activities, setActivities, index, e.target.files)}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activity.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img 
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
                            alt={`Activity ${index + 1}`} 
                            className="h-20 w-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(activities, setActivities, index, imgIndex)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddActivity}
                className="mt-2 flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Activity
              </button>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red -500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPackageDay; 
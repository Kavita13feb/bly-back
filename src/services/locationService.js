const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;  // Move this to environment variables in production


const fetchLocations=async (locationQuery)=>{
    console.log("locationQuery",locationQuery)
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${locationQuery}&key=${GOOGLE_API_KEY}`
    );
    // console.log(response.data.predictions)
    return response.data.predictions
    // res.json(response.data.predictions);  // Send back only the 'predictions' array
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch location suggestions' });
  }
};

// Endpoint for place details

const fetchLocationDetails = async (placeId) => {
  if (!placeId) {
    throw new Error("placeId is required");
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

    const response = await axios.get(url);
    const result = response.data.result;

    if (response.data.status !== "OK") {
      throw new Error("Failed to fetch location details from Google API");
    }

    const locationDetails = {
      placeId: result.place_id,
      formattedAddress: result.formatted_address,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      country: result.address_components.find(c => c.types.includes("country"))?.long_name || "",
      countryCode: result.address_components.find(c => c.types.includes("country"))?.short_name || "",
      state: result.address_components.find(c => c.types.includes("administrative_area_level_1"))?.long_name || "",
      stateCode: result.address_components.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "",
      city: result.address_components.find(c => c.types.includes("locality"))?.long_name || "",
      geoPoint: {
        type: "Point",
        coordinates: [result.geometry.location.lng, result.geometry.location.lat]
      }
    };
    console.log("locationDetails",locationDetails)
    return locationDetails;
  } catch (error) {
    console.error("Error fetching location details:", error.message);
    throw new Error("Error fetching location details");
  }
};


module.exports = { fetchLocations,fetchLocationDetails };

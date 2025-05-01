const transformRouteResponse = (googleResponse) => {
  if (!googleResponse.routes || googleResponse.routes.length === 0) {
    throw new Error('No routes found');
  }

  const route = googleResponse.routes[0];
  
  return {
    status: "OK",
    routes: [{
      legs: [{
        distance: {
          text: `${Math.round(route.distanceMeters / 1000)} km`,
          value: route.distanceMeters
        },
        duration: {
          text: `${Math.round(parseInt(route.duration.replace('s', '')) / 60)} mins`,
          value: parseInt(route.duration.replace('s', ''))
        },
        start_location: route.legs[0].startLocation.latLng,
        end_location: route.legs[0].endLocation.latLng
      }],
      overview_polyline: {
        points: route.polyline.encodedPolyline
      }
    }]
  };
};

const validateRouteRequest = (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }
}; 

export { transformRouteResponse, validateRouteRequest };

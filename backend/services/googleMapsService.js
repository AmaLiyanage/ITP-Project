import axios from 'axios';
import { CONFIG } from "../config/config.js";

class GoogleMapsService {
  static async getDirections(origin, destination) {
    const response = await axios.post(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        origin: { address: origin },
        destination: { address: destination },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        languageCode: CONFIG.googleMaps.language,
        regionCode: CONFIG.googleMaps.region,
        units: "METRIC"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': CONFIG.googleMaps.apiKey,
          'X-Goog-FieldMask': [
            'routes.duration',
            'routes.distanceMeters',
            'routes.polyline.encodedPolyline',
            'routes.legs.startLocation',
            'routes.legs.endLocation'
          ].join(',')
        }
      }
    );

    return response.data;
  }
}

export { GoogleMapsService };

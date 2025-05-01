// config.js
import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  port: process.env.PORT || 5000,
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyAuLD73WwnMh2lh0T3350kSbRdyAjBAlv0",
    defaultCenter: { lat: 7.8731, lng: 80.7718 },
    region: "LK",
    language: "en-US"
  }
};

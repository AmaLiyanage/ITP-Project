export const decodePolyline = (encoded) => {
    const poly = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
  
    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
  
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
  
      poly.push({
        lat: lat * 1e-5,
        lng: lng * 1e-5
      });
    }
    return poly;
  };
  
  export const formatDuration = (seconds) => {
    const totalMinutes = Math.round(seconds / 60);
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}${remainingMinutes > 0 ? ` ${remainingMinutes} mins` : ''}`;
    }
    return `${totalMinutes} mins`;
  }; 
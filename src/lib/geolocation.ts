export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Wraps the browser Geolocation API in a Promise.
 *
 * Not documented anywhere in the Postman collection — the check-in/check-out
 * requests there carry no location fields at all. Discovered from the live
 * API rejecting a location-less check-in with "Your current location is
 * required." Field names (`latitude`/`longitude`) are a best guess pending
 * a saved response/request example from the backend team.
 */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(
        new Error(
          "Your browser doesn't support location access, which is required to check in/out."
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new Error(
              "Location access was denied. Please allow location access in your browser settings to check in/out."
            )
          );
        } else if (error.code === error.TIMEOUT) {
          reject(new Error("Getting your location timed out. Please try again."));
        } else {
          reject(new Error("Couldn't determine your current location. Please try again."));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

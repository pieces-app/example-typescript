import { useState, useEffect } from 'react';

function isQuotaExceededError(err: unknown): boolean {
    return (
      err instanceof DOMException &&
      // for everything except Firefox
      (err.code === 22 ||
        // for Firefox
        err.code === 1014 ||
        // testing name field too, because code might not be present
        // for everything except Firefox
        err.name === "QuotaExceededError" ||
        // for Firefox
        err.name === "NS_ERROR_DOM_QUOTA_REACHED")
    );
  }

export const useOsVersion = () => {
  const [osVersion, setOsVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try-catch block to handle potential localStorage errors
    try {
      const storedVersion = localStorage.getItem("version");
      setOsVersion(storedVersion);
    } catch (err) {
        console.log(err);
      setError("Error retrieving OS version from localStorage");
    }
  }, []);

  // Function to update the stored version
  const updateOsVersion = (newVersion: string) => {
    try {
      localStorage.setItem("version", newVersion);
      setOsVersion(newVersion);
    } catch (err) {
        console.log(err);
        if (isQuotaExceededError(err)) {
            // Case where there wasn't enough space to store the item in localStorage.
            setError("Not enough space in localStorage");
            
            // Can use different storage mechanism (in-memory, a remote db, etc.) 
          } else {
            // Case where the localStorage API is not supported.
            setError("Error updating OS version in localStorage.");
          }
        
    }
  };

  return {osVersion, updateOsVersion, error}; // Returning state, update function, and error
}
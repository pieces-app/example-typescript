import { SensitivesApi } from "@pieces.app/pieces-os-client";

// Initialize the API (you can configure this with your specific settings)
const config = {
  apiKey: 'YOUR_API_KEY', // Add your API key here
  baseUrl: 'https://api.pieces.app', // Base URL for the API
};

const sensitiveApi = new SensitivesApi(config);

type SensitiveData = {
  keyName: string;
  keyValue: string;
};

// Function to handle adding a secret key
export const addSecretKey = async (secret: SensitiveData) => {
  try {
    const response = await sensitiveApi.createSensitive({
      key: secret.keyName,
      value: secret.keyValue,
    });
    console.log('Secret added successfully:', response);
  } catch (error) {
    console.error('Error adding secret:', error);
  }
};

// Function to retrieve secret keys
export const getSecretKey = async (keyName: string) => {
  try {
    const response = await sensitiveApi.getSensitive({
      key: keyName,
    });
    return response?.value;
  } catch (error) {
    console.error('Error retrieving secret:', error);
  }
};

// Payment gateway configuration
export const PAYMENT_CONFIG = {
  stripe: {
    publishableKey: "pk_live_51ICySmAHvrQDkxrmlRqEHodHq1XgkrI46hmhLkeE7GZXalKFHjNWVpBecsXc5ZsMiFcmh82KpaBpJVkWhRyP1X5j00drzWtOt4",
  },
  paypal: {
    clientId: "AdbVjjZfvOJHfzKXhLiBqpdV8iEdD9XkhKe4jHU1UaJuJgyJQytHbnWnfmBPrLNQ4GfB9rwBphdjjTyy",
    // Use sandbox for testing: "https://api-m.sandbox.paypal.com"
    // Use live for production: "https://api-m.paypal.com"
    apiUrl: "https://api-m.paypal.com", // Using live environment
  },
} as const;
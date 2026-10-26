const API_BASE = "http://localhost:3333/api";

// Generic fetch function dengan error handling
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Product API functions
export const productAPI = {
  getProducts: () => apiRequest("/products"),

  getProduct: (id) => apiRequest(`/products/${id}`),

  createProduct: (productData) =>
    apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  updateProduct: (id, productData) =>
    apiRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  deleteProduct: (id) =>
    apiRequest(`/products/${id}`, {
      method: "DELETE",
    }),
};

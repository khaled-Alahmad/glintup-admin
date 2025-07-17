import { deleteCookie, getCookie as getClientCookie } from "cookies-next";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_URL;

// Helper function to completely remove token cookie
const clearTokenCookie = () => {
  if (typeof window !== 'undefined') {
    try {
      // Multiple attempts to ensure cookie is deleted
      const cookieOptions = [
        { path: "/" },
        { path: "/", domain: window.location.hostname },
        { path: "/", domain: `.${window.location.hostname}` },
        { path: "/", domain: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname }
      ];
      
      cookieOptions.forEach(options => {
        try {
          deleteCookie("token", options);
        } catch (e) {
          console.warn("Failed to delete cookie with options:", options, e);
        }
      });
      
      // Fallback: manually expire the cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      
    } catch (error) {
      console.error("Error clearing token cookie:", error);
    }
  }
};

// function isTokenValid(token) {
//   if (!token) return false;
//   try {
//     const decodedToken = JSON.parse(atob(token));
//     return decodedToken.exp && decodedToken.exp > Date.now();
//   } catch (error) {
//     return false;
//   }
// }

async function apiRequest(endpoint, method = "GET", data = null, filters = {}, customHeaders = {}) {
  try {
    let token;

    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || null;
    } else {
      token = getClientCookie("token");
    }

    // Check token validity
    // if (token && !isTokenValid(token)) {
    //   handleLogout();
    //   throw new Error("Invalid or expired token");
    // }

    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      ...customHeaders,
    };

    const url = new URL(`${API_BASE_URL}/${endpoint}`);

    if (method === "GET" && filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const options = {
      method,
      headers,
    };

    if (data) {
      if (data instanceof FormData) {
        options.body = data;
      } else {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
      }
    }

    if (process.env.NEXT_PUBLIC_ENV !== "production") {
      // console.log(`Request: ${method} ${url}`);
      // console.log("Options:", options);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => ({
        message: `Error: ${response.statusText}`,
      }));
      console.error("API Error Response:", errorResponse);
      if (response?.status === 401 && token) {

        handleLogout(); // Call logout on 401 errors
      }
      throw new Error(errorResponse.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error.message);
    throw error;
  }
}

async function axiosRequest(endpoint, method = "GET", data = null, headers = {}) {
  try {
    let token = null;
    
    if (typeof window !== "undefined") {
      token = getClientCookie("token");
    }
    
    const config = {
      method,
      url: `${API_BASE_URL}/${endpoint}`,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Accept-Language": "ar",
        ...headers,
      },
    };

    if (data) {
      if (data instanceof FormData) {
        config.data = data;
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.data = data;
        config.headers["Content-Type"] = "application/json";
      }
    }

    if (process.env.NEXT_PUBLIC_ENV !== "production") {
      console.log(`Axios Request: ${method} ${config.url}`);
      console.log("Config:", config);
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
    console.error("Axios Request Error:", errorMessage);

    throw new Error(errorMessage);
  }
}
// Centralized logout function
export const handleLogout = () => {
  // Only execute client-side code
  if (typeof window !== 'undefined') {
    try {
      // Use the helper function to thoroughly clear the token cookie
      clearTokenCookie();
      
      // Clear all localStorage items
      localStorage.removeItem('userPermissions');
      localStorage.removeItem('cachedToken');
      
      // Clear all localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      
      console.log("Logged out, all storage data cleared");
      
      // Use location.replace for better security (prevents back button from restoring session)
      window.location.replace("/auth/login");
      
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback: force redirect even if cleanup fails
      window.location.replace("/auth/login");
    }
  }
  // Server-side execution does nothing
};
export async function fetchData(endpoint, filters = {}) {
  return await apiRequest(endpoint, "GET", null, filters);
}

export async function addData(endpoint, data, headers = {}, useAxios = false) {
  if (useAxios && typeof window !== "undefined") {
    return await axiosRequest(endpoint, "POST", data, headers);
  }
  return await apiRequest(endpoint, "POST", data, {}, headers);
}

export async function updateData(endpoint, data, useAxios = false) {
  if (useAxios && typeof window !== "undefined") {
    return await axiosRequest(endpoint, "PUT", data);
  }
  return await apiRequest(endpoint, "PUT", data);
}

export async function deleteData(endpoint, useAxios = false) {
  if (useAxios && typeof window !== "undefined") {
    return await axiosRequest(endpoint, "DELETE");
  }
  return await apiRequest(endpoint, "DELETE");
}

// Function to refresh user permissions
export const refreshUserPermissions = () => {
  if (typeof window !== 'undefined') {
    // Dispatch an event to refresh permissions
    const refreshEvent = new Event('refreshPermissions');
    window.dispatchEvent(refreshEvent);
    console.log('Refreshing user permissions');
  }
};

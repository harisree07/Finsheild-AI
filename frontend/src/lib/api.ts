const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class APIError extends Error {
  status: number;
  info: any;

  constructor(message: string, status: number, info?: any) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.info = info;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;

  // Build query string if any
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Setup default headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add auth token if stored locally
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("finshield_token");
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const mergedHeaders = { ...defaultHeaders, ...headers };

  const config: RequestInit = {
    ...restOptions,
    headers: mergedHeaders,
  };

  try {
    const response = await fetch(url, config);

    let data: any = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMsg = data?.detail || `API request failed with status ${response.status}`;
      throw new APIError(errorMsg, response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error instanceof Error ? error.message : "Network request failed", 500);
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: "GET" }),
    
  post: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { 
      ...options, 
      method: "POST", 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  put: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { 
      ...options, 
      method: "PUT", 
      body: body ? JSON.stringify(body) : undefined 
    }),
    
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

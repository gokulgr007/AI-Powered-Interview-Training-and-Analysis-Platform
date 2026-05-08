import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status} ${text}`);
  }
}

export async function apiRequest(method, url, data) {
  let reqUrl = url;
  if (typeof reqUrl === "string" && !reqUrl.startsWith("/") && !reqUrl.startsWith("http")) {
    reqUrl = "/" + reqUrl;
  }

  const res = await fetch(reqUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export const getQueryFn = ({ on401 }) => async ({ queryKey }) => {
  let path = Array.isArray(queryKey) ? queryKey.join("/") : String(queryKey);
  if (!path.startsWith("/") && !path.startsWith("http")) {
    path = "/" + path;
  }

  const res = await fetch(path, {
    credentials: "include",
  });

  if (on401 === "returnNull" && res.status === 401) {
    return null;
  }

  await throwIfResNotOk(res);
  return await res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});



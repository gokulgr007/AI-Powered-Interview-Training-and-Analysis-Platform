import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useToast } from "./use-toast";

// Fetch current user
export function useUser() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(api.auth.me.path, { headers });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      const user = await res.json();
      // normalize atsScore to 0 when null/undefined for consistent client UI
      try {
        if (user && (user.atsScore === null || typeof user.atsScore === 'undefined')) {
          user.atsScore = 0;
        }
        // cache normalized user locally for quick reads
        try { localStorage.setItem('user', JSON.stringify(user)); } catch (e) {}
      } catch (e) {}
      return user;
    },
    retry: false,
  });
}

// Login
export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const payload = {
        email: data.email || data.username,
        password: data.password,
      };

      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
        if (!res.ok) {
          let msg = `${res.status} ${res.statusText}`;
          let body = null;
          try {
            body = await res.json();
            if (body && body.message) msg = body.message;
          } catch (e) {}
          throw { status: res.status, message: msg, body };
        }

        return await res.json();
    },
    onSuccess: (data) => {
      const { token, user } = data || {};
      if (user) {
        // normalize atsScore before caching
        if (user.atsScore === null || typeof user.atsScore === 'undefined') user.atsScore = 0;
        queryClient.setQueryData([api.auth.me.path], user);
      }
      if (token) {
        try {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          // ensure top-level hrConfidence key reflects authenticated user's value
          try {
            const hr = (user && typeof user.hrConfidence !== 'undefined' && user.hrConfidence !== null) ? Number(user.hrConfidence) : 0;
            localStorage.setItem('hrConfidence', String(hr));
          } catch (e) {}
          // ensure completedModules exists for new users
          try {
            if (localStorage.getItem('completedModules') === null) localStorage.setItem('completedModules', '0');
          } catch (e) {}
        } catch (e) {}
      }

      toast({
        title: "Welcome back!",
        description: `Signed in as ${user?.email || "user"}`,
      });
    },
    onError: (error) => {
      const message = (error && error.status === 400) || (error && /invalid credentials/i.test(error.message || ''))
        ? 'Wrong email or password'
        : (error && error.message) || 'Login failed';
      toast({
        variant: "destructive",
        title: "Login failed",
        description: message,
      });
    },
  });
}

// Register
export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const payload = {
        name: data.fullName || data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        experienceLevel: data.experienceLevel,
      };

      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = `${res.status} ${res.statusText}`;
        let body = null;
        try {
          body = await res.json();
          if (body && body.message) msg = body.message;
        } catch (e) {}
        throw { status: res.status, message: msg, body };
      }
      return await res.json();
    },
    onSuccess: (data) => {
      const { token, user } = data || {};
      if (user) {
        if (user.atsScore === null || typeof user.atsScore === 'undefined') user.atsScore = 0;
        queryClient.setQueryData([api.auth.me.path], user);
      }
      if (token) {
        try {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          // ensure top-level hrConfidence key reflects authenticated user's value
          try {
            const hr = (user && typeof user.hrConfidence !== 'undefined' && user.hrConfidence !== null) ? Number(user.hrConfidence) : 0;
            localStorage.setItem('hrConfidence', String(hr));
          } catch (e) {}
        } catch (e) {}
      }
      toast({
        title: "Account created!",
        description: "Welcome to Interview Prep AI.",
      });
    },
    onError: (error) => {
      const message = (error && error.status === 409) || (error && /already exists/i.test(error.message || ''))
        ? 'Email already exists'
        : (error && error.message) || 'Registration failed';
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: message,
      });
    },
  });
}

// Logout
export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, {
        method: api.auth.logout.method,
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      toast({
        title: "Logged out",
        description: "See you next time!",
      });
    },
  });
}




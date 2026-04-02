import { fetchBackend } from "./fetcher";

export type ApiResult = {
  success: boolean;
  message?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
};

export async function register(payload: RegisterPayload): Promise<ApiResult> {
  return fetchBackend<ApiResult>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload): Promise<ApiResult> {
  return fetchBackend<ApiResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshSession(): Promise<ApiResult> {
  return fetchBackend<ApiResult>("/auth/refresh", {
    method: "POST",
  });
}

export async function logout(): Promise<ApiResult> {
  return fetchBackend<ApiResult>("/auth/logout", {
    method: "POST",
  });
}

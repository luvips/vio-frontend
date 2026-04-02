const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX ?? "/api/v1";
const normalizedBase = rawApiBaseUrl.replace(/\/$/, "");
const normalizedPrefix = apiPrefix.startsWith("/") ? apiPrefix : `/${apiPrefix}`;
const hasPrefixAlready = normalizedBase.endsWith(normalizedPrefix);

export const API_BASE_URL = hasPrefixAlready ? normalizedBase : `${normalizedBase}${normalizedPrefix}`;

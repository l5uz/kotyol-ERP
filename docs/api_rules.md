# API Rules & HTTP Client Standards - Kotyol ERP

## 1. Direct Axios Prohibition
**Never import or execute `axios` directly inside UI components or React pages.**
All network traffic must pass through `@/api/axiosInstance` or domain feature API modules (e.g., `@/features/warehouse/api/warehouseApi.js`).

## 2. Token Injection & Auth Interceptors
The configured instance in `src/api/axiosInstance.js` automatically performs:
1. **Request Interceptor**: Extracts the `accessToken` from `tokenService` and attaches `Authorization: Bearer <token>` to headers.
2. **Response Interceptor (401 Unauthorized)**:
   - Traps expired access token errors.
   - Triggers token refresh flow using `refreshToken`.
   - Queues pending HTTP requests while refresh is in progress.
   - Retries original requests upon successful token refresh.
   - Logs user out if token refresh fails.

## 3. Endpoints Registry (`src/api/endpoints.js`)
All API endpoints must be declared in a centralized object map. Hardcoded URI strings inside API functions are strictly prohibited.

Example:
```javascript
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  WAREHOUSE: {
    STOCK_LIST: '/warehouse/stocks',
    ITEM_DETAILS: (id) => `/warehouse/stocks/${id}`,
  },
};
```

## 4. Standard Response & Error Format
Backend responses should be normalized into a standard shape:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 150
  }
}
```
In case of an error:
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Available stock quantity is insufficient for requested order."
  }
}
```

import apiClient from "./apiClient";
import { setAccessToken } from "../../auth/tokenStore";

test("adds the current access token to API requests", async () => {
    setAccessToken("test-access-token");
    const request = { headers: {} };
    const interceptor = apiClient.interceptors.request.handlers[0].fulfilled;

    expect(interceptor(request).headers.Authorization).toBe("Bearer test-access-token");

    setAccessToken(null);
});
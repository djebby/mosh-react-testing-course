import { http, HttpResponse, delay } from "msw";
import { server } from '../mocks/server';
import { useAuth0, User } from "@auth0/auth0-react";

export const simulateDelay = (endpoint: string) => {
  server.use(http.get(endpoint, async () => {
    await delay();
    return HttpResponse.json([]);
  }));
};


export const simulateError = (endpoint: string) => {
  server.use(
    http.get(endpoint, () => HttpResponse.error()),
  );
};

type AuthState = {
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const mockAuthState = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue('random-text'),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
  });
}

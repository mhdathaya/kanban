export interface User {
  id: number | string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
  name?: string;
  avatar?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface DummyJsonAuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
  token?: string;                           
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthInfo {
  userId: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user: AuthInfo;
}

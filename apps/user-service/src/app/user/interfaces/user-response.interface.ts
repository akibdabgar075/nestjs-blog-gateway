export interface CreateUserResponse {
  message: string;
  data: {
    id: number;
    username: string;
    email: string;
    bio: string;
  };
}

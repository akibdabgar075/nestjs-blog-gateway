export class UserMapper {
  static toAuthResponse(token: string) {
    return {
      message: 'Login successfully',
      data: token,
    };
  }
}

import { jwtModule } from './jwt-module';

describe('jwtModule', () => {
  it('should work', () => {
    expect(jwtModule()).toEqual('Jwt-Module');
  });
});

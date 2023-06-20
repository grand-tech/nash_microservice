import { PreAuthMiddleware } from './pre-auth.middleware';

describe('PreAuthMiddleware', () => {
  it('should be defined', () => {
    expect(new PreAuthMiddleware()).toBeDefined();
  });
});

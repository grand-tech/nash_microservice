import { User, nodeToUser } from './user';

describe('Users', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });
});

describe('Node to users', () => {
  it('Should replicate fields on User object.', () => {
    const userNode = {
      labels: ['User', 'Customer'],
      properties: {
        name: 'John Doe',
        feduid: '1234567890',
        idNumber: '1234567',
        publicAddress: '12345678',
        phoneNumber: '+254712345678',
      },
    };

    const user = nodeToUser(userNode);

    // Assertions.
    expect(user).toBeDefined();
    expect(user.feduid).toBe('1234567890');
    expect(user.name).toBe('John Doe');
    expect(user.idNumber).toBe('1234567');
    expect(user.publicAddress).toBe('12345678');
    expect(user.phoneNumber).toBe('+254712345678');
    expect(user.labels).toEqual(['User', 'Customer']);
  });
});

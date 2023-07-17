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
        phoneNumber: '+254712345678',
        privateKey: 'privateKey',
        publicKey: 'publicKey',
        publicAddress: 'publicAddress',
        mnemonic: 'mnemonic',
      },
      identity: {
        low: 10,
        high: 0,
      },
    };

    const user = nodeToUser(userNode);

    // Assertions.
    expect(user).toBeDefined();
    expect(user.id).toBe(10);
    expect(user.feduid).toBe('1234567890');
    expect(user.name).toBe('John Doe');
    expect(user.idNumber).toBe('1234567');
    expect(user.phoneNumber).toBe('+254712345678');
    expect(user.privateKey).toBe('privateKey');
    expect(user.publicAddress).toBe('publicAddress');
    expect(user.publicKey).toBe('publicKey');
    expect(user.mnemonic).toBe('mnemonic');
    expect(user.labels).toEqual(['User', 'Customer']);
  });
});

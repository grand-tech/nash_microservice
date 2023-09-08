import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseMessagingUtils } from './firebase-fcm.service';

describe('FirebaseMessagingUtils', () => {
  let service: FirebaseMessagingUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseMessagingUtils],
    }).compile();

    service = module.get<FirebaseMessagingUtils>(FirebaseMessagingUtils);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send notification', async () => {
    const message = {
      notification: {
        title: 'Test',
        body: 'Test',
      },
      data: {},
      token: 'test',
    };
    const sendNotification = await service.sendNotification(
      message.token,
      message.notification.title,
      message.notification.body,
      message.data,
    );
    expect(sendNotification).toBeDefined();
  });

  it('should send notification to topic', async () => {
    const message = {
      notification: {
        title: 'Test',
        body: 'Test',
      },
      data: {},
    };
    const sendNotificationToTopic = await service.sendNotificationToTopic(
      'test',
      message.notification.title,
      message.notification.body,
      message.data,
    );
    expect(sendNotificationToTopic).toBeDefined();
  });
  it('should subscribe to topic to topic', () => {
    const subscribeToTopic = service.subscribeToTopic('test', 'test');
    expect(subscribeToTopic).toBeDefined();
  });
  it('should unsubscribe from topic', () => {
    const unsubscribeFromTopic = service.unsubscribeFromTopic('test', 'test');
    expect(unsubscribeFromTopic).toBeDefined();
  });
  it('should send notification to multiple devices', () => {
    const message = {
      notification: {
        title: 'Test',
        body: 'Test',
      },
      data: {},
    };
    const sendNotificationToMultipleDevices = service.sendMulticast(
      ['test'],
      message.notification.title,
      message.notification.body,
      message.data,
    );
    expect(sendNotificationToMultipleDevices).toBeDefined();
  });
});

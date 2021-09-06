import { Stan } from 'node-nats-streaming';
import { Subjects } from '../subjects';

interface Event {
  subject: Subjects;
  data: any;
}
export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];

  constructor(protected client: Stan) {}

  publish(data: T['data']): Promise<void> {
    //publish in NATS is asynchronus operation
    //so we should return Promise so client can wait if needed so
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), err => {
        if (err) {
          return reject(err);
        }
        let timestamp = new Date().toISOString();
        console.log(`${timestamp}-Event published to subject ${this.subject}`);
        resolve();
      });
    });
  }
}

import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@faysaltickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

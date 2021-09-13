import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@faysaltickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@faysaltickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

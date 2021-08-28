import { OrderCreatedEvent, Publisher, Subjects } from '@faysaltickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

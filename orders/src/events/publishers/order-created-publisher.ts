import { OrderCreatedEvent, Publisher, Subjects } from '@ticketing-sn/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

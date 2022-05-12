import { OrderCancelledEvent, Publisher, Subjects } from '@ticketing-sn/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketing-sn/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

import { Publisher, Subjects, TicketCreatedEvent } from '@ticketing-sn/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

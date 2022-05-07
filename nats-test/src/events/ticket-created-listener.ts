import { Subjects, TicketCreatedEvent } from '@ticketing-sn/common';
import nats from 'node-nats-streaming';

import { Listener } from '../../../common/src/events/base-listener';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: nats.Message): void {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}

import { Listener, OrderCreatedEvent, Subjects } from '@ticketing-sn/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // Throw error if ticket not found
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark ticket reserved with orderId
    ticket.set({ orderId: data.id });

    // save the updated ticket
    await ticket.save();

    // acknowledge message
    msg.ack();
  }
}

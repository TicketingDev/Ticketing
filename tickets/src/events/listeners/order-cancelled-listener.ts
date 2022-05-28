import { Listener, OrderCancelledEvent, Subjects } from '@ticketing-sn/common';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // Throw error if ticket not found
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark ticket reserved with orderId
    ticket.set({ orderId: undefined });

    // save the updated ticket
    await ticket.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    });

    // acknowledge message
    msg.ack();
  }
}

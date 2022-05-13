import mongoose from 'mongoose';

import { Ticket } from '../ticket';

/**
 * Create an instance of ticket
 * Save the ticket twice
 * Make two separate changes of the ticket
 * Save the ticket with first changes
 * Save the ticket with second changes and expect an error
 */
it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
    throw new Error('Should not reach here');
  } catch (error) {
    expect(error).toBeInstanceOf(mongoose.Error.VersionError);
  }
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

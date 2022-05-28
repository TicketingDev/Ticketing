import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sadaada',
      price: 20
    })
    .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sadaada',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd',
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'updated title',
      price: 1000
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Concert Name',
      price: -1
    })
    .expect(400);
});

it('rejects updating a ticket when it is reserved', async () => {
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      price: 20
    });

  // make a ticket reserved by setting order id
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Updated Concert Name',
      price: 100
    })
    .expect(400);
});

it('update the ticket with valid inputs', async () => {
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Updated Concert Name',
      price: 100
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send();

  expect(ticketResponse.body.title).toEqual('Updated Concert Name');
  expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Updated Concert Name',
      price: 100
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

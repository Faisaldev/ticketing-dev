import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetch the order', async () => {
  // create the ticket
  const ticket = Ticket.build({
    title: 'matches',
    price: 100,
  });
  await ticket.save();

  const cookie = signin();
  //create the order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  //fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('return an error if order not belong to user', async () => {
  // create the ticket
  const ticket = Ticket.build({
    title: 'matches',
    price: 100,
  });
  await ticket.save();

  const cookie = signin();
  //create the order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  //fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signin())
    .send()
    .expect(401);
});

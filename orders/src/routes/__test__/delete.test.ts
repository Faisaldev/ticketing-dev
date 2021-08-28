import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('return 204 and mark order as cancelled', async () => {
  const ticket = Ticket.build({
    title: 'cricket',
    price: 30,
  });
  await ticket.save();

  const cookie = signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an event on order delete', async () => {
  const ticket = Ticket.build({
    title: 'cricket',
    price: 30,
  });
  await ticket.save();

  const cookie = signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

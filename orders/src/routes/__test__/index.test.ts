import { Ticket } from '../../models/ticket';
import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
  const ticket = Ticket.build({
    title: 'cricket',
    price: 30,
  });

  await ticket.save();

  return ticket;
};

it('fetches orders for particular user', async () => {
  //create 3 tickets
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();

  const userOne = signin();
  const userTwo = signin();
  // create one order for user 1

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // create two orders for user 2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  //fetch orders for user 2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send()
    .expect(200);

  //Make sure orders belong to user 2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
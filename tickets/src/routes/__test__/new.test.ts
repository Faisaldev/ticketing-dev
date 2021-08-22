import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('the tickets route handler exist for tickets post /api/tickets', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('user if not signed recieve 401', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('user must signed in not to recieve 401', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', signin()).send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if title is missing', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if price is missing', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'A',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'B',
    })
    .expect(400);
});
it('create ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'TTT';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
  const title = 'TTT';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

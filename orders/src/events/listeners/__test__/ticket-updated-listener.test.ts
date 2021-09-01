import { TicketUpdatedEvent } from '@faysaltickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Infinity Wars',
    price: 99,
  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    price: 199,
    title: 'End Game',
    userId: 'abdskjdlf',
    version: ticket.version + 1,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { ticket, data, listener, msg };
};

it('create, find and updates the ticket', async () => {
  const { data, listener, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket!.id).toEqual(data.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('ack has not been called if message out of order', async () => {
  const { data, listener, msg } = await setup();

  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});

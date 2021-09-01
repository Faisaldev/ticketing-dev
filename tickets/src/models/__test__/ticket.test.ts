import { Ticket } from '../ticket';

it('validate the optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'cricket',
    price: 10,
    userId: '123',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 15 });
  secondInstance!.set({ price: 20 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error('should not reach here');
});

it('increments the version number correctly', async () => {
  const ticket = Ticket.build({
    title: 'cricket',
    price: 10,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

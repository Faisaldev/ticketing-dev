import { randomBytes } from 'crypto';
export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: randomBytes(8).toString('hex') }),
  },
};

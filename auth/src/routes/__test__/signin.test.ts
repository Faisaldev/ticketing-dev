import request from 'supertest';
import { app } from '../../app';

it('sign in with wrong password', async () => {
  const cookie = await signin();

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'qwe',
    })
    .expect(400);
});

it('get cookie back with correct credentials', async () => {
  const cookie = await signin();

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'qwerty',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

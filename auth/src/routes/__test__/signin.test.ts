import request from 'supertest';
import { app } from '../../app';

it('sign in with wrong password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'qwerty',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'qwe',
    })
    .expect(400);
});

it('get cookie back with correct credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'qwerty',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'qwerty',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

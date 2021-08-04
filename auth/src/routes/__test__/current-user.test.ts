import request from 'supertest';
import { app } from '../../app';

it('validate the current user is valid', async () => {
  const cookie = await signin();
  const response = await request(app).get('/api/users/currentuser').set('Cookie', cookie).send().expect(200);
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

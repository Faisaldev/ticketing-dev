import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var signin: () => string[];
}

let mongo: any;
//execute before everything
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  //create new instance of in-memory mongo db
  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri();

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

//before executing any test delete all collections

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // fabricating the session cookie with JWT token

  // build the JWT payload {id,email}
  const payload = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  //create jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object {jwt:jwt token}
  const session = { jwt: token };

  //turn that session into json format
  const sessionJSON = JSON.stringify(session);

  //encode session json into base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return the string that the cookie with session data
  return [`express:sess=${base64}`];
};

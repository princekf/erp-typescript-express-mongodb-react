import * as MMS from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import app from '../app';
import User from '../users/user.model';
import Item from './item.model';
import {Constants} from 'fivebyone';

const {HTTP_OK, HTTP_BAD_REQUEST} = Constants;

describe('/api/items tests', () => {

  const mongod = new MMS.MongoMemoryServer();
  let serverToken = '';

  // Connect to mongoose mock, create a test user and get the access token
  beforeAll(async() => {

    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
    });
    const user = new User();
    user.email = 'test@email.com';
    user.setPassword('test-password');
    await user.save();
    const response = await request(app).post('/api/users/login')
      .send({
        email: 'test@email.com',
        password: 'test-password',
      });
    const {body: {token}} = response;
    serverToken = token;

  });

  // Remove test user, disconnect and stop database
  afterAll(async() => {

    await User.remove({});
    await mongoose.disconnect();
    await mongod.stop();

  });

  // Create a sample item
  beforeEach(async() => {

    const item = new Item();
    item.name = 'item name';
    item.value = 1000;
    await item.save();

  });

  // Remove sample items
  afterEach(async() => {

    await Item.remove({});

  });

  it('should get items', async() => {

    const response = await request(app).get('/api/items')
      .set('Authorization', `Bearer ${serverToken}`);
    expect(response.status).toBe(HTTP_OK);
    expect(response.body).toEqual([
      expect.objectContaining({
        name: 'item name',
        value: 1000,
      }),
    ]);

  });

  it('should post items', async() => {

    const response = await request(app).post('/api/items')
      .set('Authorization', `Bearer ${serverToken}`)
      .send({
        name: 'new item',
        value: 2000,
      });
    expect(response.status).toBe(HTTP_OK);
    expect(response.body).toBe('Item saved!');

  });

  it('should catch errors when posting items', async() => {

    const response = await request(app).post('/api/items')
      .set('Authorization', `Bearer ${serverToken}`)
      .send({});
    expect(response.status).toBe(HTTP_BAD_REQUEST);

  });

});

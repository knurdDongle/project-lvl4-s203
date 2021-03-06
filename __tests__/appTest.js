import request from 'supertest';
import dotenv from 'dotenv';
import app from '..';

dotenv.load();

describe('requests', () => {
  let server;

  beforeEach(() => {
    server = app().listen();
  });

  it('GET 200', async () => {
    const res = await request.agent(server)
      .get('/');
    expect(res.status).toBe(200);
  });

  it('GET 404', async () => {
    const res = await request.agent(server)
      .get('/wrong-path');
    expect(res.status).toBe(404);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});

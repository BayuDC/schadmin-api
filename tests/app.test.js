const request = require('supertest');
const app = require('../app');

beforeAll(() => require('dotenv').config());

describe('GET /', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
        expect(response.text).toBe('Hello World!');
    });
});

describe('GET /api', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/api');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toEqual({ message: 'Hello World!' });
    });

    it('should return 404', async () => {
        const response = await request(app).get('/api/not-found');

        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toEqual({ message: 'Not Found' });
    });
});

const request = require('supertest');
const app = require('../app');

let token;

beforeEach(async () => {
    const response = await request(app).post('/api/auth/login').send({
        username: 'admin',
        password: 'password',
    });

    token = response.body.token;
});

describe('POST /api/auth/login', () => {
    it('should return 200', async () => {
        const response = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'password',
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login success');
        expect(response.body.user.username).toBe('admin');
        expect(response.body.token).toBeDefined();
        expect(response.header['set-cookie']).toBeDefined();
        expect(response.header['set-cookie'][0]).toContain('token');
    });
    it('should return 404', async () => {
        const response = await request(app).post('/api/auth/login').send({
            username: 'not_exist',
        });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'User not found',
        });
    });
    it('should return 401', async () => {
        const response = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'incorrect',
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Incorrect password',
        });
    });
});

describe('POST /api/auth/logout', () => {
    it('should return 200', async () => {
        const response = await request(app).post('/api/auth/logout').query({ token });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Logout success',
        });
        expect(response.header['set-cookie']).toBeDefined();
        expect(response.header['set-cookie'][0]).toContain('token=;');
    });
});
describe('GET /api/auth/me', () => {
    it('shoudl return 200', async () => {
        const response = await request(app).get('/api/auth/me').query({ token });

        expect(response.status).toBe(200);
        expect(response.body.user.username).toBe('admin');
        expect(response.body.user.id).toBeDefined();
    });
});
describe('GET /api/auth', () => {
    it('should return 200 with bearer token', async () => {
        const response = await request(app).get('/api/auth').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it('should return 200 with cookie token', async () => {
        const response = await request(app).get('/api/auth').set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
    });
    it('should return 200 with body token', async () => {
        const response = await request(app).get('/api/auth').send({ token });
        expect(response.status).toBe(200);
    });
    it('should return 200 with query token', async () => {
        const response = await request(app).get('/api/auth').query({ token });
        expect(response.status).toBe(200);
    });
    it('should return 401 without token', async () => {
        const response = await request(app).get('/api/auth');
        expect(response.status).toBe(401);
    });
});

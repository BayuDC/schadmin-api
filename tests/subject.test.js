const request = require('supertest');
const app = require('../app');

let tokenAdmin;
let tokenTeacher;
let subjectId;

beforeEach(async () => {
    tokenAdmin = (
        await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'password',
        })
    ).body.token;
    tokenTeacher = (
        await request(app).post('/api/auth/login').send({
            username: 'teacher',
            password: 'password',
        })
    ).body.token;
});

describe('GET /api/subjects', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/api/subjects').query({ token: tokenAdmin });
        expect(response.status).toBe(200);
        expect(response.body.subjects).toBeInstanceOf(Array);
    });
    it('should return 401', async () => {
        const response = await request(app).get('/api/subjects');
        expect(response.status).toBe(401);
    });
});
describe('GET /api/subjects/:id', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/api/subjects/1').query({ token: tokenAdmin });
        expect(response.status).toBe(200);
        expect(response.body.subject.id).toBeDefined();
        expect(response.body.subject.name).toBeDefined();
    });
    it('should return 404', async () => {
        const response = await request(app).get('/api/subjects/999').query({ token: tokenAdmin });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'Subject not found',
        });
    });
    it('should return 401', async () => {
        const response = await request(app).get('/api/subjects/1');

        expect(response.status).toBe(401);
    });
});
describe('POST /api/subjects', () => {
    it('should return 200', async () => {
        const response = await request(app).post('/api/subjects').query({ token: tokenAdmin }).send({
            name: 'Test',
        });

        expect(response.status).toBe(201);
        expect(response.body.subject.id).toBeDefined();
        expect(response.body.subject.name).toBe('Test');
        subjectId = response.body.subject.id;
    });
    it('should return 403', async () => {
        const response = await request(app).post('/api/subjects').query({ token: tokenTeacher });
        expect(response.status).toBe(403);
    });
    it('should return 401', async () => {
        const response = await request(app).post('/api/subjects');
        expect(response.status).toBe(401);
    });
    it('should return 400', async () => {
        const response = await request(app).post('/api/subjects').query({ token: tokenAdmin }).send({
            name: '',
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Validation failed',
            errors: {
                name: 'Subject name is required',
            },
        });
    });
});
describe('PUT /api/subjects/:id', () => {
    it('should return 200', async () => {
        const response = await request(app)
            .put('/api/subjects/' + subjectId)
            .query({ token: tokenAdmin })
            .send({
                name: 'Test2',
            });

        expect(response.status).toBe(200);
        expect(response.body.subject.id).toBeDefined();
        expect(response.body.subject.name).toBe('Test2');
    });
    it('should return 400', async () => {
        const response = await request(app)
            .put('/api/subjects/' + subjectId)
            .query({ token: tokenAdmin })
            .send({
                name: '',
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Validation failed',
            errors: {
                name: 'Subject name is required',
            },
        });
    });
    it('should return 404', async () => {
        const response = await request(app).put('/api/subjects/999').query({ token: tokenAdmin });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'Subject not found',
        });
    });
    it('should return 403', async () => {
        const response = await request(app).put('/api/subjects/1').query({ token: tokenTeacher });
        expect(response.status).toBe(403);
    });
    it('should return 401', async () => {
        const response = await request(app).put('/api/subjects/1');
        expect(response.status).toBe(401);
    });
});

describe('DELETE /api/subjects/:id', () => {
    it('should return 200', async () => {
        const response = await request(app)
            .delete('/api/subjects/' + subjectId)
            .query({ token: tokenAdmin });

        expect(response.status).toBe(204);
    });
    it('should return 404', async () => {
        const response = await request(app).delete('/api/subjects/999').query({ token: tokenAdmin });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'Subject not found',
        });
    });
    it('should return 403', async () => {
        const response = await request(app).delete('/api/subjects/1').query({ token: tokenTeacher });
        expect(response.status).toBe(403);
    });
    it('should return 401', async () => {
        const response = await request(app).delete('/api/subjects/1');
        expect(response.status).toBe(401);
    });
});

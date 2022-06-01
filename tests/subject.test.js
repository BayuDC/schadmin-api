const request = require('supertest');
const app = require('../app');

let tokenAdmin;
let tokenTeacher;
let subjectId;

beforeAll(async () => {
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
describe('Normal state for /api/subjects', () => {
    describe('get', () => {
        it('should return all subjects', async () => {
            const response = await request(app).get('/api/subjects').query({ token: tokenAdmin });

            expect(response.status).toBe(200);
            expect(response.body.subjects).toBeInstanceOf(Array);
            expect(response.body.subjects[0].name).toBeDefined();
            expect(response.body.subjects[1].name).toBeDefined();
        });
        it('should return a subject', async () => {
            const response = await request(app).get('/api/subjects/1').query({ token: tokenAdmin });

            expect(response.status).toBe(200);
            expect(response.body.subject.id).toBeDefined();
            expect(response.body.subject.name).toBeDefined();
        });
    });
    describe('post', () => {
        it('should create a subject', async () => {
            const subject = { name: 'Test' };
            const response = await request(app).post('/api/subjects').query({ token: tokenAdmin }).send(subject);

            expect(response.status).toBe(201);
            expect(response.body.subject).toMatchObject(subject);
            expect(response.body.subject.id).toBeDefined();
            subjectId = response.body.subject.id;
        });
    });
    describe('put', () => {
        it('should update a subject', async () => {
            const subject = { name: 'Test Edited' };
            const response = await request(app)
                .put(`/api/subjects/${subjectId}`)
                .query({ token: tokenAdmin })
                .send(subject);

            expect(response.status).toBe(200);
            expect(response.body.subject).toMatchObject(subject);
            expect(response.body.subject.id).toBeDefined();
        });
    });
    describe('delete', () => {
        it('should delete a subject', async () => {
            const response = await request(app).delete(`/api/subjects/${subjectId}`).query({ token: tokenAdmin });

            expect(response.status).toBe(204);
        });
    });
});

describe('Error handling for /api/subjects', () => {
    it.each(['get', 'post', 'put', 'delete'])(
        'should return a 401 error if the user is not authenticated for %s',
        async method => {
            const response = await request(app)[method]('/api/subjects');

            expect(response.status).toBe(401);
        }
    );
    it.each(['post', 'put', 'delete'])(
        'should return a 403 error if the user is not authorized for %s',
        async method => {
            const response = await request(app)
                [method]('/api/subjects/' + (method == 'post' ? '' : 1))
                .query({ token: tokenTeacher });

            expect(response.status).toBe(403);
        }
    );
    it.each(['get', 'put', 'delete'])(
        'should return a 404 error if the subject does not exist for %s',
        async method => {
            const response = await request(app)[method](`/api/subjects/0`).query({ token: tokenAdmin });

            expect(response.status).toBe(404);
        }
    );
});
describe('Validation for /api/subjects', () => {
    describe('post', () => {
        it('need a name', async () => {
            const response = await request(app).post('/api/subjects').query({ token: tokenAdmin }).send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
            expect(response.body.errors.name).toBe('Name is required');
        });
    });
    describe('put', () => {
        it('need a name', async () => {
            const response = await request(app).put(`/api/subjects/1`).query({ token: tokenAdmin }).send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
            expect(response.body.errors.name).toBe('Name is required');
        });
    });
});

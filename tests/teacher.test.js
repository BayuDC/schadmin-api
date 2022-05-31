const request = require('supertest');
const app = require('../app');

let tokenAdmin;
let tokenTeacher;

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

describe('GET /api/teachers', () => {
    it('should return all teachers', async () => {
        const response = await request(app).get('/api/teachers').query({ token: tokenAdmin });

        expect(response.status).toBe(200);
        expect(response.body.teachers).toBeInstanceOf(Array);
        expect(response.body.teachers[0]).toHaveProperty('id');
        expect(response.body.teachers[0]).toHaveProperty('name');
        expect(response.body.teachers[0]).toHaveProperty('code');
    });
    it('should return 401', async () => {
        const response = await request(app).get('/api/teachers');

        expect(response.status).toBe(401);
    });
});
describe('GET /api/teachers/:id', () => {
    it('should return a spesific teacher', async () => {
        const response = await request(app).get('/api/teachers/1').query({ token: tokenAdmin });

        expect(response.status).toBe(200);
        ['id', 'name', 'code', 'gender', 'address', 'userId', 'subjectId'].forEach(property => {
            expect(response.body.teacher).toHaveProperty(property);
        });

        const response2 = await request(app).get('/api/teachers/1?full').query({ token: tokenAdmin });
        expect(response2.status).toBe(200);
        ['id', 'name', 'code', 'gender', 'address', 'user', 'subject'].forEach(property => {
            expect(response2.body.teacher).toHaveProperty(property);
        });
    });
    it('should return 404', async () => {
        const response = await request(app).get('/api/teachers/999').query({ token: tokenAdmin });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'Teacher not found',
        });
    });
    it('should return 401', async () => {
        const response = await request(app).get('/api/teachers/1');

        expect(response.status).toBe(401);
    });
});

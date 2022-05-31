const request = require('supertest');
const app = require('../app');

let tokenAdmin;
let tokenTeacher;
let teacherId;

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
describe('POST /api/teachers', () => {
    it('should create a teacher', async () => {
        const teacher = {
            name: 'Teacher',
            code: 'TT',
            gender: 'male',
            address: 'Some address',
            userId: 2,
            subjectId: 2,
        };
        const response = await request(app).post('/api/teachers').query({ token: tokenAdmin }).send(teacher);

        expect(response.status).toBe(201);
        expect(response.body.teacher).toHaveProperty('id');
        expect(response.body.teacher).toMatchObject(teacher);

        teacherId = response.body.teacher.id;
    });
    it('should return 403', async () => {
        const response = await request(app).post('/api/teachers').query({ token: tokenTeacher });
        expect(response.status).toBe(403);
    });
    it('should return 401', async () => {
        const response = await request(app).post('/api/teachers');
        expect(response.status).toBe(401);
    });
});
describe('POST /api/teachers validation', () => {
    it('need all fields', async () => {
        const response = await request(app).post('/api/teachers').query({ token: tokenAdmin });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Validation failed',
            errors: {
                name: 'Name is required',
                code: 'Code is required',
                gender: 'Gender is required',
                address: 'Address is required',
                subjectId: 'Subject is required',
                userId: 'User is required',
            },
        });
    });
    it('need unique code', async () => {
        const teacher = { code: 'TT' };
        const response = await request(app).post('/api/teachers').query({ token: tokenAdmin }).send(teacher);

        expect(response.status).toBe(400);
        expect(response.body.errors).toHaveProperty('code', 'Code already taken');
    });
    it('need valid gender', async () => {
        const teacher = { gender: 'notmaleorfemale' };
        const response = await request(app).post('/api/teachers').query({ token: tokenAdmin }).send(teacher);

        expect(response.status).toBe(400);
        expect(response.body.errors).toHaveProperty('gender', 'Gender must be male or female');
    });
    it('need user and subject that exists', async () => {
        const teacher = { subjectId: 999, userId: 999 };
        const response = await request(app).post('/api/teachers').query({ token: tokenAdmin }).send(teacher);

        expect(response.status).toBe(400);
        expect(response.body.errors).toHaveProperty('subjectId', 'Subject not found');
        expect(response.body.errors).toHaveProperty('userId', 'User not found');
    });
});

const request = require('supertest');
const app = require('../app');

let tokenAdmin;
let tokenTeacher;

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

describe('Normal state for /api/teachers', () => {
    let teacherId;

    describe('get', () => {
        it('should return all teachers', async () => {
            const response = await request(app).get('/api/teachers').query({ token: tokenAdmin });

            expect(response.status).toBe(200);
            expect(response.body.teachers).toBeInstanceOf(Array);
            expect(response.body.teachers[0]).toHaveProperty('id');
            expect(response.body.teachers[0]).toHaveProperty('name');
            expect(response.body.teachers[0]).toHaveProperty('code');
        });
        it('should return a teacher', async () => {
            const response = await request(app).get('/api/teachers/1').query({ token: tokenAdmin });

            expect(response.status).toBe(200);
            expect(response.body.teacher).toHaveProperty('id');
            expect(response.body.teacher).toHaveProperty('name');
            expect(response.body.teacher).toHaveProperty('code');
            expect(response.body.teacher).toHaveProperty('gender');
            expect(response.body.teacher).toHaveProperty('address');
            expect(response.body.teacher).toHaveProperty('subjectId');
            expect(response.body.teacher).toHaveProperty('userId');
        });
        it('should return full teacher information', async () => {
            const response = await request(app).get('/api/teachers/1?full').query({ token: tokenAdmin });

            expect(response.status).toBe(200);
            expect(response.body.teacher).toHaveProperty('id');
            expect(response.body.teacher).toHaveProperty('name');
            expect(response.body.teacher).toHaveProperty('code');
            expect(response.body.teacher).toHaveProperty('gender');
            expect(response.body.teacher).toHaveProperty('address');
            expect(response.body.teacher).toHaveProperty('subject');
            expect(response.body.teacher).toHaveProperty('user');
        });
    });
    describe('post', () => {
        it('should create a teacher', async () => {
            const teacher = {
                name: 'Teacher',
                code: 'XX',
                gender: 'male',
                address: 'Some Address',
                subjectId: 2,
                userId: 2,
            };
            const response = await request(app).post('/api/teachers').query({ token: tokenAdmin }).send(teacher);

            expect(response.status).toBe(201);
            expect(response.body.teacher).toHaveProperty('id');
            expect(response.body.teacher).toMatchObject(teacher);
            teacherId = response.body.teacher.id;
        });
    });
    describe('put', () => {
        it('should update a teacher', async () => {
            const teacher = {
                name: 'Teacher2',
                code: 'YY',
                gender: 'female',
                address: 'Another Address',
                subjectId: 1,
                userId: 2,
            };
            const response = await request(app)
                .put('/api/teachers/' + teacherId)
                .query({ token: tokenAdmin })
                .send(teacher);

            expect(response.status).toBe(200);
            expect(response.body.teacher).toHaveProperty('id');
            expect(response.body.teacher).toMatchObject(teacher);
        });
    });
    describe('delete', () => {
        it('should delete a teacher', async () => {
            const response = await request(app)
                .delete('/api/teachers/' + teacherId)
                .query({ token: tokenAdmin });

            expect(response.status).toBe(204);
        });
    });
});

describe('Error state for /api/teachers', () => {
    it.each(['get', 'post', 'put', 'delete'])(
        'should return a 401 error if the user is not authenticated for %s',
        async method => {
            const response = await request(app)[method]('/api/teachers');

            expect(response.status).toBe(401);
        }
    );
    it.each(['post', 'put', 'delete'])(
        'should return a 403 error if the user is not authorized for %s',
        async method => {
            const response = await request(app)
                [method]('/api/teachers/' + (method == 'post' ? '' : '1'))
                .query({ token: tokenTeacher });

            expect(response.status).toBe(403);
        }
    );
    it.each(['get', 'put', 'delete'])(
        'should return a 404 error if the subject does not exist for %s',
        async method => {
            const response = await request(app)[method](`/api/teachers/0`).query({ token: tokenAdmin });

            expect(response.status).toBe(404);
        }
    );
});

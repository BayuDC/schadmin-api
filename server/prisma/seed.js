const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const password = '$2b$10$Hm3IPt5xdLKKr/8HfUHWxuemOpDZyikaDBtScq.1GsCTSEGqGTXry';

async function main() {
    await prisma.user.create({
        data: {
            username: 'admin',
            password: password,
            role: 'admin',
        },
    });

    for (subject of ['Mathematic', 'English']) {
        await prisma.subject.create({
            data: {
                name: subject,
                teachers: {
                    create: [...Array(5)].map(() => ({
                        name: faker.name.findName(),
                        code: faker.random.alpha({ count: 2, casing: 'upper' }),
                        gender: faker.helpers.arrayElement(['male', 'female']),
                        address: faker.address.streetAddress(),
                        user: {
                            create: {
                                username: faker.internet.userName(),
                                password: password,
                                role: 'teacher',
                            },
                        },
                    })),
                },
            },
        });
    }
}

main()
    .catch(e => console.log(e))
    .finally(() => prisma.$disconnect());

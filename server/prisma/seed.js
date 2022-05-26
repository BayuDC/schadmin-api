const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const password = '$2b$10$Hm3IPt5xdLKKr/8HfUHWxuemOpDZyikaDBtScq.1GsCTSEGqGTXry';

async function main() {
    await prisma.subject.create({ data: { name: 'Mathematic' } });
    await prisma.subject.create({ data: { name: 'English' } });

    for (let i = 0; i < 5; i++) {
        await prisma.user.create({
            data: {
                username: faker.internet.userName(),
                password: password,
                role: 'teacher',
                teacher: {
                    create: {
                        name: faker.name.findName(),
                        code: faker.random.alpha({ count: 2, casing: 'upper' }),
                        address: faker.address.streetAddress(),
                        gender: faker.helpers.arrayElement(['male', 'female']),
                        subject: {
                            connect: {
                                id: faker.datatype.number({ min: 1, max: 2 }),
                            },
                        },
                    },
                },
            },
        });
    }
    await prisma.user.create({
        data: {
            username: 'admin',
            password: password,
            role: 'admin',
        },
    });
}

main()
    .catch(e => console.log(e))
    .finally(() => prisma.$disconnect());

const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                username: faker.unique(faker.internet.userName),
                password: '$2b$10$Hm3IPt5xdLKKr/8HfUHWxuemOpDZyikaDBtScq.1GsCTSEGqGTXry', // ? password
            },
        });
    }
}

main()
    .catch(e => console.log(e))
    .finally(() => prisma.$disconnect());

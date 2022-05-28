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

    await prisma.subject.create({ data: { name: 'Mathematic' } });
    await prisma.subject.create({ data: { name: 'English' } });
}

main()
    .catch(e => console.log(e))
    .finally(() => prisma.$disconnect());

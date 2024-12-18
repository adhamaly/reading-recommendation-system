import { PrismaClient, UserRole } from '@prisma/client';
const prisma = new PrismaClient();
import * as bcrypt from 'bcrypt';

async function seedAdminAccount() {
  const adminExist = await prisma.user.findFirst({
    where: { email: process.env.ADMIN_EMAIL },
  });
  if (adminExist) return;

  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD,
    parseInt(process.env.SALT),
  );

  await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });
}

async function main() {
  await seedAdminAccount();

  console.log('Admin Account Seed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

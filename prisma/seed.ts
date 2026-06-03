/*
  Seed script — creates one admin user so you can log in immediately.
  Run with: npm run db:seed

  bcryptjs is used here (not bcrypt) because it's pure JS and works
  without native bindings — simpler for dev and CI.

  The password is hashed with bcrypt cost factor 12.
  Cost factor 12 means 2^12 = 4096 iterations — slow enough to resist
  brute force but fast enough not to annoy users at login time.
*/

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin1234", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@novity.fr" },
    update: {},
    create: {
      email: "admin@novity.fr",
      name: "Admin NOVITY",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user seeded:", admin.email);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

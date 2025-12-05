import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Simple hash function for demo
function simpleHash(password: string): string {
  return Buffer.from(password).toString("base64");
}

async function main() {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding database...");

  const now = new Date();

  const alice = await prisma.user.create({
    data: {
      id: "user_alice",
      name: "Alice",
      email: "alice@example.com",
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.account.create({
    data: {
      id: "account_alice",
      accountId: alice.email,
      providerId: "credential",
      userId: alice.id,
      password: simpleHash("Alice123!"),
      createdAt: now,
      updatedAt: now,
    },
  });

  const theo = await prisma.user.create({
    data: {
      id: "user_theo",
      name: "Theo",
      email: "theo@example.com",
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.account.create({
    data: {
      id: "account_theo",
      accountId: theo.email,
      providerId: "credential",
      userId: theo.id,
      password: simpleHash("Theo123!"),
      createdAt: now,
      updatedAt: now,
    },
  });

  const prime = await prisma.user.create({
    data: {
      id: "user_prime",
      name: "Prime",
      email: "prime@example.com",
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.account.create({
    data: {
      id: "account_prime",
      accountId: prime.email,
      providerId: "credential",
      userId: prime.id,
      password: simpleHash("Prime123!"),
      createdAt: now,
      updatedAt: now,
    },
  });

  const leerob = await prisma.user.create({
    data: {
      id: "user_leerob",
      name: "Lee Robinson",
      email: "leerob@example.com",
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.account.create({
    data: {
      id: "account_leerob",
      accountId: leerob.email,
      providerId: "credential",
      userId: leerob.id,
      password: simpleHash("leerob123!"),
      createdAt: now,
      updatedAt: now,
    },
  });

  // Create posts
  await prisma.post.create({
    data: {
      id: 101,
      title: "Mochido opens its new location in Coquitlam this week",
      link: "https://dailyhive.com/vancouver/mochido-coquitlam-open",
      description:
        "New mochi donut shop, Mochido, is set to open later this week.",
      creatorId: alice.id,
      subgroup: "food",
      timestamp: BigInt(1643648446955),
    },
  });

  await prisma.post.create({
    data: {
      id: 102,
      title: "2023 State of Databases for Serverless & Edge",
      link: "https://leerob.io/blog/backend",
      description:
        "An overview of databases that pair well with modern application and compute providers.",
      creatorId: leerob.id,
      subgroup: "coding",
      timestamp: BigInt(1642611742010),
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      id: 9001,
      postId: 102,
      creatorId: alice.id,
      description: "react and next are pretty awesome",
      timestamp: BigInt(1642691742010),
    },
  });

  console.log("Database seeded successfully!");
  console.log("\nTest accounts:");
  console.log("- alice@example.com / alpha");
  console.log("- theo@example.com / 123");
  console.log("- prime@example.com / 123");
  console.log("- leerob@example.com / 123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

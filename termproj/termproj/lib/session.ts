import { prisma } from "./db";

export async function createSession(userId: number): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = BigInt(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.session.create({
    data: {
      sessionId,
      userId,
      expiresAt,
    },
  });

  return sessionId;
}

export async function getSession(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { sessionId },
  });

  if (!session) return null;

  // Check if session is expired
  if (session.expiresAt < BigInt(Date.now())) {
    await prisma.session.delete({
      where: { sessionId },
    });
    return null;
  }

  return {
    sessionId: session.sessionId,
    userId: session.userId,
    expiresAt: Number(session.expiresAt),
  };
}

export async function deleteSession(sessionId: string): Promise<void> {
  await prisma.session
    .delete({
      where: { sessionId },
    })
    .catch(() => {
      // Ignore error if session doesn't exist
    });
}

function generateSessionId(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

// Clean up expired sessions periodically
async function cleanupExpiredSessions() {
  const now = BigInt(Date.now());
  await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
}

// Run cleanup every hour
setInterval(() => {
  cleanupExpiredSessions().catch(console.error);
}, 60 * 60 * 1000);

// Run cleanup on startup
cleanupExpiredSessions().catch(console.error);

import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Use Prisma's inferred types for decorated posts/comments
export type DecoratedPost = Prisma.PostGetPayload<{
  include: {
    creator: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
    comments: {
      include: {
        creator: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
  };
}>;

export type DecoratedComment = DecoratedPost["comments"][number];

// Database functions
export async function getPosts(n = 5, sub?: string) {
  return await prisma.post.findMany({
    where: sub ? { subgroup: sub } : undefined,
    orderBy: { timestamp: "desc" },
    take: n,
  });
}

export async function getPost(id: number) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      comments: {
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
}

export async function addPost(
  title: string,
  link: string,
  creatorId: string,
  description: string,
  subgroup: string
) {
  return await prisma.post.create({
    data: {
      title,
      link,
      description,
      creatorId,
      subgroup,
      timestamp: BigInt(Date.now()),
    },
  });
}

export async function editPost(
  postId: number,
  changes: Prisma.PostUpdateInput
) {
  await prisma.post.update({
    where: { id: postId },
    data: changes,
  });
}

export async function deletePost(postId: number) {
  await prisma.post.delete({
    where: { id: postId },
  });
}

export async function getSubs() {
  const posts = await prisma.post.findMany({
    select: { subgroup: true },
    distinct: ["subgroup"],
  });

  return posts.map((post) => post.subgroup);
}

export async function addComment(
  postId: number,
  creatorId: string,
  description: string
) {
  return await prisma.comment.create({
    data: {
      postId,
      creatorId,
      description,
      timestamp: BigInt(Date.now()),
    },
  });
}

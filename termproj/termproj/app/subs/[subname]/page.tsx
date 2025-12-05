import { getPosts } from "@/lib/db";
import Link from "next/link";

export default async function SubPage({
  params,
}: {
  params: Promise<{ subname: string }>;
}) {
  const { subname } = await params;
  const posts = await getPosts(20, subname);

  return (
    <main>
      <div className="authOptions">
        <h1>r/{subname}</h1>
        <Link role="button" href="/posts">
          Home
        </Link>
      </div>
      <div>
        <h2>Posts in {subname}</h2>
        {posts.length === 0 ? (
          <p>No posts in this subgroup yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="individualPost">
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
              <p>{post.description}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

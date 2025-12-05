import { getPosts } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { signOutAction } from "@/actions";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await getPosts(20);
  const user = await getCurrentUser();

  return (
    <main>
      <div className="authOptions">
        <h1>Homepage</h1>
        <div className="navbar">
          {!user ? (
            <>
              <Link role="button" href="/login">
                Login
              </Link>
              <Link href="/signup" role="button" style={{ marginLeft: '10px' }}>Sign Up</Link>
            </>
          ) : (
            <>
              <Link role="button" href="/settings">
                Settings
              </Link>
              <form action={signOutAction}>
                <button type="submit">Logout</button>
              </form>
            </>
          )}
        </div>
      </div>
      <h2>Welcome, {user?.name || "Visitor"}</h2>
      <div>
        <p>All Posts</p>
        {posts.map((post) => (
          <div key={post.id} className="individualPost">
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
            <p>{post.description}</p>
          </div>
        ))}
      </div>

      <div>
        <Link href="/subs/list">Subgroups</Link>
      </div>

      {user && (
        <div>
          <Link role="button" href="/posts/create">
            Create Post
          </Link>
        </div>
      )}
    </main>
  );
}

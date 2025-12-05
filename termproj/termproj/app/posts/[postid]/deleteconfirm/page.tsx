import { getPost } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect, notFound } from "next/navigation";
import { deletePostAction } from "@/actions";
import Link from "next/link";

export default async function DeleteConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ postid: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { postid } = await params;
  const { error } = await searchParams;
  const post = await getPost(parseInt(postid));
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!post) {
    notFound();
  }

  if (post.creator.id !== user.id) {
    redirect("/posts");
  }

  return (
    <main>
      <div className="authOptions">
        <h1>Delete Post</h1>
        <Link role="button" href={`/posts/${post.id}`}>
          Cancel
        </Link>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h2>Are you sure you want to delete this post?</h2>
        <p>
          <strong>{post.title}</strong>
        </p>
        <p>{post.description}</p>
        <form action={deletePostAction}>
          <input type="hidden" name="postId" value={post.id} />
          <button type="submit">Yes, Delete Post</button>
        </form>
      </div>
    </main>
  );
}

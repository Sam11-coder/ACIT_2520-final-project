import { getPost } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect, notFound } from "next/navigation";
import { editPostAction } from "@/actions";
import Link from "next/link";

export default async function EditPostPage({
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
        <h1>Edit Post</h1>
        <Link role="button" href={`/posts/${post.id}`}>
          Back
        </Link>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form action={editPostAction}>
        <input type="hidden" name="postId" value={post.id} />
        <input type="text" name="title" defaultValue={post.title} required />
        <input type="url" name="link" defaultValue={post.link} required />
        <textarea name="description" defaultValue={post.description} required />
        <input
          type="text"
          name="subgroup"
          defaultValue={post.subgroup}
          required
        />
        <button type="submit">Update Post</button>
      </form>
    </main>
  );
}

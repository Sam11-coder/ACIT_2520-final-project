import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { createPostAction } from "@/actions";
import Link from "next/link";

export default async function CreatePostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  const { error } = await searchParams;

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <div className="authOptions">
        <h1>Create Post</h1>
        <Link role="button" href="/posts">
          Home
        </Link>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form action={createPostAction}>
        <input type="text" name="title" placeholder="Title" required />
        <input type="url" name="link" placeholder="Link" required />
        <textarea name="description" placeholder="Description" required />
        <input type="text" name="subgroup" placeholder="Subgroup" required />
        <button type="submit">Create Post</button>
      </form>
    </main>
  );
}

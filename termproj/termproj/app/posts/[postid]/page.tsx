import { getPost } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { createCommentAction } from "@/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostPage({
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

  if (!post) {
    notFound();
  }

  return (
    <main>
      <div className="authOptions">
        <h1>View Post</h1>
        <Link role="button" href="/posts">
          Home
        </Link>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h2>{post.title}</h2>
        <p>
          <a href={post.link} target="_blank" rel="noopener noreferrer">
            {post.link}
          </a>
        </p>
        <p>{post.description}</p>
        <p>
          <small>
            Posted by {post.creator.name || post.creator.email} in{" "}
            {post.subgroup} •{" "}
            {new Date(Number(post.timestamp)).toLocaleString()}
          </small>
        </p>

        {user && user.id === post.creator.id && (
          <div>
            <Link role="button" href={`/posts/${post.id}/edit`}>
              Edit
            </Link>{" "}
            <Link role="button" href={`/posts/${post.id}/deleteconfirm`}>
              Delete
            </Link>
          </div>
        )}

        <h3>Comments ({post.comments.length})</h3>
        {post.comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              marginLeft: "20px",
              marginBottom: "15px",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            {/* Profile Picture */}
            {comment.creator.image ? (
              <img
                src={comment.creator.image}
                alt={comment.creator.name || "User"}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#666",
                  flexShrink: 0,
                }}
              >
                {comment.creator.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}

            {/* Comment Content */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 5px 0" }}>
                <strong>{comment.creator.name || comment.creator.email}</strong>
                : {comment.description}
              </p>
              <p style={{ margin: 0 }}>
                <small>
                  {new Date(Number(comment.timestamp)).toLocaleString()}
                </small>
              </p>
            </div>
          </div>
        ))}

        {user && (
          <div>
            <h3>Add Comment</h3>
            <form action={createCommentAction}>
              <input type="hidden" name="postId" value={post.id} />
              <textarea
                name="description"
                placeholder="Your comment"
                required
              />
              <button type="submit">Post Comment</button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

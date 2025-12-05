import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { updateProfileImageAction } from "@/actions";
import Link from "next/link";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await getCurrentUser();
  const { error, success } = await searchParams;

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <div className="authOptions">
        <h1>Settings</h1>
        <Link role="button" href="/posts">
          Home
        </Link>
      </div>

      <div className="settings-container">
        <h2>Profile Settings</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <div className="profile-preview">
          <h3>Current Profile Picture</h3>
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                color: "#666",
              }}
            >
              {user.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        <form action={updateProfileImageAction}>
          <label htmlFor="imageUrl">Profile Picture URL</label>
          <input
            type="url"
            name="imageUrl"
            id="imageUrl"
            placeholder="https://example.com/your-image.jpg"
            defaultValue={user.image || ""}
            required
          />
          <small style={{ display: "block", marginTop: "5px", color: "#666" }}>
            Enter a URL to an image youd like to use as your profile picture
          </small>
          <button type="submit">Update Profile Picture</button>
        </form>

        <div style={{ marginTop: "30px" }}>
          <h3>Account Information</h3>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </main>
  );
}

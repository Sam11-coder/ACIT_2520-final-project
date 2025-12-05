import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { signUpAction } from "@/actions";
import Link from "next/link";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  const { error } = await searchParams;

  if (user) {
    redirect("/posts");
  }

  return (
    <main>
      <div className="box">
        <h1>Sign Up</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form action={signUpAction}>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}

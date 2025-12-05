import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { signInAction } from "@/actions";
import Link from "next/link";

export default async function LoginPage({
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
        <h1>Login</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form action={signInAction}>
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
          <button type="submit">Login</button>
        </form>
        <p>
          Dont have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}

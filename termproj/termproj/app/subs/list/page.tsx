import { getSubs } from "@/lib/db";
import Link from "next/link";

export default async function SubsListPage() {
  const subs = await getSubs();

  return (
    <main>
      <div className="authOptions">
        <h1>Sub Groups</h1>
        <Link role="button" href="/posts">
          Home
        </Link>
      </div>
      <div>
        <h2>All Subgroups</h2>
        <ul>
          {subs.map((sub) => (
            <li key={sub}>
              <Link href={`/subs/${sub}`}>{sub}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

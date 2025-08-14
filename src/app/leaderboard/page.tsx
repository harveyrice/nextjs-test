import Link from "next/link";
import { getScores } from "../actions";

export default async function Leaderboard() {
  const entries = await getScores();
  return (
    <>
      <Link href={"/"}>Back</Link>
      <ol>
        {entries.map((entry) => {
          return (
            <li>
              {entry.username}-{entry.score}
            </li>
          );
        })}
      </ol>
    </>
  );
}

import Link from "next/link";
import { getScores } from "../actions";

export default async function Leaderboard() {
  const entries = await getScores();
  return (
    <main className="flex flex-col gap-[32px] row-start-2 font-mono grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20">
      <Link href={"/"}>Back</Link>
      <ol>
        {entries.map((entry, index) => {
          return (
            <div key={index} className="flex gap-1 ">
              {index === 0 ? <div className="-ml-7 w-6">👑</div> : undefined}
              <li className="flex justify-between w-70">
                <div>{entry.username}</div>
                <div>{entry.score}</div>
              </li>
            </div>
          );
        })}
      </ol>
    </main>
  );
}

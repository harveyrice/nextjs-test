"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { submitScore } from "./actions";
import data from "./countries.json";

export interface Question {
  question: string;
  answer: string;
  image?: React.ReactNode;
  options?: string[];
}

function getRandomOptions(
  correctAnswer: string,
  allAnswers: string[],
  count: number = 3
): string[] {
  const otherAnswers = allAnswers.filter((a) => a !== correctAnswer);
  const shuffled = otherAnswers.sort(() => Math.random() - 0.5);
  const options = [correctAnswer, ...shuffled.slice(0, count - 1)];
  return options.sort(() => Math.random() - 0.5);
}

function capital(): Question {
  const country = data[Math.floor(Math.random() * data.length)];
  const allCapitals = data.map((c) => c.capital);
  return {
    question: `Capital of ${country.name}?`,
    answer: country.capital,
    options: getRandomOptions(country.capital, allCapitals, 4),
  };
}

function codeToEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}

function flag(): Question {
  const country = data[Math.floor(Math.random() * data.length)];
  const flagEmoji = codeToEmoji(country.country_code);
  const allCountries = data.map((c) => c.name);
  return {
    question: `What country is this?`,
    answer: country.name,
    image: flagEmoji,
    options: getRandomOptions(country.name, allCountries, 4),
  };
}

function flagToCapital(): Question {
  const country = data[Math.floor(Math.random() * data.length)];
  const flagEmoji = codeToEmoji(country.country_code);
  const allCapitals = data.map((c) => c.capital);
  return {
    question: `What is the capital of this country?`,
    image: flagEmoji,
    answer: country.capital,
    options: getRandomOptions(country.capital, allCapitals, 4),
  };
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function sum(): Question {
  const a = randomInt(10);
  const b = randomInt(10);

  return {
    question: `${a} + ${b} = ?`,
    answer: (a + b).toString(),
  };
}

const categories = [sum, flagToCapital, flag, capital];
function getQuestion() {
  return categories[randomInt(4)]();
}

function normalise(a: string) {
  // Ignore case and diacritics.
  return a
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function sameString(a: string, b: string) {
  return normalise(a) === normalise(b);
}

export default function Home() {
  const [questionPair, setQuestionPair] = useState(getQuestion);
  const [points, setPoints] = useState(0);
  const [guess, setGuess] = useState<string>("");
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<"✅" | "❌" | string | undefined>(
    undefined
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGuess(event.target.value);
    },
    []
  );

  const timeoutRef = useRef<null | number>(null);

  const submitGuess = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    if (sameString(guess, questionPair.answer)) {
      setPoints((points) => points + 1);
      setResult("✅");
    } else {
      setPoints((points) => points - 1);
      setResult(`❌ ${questionPair.answer}`);
    }

    timeoutRef.current = window.setTimeout(() => {
      setResult(undefined);
    }, 2000);

    setQuestionPair(getQuestion);
    setGuess("");
  }, [guess, questionPair]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitGuess();
      }
    },
    [submitGuess]
  );

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center ">
        <div className="font-mono ">{questionPair.question}</div>
        <div className="text-3xl">{questionPair.image}</div>

        <input
          type="text"
          value={guess}
          className="border-green-300 border-1 font-mono"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        ></input>
        <div className="font-mono">
          {points}
          {result}
        </div>
        <div className="flex gap-5">
          <input
            type="text"
            value={username}
            className="border-gray-500 border-1 font-mono"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <button
            disabled={username === ""}
            onClick={() => submitScore({ score: points, username: username! })}
          >
            Submit Score
          </button>
        </div>
        <Link href={"/leaderboard"}>Leaderboard</Link>
      </main>
    </div>
  );
}

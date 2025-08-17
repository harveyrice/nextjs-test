import dynamic from "next/dynamic";
import { submitScore } from "./actions";
import { Quiz } from "./quix";

export default function Home(){
  return <>
    <Quiz submitScore={submitScore}/>
  </>
}
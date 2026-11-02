import { selfCheck } from "../src/features/chat/selfcheck";

const problems = selfCheck();

if (problems.length > 0) {
  throw new Error(`Chat : ${problems.length} problème(s)\n - ${problems.join("\n - ")}`);
}

console.log("Chat : les bases de connaissances sont valides.");
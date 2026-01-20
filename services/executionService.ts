
import { Language, ExecutionResult } from "../types";

export async function executeCode(
  language: Language, 
  code: string, 
  input: string = ""
): Promise<ExecutionResult> {
  // Simulate delay for code execution - reduced for faster response
  await new Promise(r => setTimeout(r, 400));

  if (code.trim() === "") {
    return { output: "No code to execute.", status: "SUCCESS" };
  }

  // Very basic syntax check simulation
  if (code.includes("<<<") || code.includes("???")) {
    return {
      output: "",
      error: `SyntaxError: Unexpected token in ${language} source code.`,
      status: "FAILED"
    };
  }

  let output = "";
  let memory = "12.4 MB";
  let time = "0.08s";

  switch (language) {
    case 'python':
      output = `Python 3.10.12\nHello, CodeStream Python!${input ? `\nInput: ${input}` : ''}\nProgram finished.`;
      time = "0.02s";
      memory = "4.2 MB";
      break;
    case 'java':
      output = `java version "14.0.2"\nHello from Java Main!${input ? `\nScanner: ${input}` : ''}\nSUCCESS.`;
      time = "0.15s";
      memory = "32.1 MB";
      break;
    case 'javascript':
      output = `Node.js v18.16.0\nRunning script...\nDone: Hello from Node!${input ? `\nInput: ${input}` : ''}`;
      time = "0.05s";
      memory = "14.8 MB";
      break;
    default:
      output = "Execution completed.";
  }

  return {
    output,
    time,
    memory,
    status: "SUCCESS"
  };
}

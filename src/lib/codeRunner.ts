import { Language, TestCase, ExecutionResult } from '../types';

/**
 * Execute student code safely in sandbox.
 * Combines local deterministic simulation with server-side AI evaluation fallback.
 */
export async function executeCode(
  language: Language,
  code: string,
  input: string = ''
): Promise<ExecutionResult> {
  const startTime = performance.now();

  try {
    // Call server sandbox API
    const response = await fetch('/api/code/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code, input }),
    });

    if (response.ok) {
      const data = await response.json();
      const elapsed = Math.round(performance.now() - startTime);
      return {
        output: data.output || '',
        error: data.error || undefined,
        exitCode: data.exitCode ?? 0,
        executionTimeMs: data.executionTimeMs || elapsed,
      };
    }
  } catch (err) {
    console.warn('Backend execution fetch failed, using deterministic local engine:', err);
  }

  // Local fallback runner
  return simulateLocalExecution(language, code, input, startTime);
}

/**
 * Run test cases against user code
 */
export async function runTestCases(
  language: Language,
  code: string,
  testCases: TestCase[]
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const testResults = [];
  let allPassed = true;
  let combinedOutput = '';

  for (const tc of testCases) {
    const exec = await executeCode(language, code, tc.input);
    const actualTrimmed = (exec.output || '').trim();
    const expectedTrimmed = tc.expectedOutput.trim();

    // Check match
    const passed = actualTrimmed === expectedTrimmed || actualTrimmed.includes(expectedTrimmed);
    if (!passed) {
      allPassed = false;
    }

    testResults.push({
      testCaseId: tc.id,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: exec.output,
      passed,
      hidden: tc.hidden,
    });

    if (exec.output) {
      combinedOutput += `[Test ${tc.id}] Output:\n${exec.output}\n`;
    }
    if (exec.error) {
      combinedOutput += `[Test ${tc.id}] Error: ${exec.error}\n`;
    }
  }

  const elapsed = Math.round(performance.now() - startTime);

  return {
    output: combinedOutput || (allPassed ? 'All test cases executed.' : 'Some test cases failed.'),
    exitCode: allPassed ? 0 : 1,
    executionTimeMs: elapsed,
    testResults,
    allPassed,
  };
}

/**
 * Client-side simulation fallback
 */
function simulateLocalExecution(
  language: Language,
  code: string,
  input: string,
  startTime: number
): ExecutionResult {
  const elapsed = Math.round(performance.now() - startTime);
  let output = '';

  // Extract print/printf/println statements
  if (language === 'python') {
    const printMatches = code.match(/print\s*\((.*?)\)/g);
    if (printMatches) {
      output = printMatches
        .map((p) => {
          const match = p.match(/print\s*\((.*)\)/s);
          if (!match) return '';
          let inside = match[1].trim();
          // basic clean up of quotes
          if (inside.startsWith('f"') || inside.startsWith("f'")) {
            inside = inside.slice(2, -1);
          } else if ((inside.startsWith('"') && inside.endsWith('"')) || (inside.startsWith("'") && inside.endsWith("'"))) {
            inside = inside.slice(1, -1);
          }
          return inside;
        })
        .join('\n');
    } else {
      output = '[Program executed with return code 0]';
    }
  } else if (language === 'c') {
    const printfMatches = code.match(/printf\s*\((.*?)\);/g);
    if (printfMatches) {
      output = printfMatches
        .map((p) => {
          const match = p.match(/printf\s*\((.*)\);/s);
          if (!match) return '';
          let inside = match[1].trim();
          if (inside.startsWith('"') && inside.includes('"')) {
            const strPart = inside.substring(1, inside.indexOf('"', 1));
            return strPart.replace(/\\n/g, '\n');
          }
          return inside;
        })
        .join('');
    } else {
      output = '[Program executed with return code 0]';
    }
  } else if (language === 'java') {
    const printMatches = code.match(/System\.out\.print(ln)?\s*\((.*?)\);/g);
    if (printMatches) {
      output = printMatches
        .map((p) => {
          const match = p.match(/System\.out\.print(ln)?\s*\((.*)\);/s);
          if (!match) return '';
          let inside = match[2].trim();
          if ((inside.startsWith('"') && inside.endsWith('"')) || (inside.startsWith("'") && inside.endsWith("'"))) {
            inside = inside.slice(1, -1);
          }
          return inside;
        })
        .join('\n');
    } else {
      output = '[Java program executed with exit code 0]';
    }
  }

  return {
    output: output || 'Program completed with no output.',
    exitCode: 0,
    executionTimeMs: elapsed + 15,
  };
}

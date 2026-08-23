import React, { useState } from 'react';
import { Language, ExecutionResult } from '../../types';
import { CodeEditor } from '../common/CodeEditor';
import { ConsoleOutput } from '../common/ConsoleOutput';
import { executeCode } from '../../lib/codeRunner';
import {
  Terminal,
  Cpu,
  Coffee,
  Play,
  RotateCcw,
  Sparkles,
  Bot,
  Layers,
  FileCode,
  Download,
  Share2,
} from 'lucide-react';

interface HandsOnSandboxViewProps {
  initialLanguage?: Language;
  onOpenAITutor: () => void;
}

export const HandsOnSandboxView: React.FC<HandsOnSandboxViewProps> = ({
  initialLanguage = 'python',
  onOpenAITutor,
}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const defaultTemplates: Record<
    Language,
    { id: string; name: string; code: string }[]
  > = {
    python: [
      {
        id: 'py-hello',
        name: '1. Hello World & Formatted Output',
        code: `# Python 3 Sandbox Playground
name = "Codify Student"
print(f"Hello, {name}! Welcome to the interactive Python IDE.")

for i in range(1, 6):
    print(f"Step {i}: Computing square -> {i**2}")
`,
      },
      {
        id: 'py-ds',
        name: '2. Data Structures & Comprehensions',
        code: `# List comprehensions & dictionary transformations
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens_squared = [x**2 for x in numbers if x % 2 == 0]

print("Original numbers:", numbers)
print("Evens squared:", evens_squared)

stats = {
    "total_items": len(numbers),
    "sum": sum(numbers),
    "max": max(numbers)
}
print("Computed stats dictionary:", stats)
`,
      },
      {
        id: 'py-oop',
        name: '3. Object-Oriented Programming',
        code: `class BankAccount:
    def __init__(self, owner: str, initial_balance: float = 0.0):
        self.owner = owner
        self.balance = initial_balance

    def deposit(self, amount: float):
        self.balance += amount
        print(f"[Deposit] +$ {amount:.2f} | New balance: $ {self.balance:.2f}")

    def withdraw(self, amount: float):
        if amount > self.balance:
            print(f"[Error] Insufficient funds to withdraw $ {amount:.2f}")
        else:
            self.balance -= amount
            print(f"[Withdraw] -$ {amount:.2f} | Remaining: $ {self.balance:.2f}")

account = BankAccount("Alice", 250.00)
account.deposit(100.00)
account.withdraw(50.00)
account.withdraw(400.00)
`,
      },
      {
        id: 'py-algo',
        name: '4. Binary Search Algorithm',
        code: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

sorted_list = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target_val = 23
index = binary_search(sorted_list, target_val)

print(f"List: {sorted_list}")
print(f"Binary Search for {target_val}: Found at index {index}")
`,
      },
    ],
    c: [
      {
        id: 'c-hello',
        name: '1. Hello World & Basic Types',
        code: `#include <stdio.h>

int main() {
    printf("Hello from C Systems Sandbox!\\n");
    
    int a = 15;
    int b = 4;
    printf("Arithmetic: %d + %d = %d\\n", a, b, a + b);
    printf("Division: %d / %d = %.2f\\n", a, b, (float)a / b);
    
    return 0;
}
`,
      },
      {
        id: 'c-pointers',
        name: '2. Pointers & Memory Dereference',
        code: `#include <stdio.h>

void swap(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}

int main() {
    int first = 42;
    int second = 99;

    printf("Before swap: first = %d, second = %d\\n", first, second);
    swap(&first, &second);
    printf("After swap:  first = %d, second = %d\\n", first, second);

    return 0;
}
`,
      },
      {
        id: 'c-struct',
        name: '3. Custom Structs & Arrays',
        code: `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[32];
    int age;
    float gpa;
} Student;

int main() {
    Student s1;
    strcpy(s1.name, "Alex Rivera");
    s1.age = 21;
    s1.gpa = 3.92;

    printf("Student Record:\\n");
    printf("Name: %s\\n", s1.name);
    printf("Age:  %d\\n", s1.age);
    printf("GPA:  %.2f\\n", s1.gpa);

    return 0;
}
`,
      },
    ],
    java: [
      {
        id: 'java-hello',
        name: '1. Hello World & Class Structure',
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java Developers!");
        
        for (int i = 1; i <= 5; i++) {
            System.out.println("Loop iteration #" + i);
        }
    }
}
`,
      },
      {
        id: 'java-oop',
        name: '2. Inheritance & Polymorphism',
        code: `abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    double area() { return Math.PI * radius * radius; }
}

class Rectangle extends Shape {
    private double width, height;
    public Rectangle(double w, double h) { this.width = w; this.height = h; }
    double area() { return width * height; }
}

public class Main {
    public static void main(String[] args) {
        Shape c = new Circle(5.0);
        Shape r = new Rectangle(4.0, 6.0);

        System.out.printf("Circle Area: %.2f%n", c.area());
        System.out.printf("Rectangle Area: %.2f%n", r.area());
    }
}
`,
      },
      {
        id: 'java-streams',
        name: '3. Modern Streams & Collections',
        code: `import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Grace", "Alan", "Ada", "Linus", "Guido");
        
        List<String> filtered = names.stream()
            .filter(n -> n.length() > 3)
            .map(String::toUpperCase)
            .sorted()
            .collect(Collectors.toList());

        System.out.println("Original: " + names);
        System.out.println("Processed: " + filtered);
    }
}
`,
      },
    ],
  };

  const [code, setCode] = useState(defaultTemplates[initialLanguage][0].code);

  const handleSelectLanguage = (newLang: Language) => {
    setLanguage(newLang);
    setCode(defaultTemplates[newLang][0].code);
    setResult(null);
  };

  const handleSelectTemplate = (templateCode: string) => {
    setCode(templateCode);
    setResult(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await executeCode(language, code, customInput);
      setResult(res);
    } catch (e: any) {
      setResult({
        output: '',
        error: e.message || 'Execution error',
        exitCode: 1,
      executionTimeMs: 0,
        allPassed: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownload = () => {
    const ext = language === 'python' ? 'py' : language === 'c' ? 'c' : 'java';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codify_sandbox.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Sandbox Header Control Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => handleSelectLanguage('python')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              language === 'python'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-yellow-400" />
            <span>Python 3</span>
          </button>

          <button
            onClick={() => handleSelectLanguage('c')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              language === 'c'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>C Language</span>
          </button>

          <button
            onClick={() => handleSelectLanguage('java')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              language === 'java'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-orange-400" />
            <span>Java Track</span>
          </button>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Templates:</span>
          <select
            onChange={(e) => {
              const selected = defaultTemplates[language].find((t) => t.id === e.target.value);
              if (selected) handleSelectTemplate(selected.code);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-indigo-500 font-medium"
          >
            {defaultTemplates[language].map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Utility Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Code Assistant</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Download source file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Console Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Code Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <CodeEditor
            language={language}
            code={code}
            onChange={setCode}
            onRun={handleRun}
            onReset={() => setCode(defaultTemplates[language][0].code)}
            isRunning={isRunning}
            height="460px"
          />
        </div>

        {/* Right: Console Output & Custom Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <ConsoleOutput
            result={result}
            isRunning={isRunning}
            onClear={() => setResult(null)}
            showInputTab={true}
            customInput={customInput}
            onCustomInputChange={setCustomInput}
          />

          {/* Quick Tips Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sandbox Tips</span>
            </div>
            <ul className="text-slate-400 space-y-1 text-[11px] leading-relaxed">
              <li>• Click <strong>Run Code</strong> anytime to test syntax and logic.</li>
              <li>• Use the <strong>Standard Input</strong> tab if your program uses <code className="text-indigo-300">input()</code> or <code className="text-indigo-300">scanf()</code>.</li>
              <li>• Open the <strong>AI Code Assistant</strong> to ask for refactoring advice or bug explanations.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

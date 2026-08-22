import { Lesson, Topic, Language } from '../types';

export const TOPICS: Topic[] = [
  // PYTHON TOPICS
  {
    id: 'py-basics',
    language: 'python',
    level: 'beginner',
    title: 'Python Fundamentals',
    description: 'Master syntax, variables, data types, and arithmetic operations.',
    iconName: 'Code',
    lessonIds: ['py-intro', 'py-vars', 'py-operators', 'py-io'],
  },
  {
    id: 'py-control',
    language: 'python',
    level: 'beginner',
    title: 'Control Flow & Logic',
    description: 'Conditionals, comparison operators, and boolean logic.',
    iconName: 'GitFork',
    lessonIds: ['py-conditionals', 'py-loops', 'py-functions'],
  },
  {
    id: 'py-data-structures',
    language: 'python',
    level: 'intermediate',
    title: 'Collections & Data Structures',
    description: 'Lists, Tuples, Dictionaries, Sets, and slicing techniques.',
    iconName: 'Layers',
    lessonIds: ['py-lists', 'py-dicts', 'py-strings'],
  },
  {
    id: 'py-oop',
    language: 'python',
    level: 'intermediate',
    title: 'Object-Oriented Programming',
    description: 'Classes, Objects, inheritance, and encapsulation.',
    iconName: 'Box',
    lessonIds: ['py-classes', 'py-inheritance', 'py-files'],
  },
  {
    id: 'py-advanced-topics',
    language: 'python',
    level: 'advanced',
    title: 'Advanced Python & Concurrency',
    description: 'Generators, Decorators, Asyncio, and Algorithms.',
    iconName: 'Zap',
    lessonIds: ['py-decorators', 'py-async', 'py-algos'],
  },

  // C TOPICS
  {
    id: 'c-basics',
    language: 'c',
    level: 'beginner',
    title: 'C Basics & Structure',
    description: 'Compilation model, structure of a C program, variables, and printf/scanf.',
    iconName: 'Cpu',
    lessonIds: ['c-intro', 'c-types', 'c-operators', 'c-io'],
  },
  {
    id: 'c-control',
    language: 'c',
    level: 'beginner',
    title: 'Control Flow & Functions',
    description: 'If-else statements, switch case, loops, and function prototypes.',
    iconName: 'GitFork',
    lessonIds: ['c-conditionals', 'c-loops', 'c-functions'],
  },
  {
    id: 'c-pointers-arrays',
    language: 'c',
    level: 'intermediate',
    title: 'Pointers & Memory Arrays',
    description: 'Pointer arithmetic, arrays, strings, and memory addresses.',
    iconName: 'Compass',
    lessonIds: ['c-arrays', 'c-pointers', 'c-strings'],
  },
  {
    id: 'c-structs-dynamic',
    language: 'c',
    level: 'intermediate',
    title: 'Structs & Dynamic Allocation',
    description: 'Structures, malloc, free, calloc, and file operations.',
    iconName: 'Database',
    lessonIds: ['c-structs', 'c-memory', 'c-files'],
  },
  {
    id: 'c-advanced-systems',
    language: 'c',
    level: 'advanced',
    title: 'Advanced C & Data Structures',
    description: 'Function pointers, bitwise manipulation, and custom Linked Lists.',
    iconName: 'ShieldAlert',
    lessonIds: ['c-linked-lists', 'c-bitwise', 'c-optimization'],
  },

  // JAVA TOPICS
  {
    id: 'java-basics',
    language: 'java',
    level: 'beginner',
    title: 'Java Core Fundamentals',
    description: 'JVM architecture, Class structure, main method, primitive types.',
    iconName: 'Coffee',
    lessonIds: ['java-intro', 'java-types', 'java-operators', 'java-io'],
  },
  {
    id: 'java-control',
    language: 'java',
    level: 'beginner',
    title: 'Control Flow & Methods',
    description: 'Conditionals, switch expressions, loops, and method overloading.',
    iconName: 'GitFork',
    lessonIds: ['java-conditionals', 'java-loops', 'java-methods'],
  },
  {
    id: 'java-oop-core',
    language: 'java',
    level: 'intermediate',
    title: 'OOP & Class Hierarchies',
    description: 'Encapsulation, inheritance, polymorphism, abstract classes & interfaces.',
    iconName: 'Package',
    lessonIds: ['java-classes', 'java-inheritance', 'java-interfaces', 'java-exceptions'],
  },
  {
    id: 'java-collections',
    language: 'java',
    level: 'intermediate',
    title: 'Collections & Generics',
    description: 'ArrayList, HashMap, HashSet, and Generic types.',
    iconName: 'ListFilter',
    lessonIds: ['java-collections-list', 'java-maps'],
  },
  {
    id: 'java-advanced-topics',
    language: 'java',
    level: 'advanced',
    title: 'Streams, Threads & Design Patterns',
    description: 'Lambdas, Stream API, multithreading, concurrency, and Design Patterns.',
    iconName: 'Sparkles',
    lessonIds: ['java-streams', 'java-threads', 'java-patterns'],
  },
];

export const LESSONS: Lesson[] = [
  // ==================== PYTHON LESSONS ====================
  {
    id: 'py-intro',
    language: 'python',
    level: 'beginner',
    topicId: 'py-basics',
    topicTitle: 'Python Fundamentals',
    title: 'Introduction to Python & First Program',
    summary: 'Discover Python philosophy, syntax simplicity, and write your first print statement.',
    estimatedMinutes: 10,
    order: 1,
    conceptContent: `### What is Python?
Python is a powerful, high-level, interpreted language created by Guido van Rossum. It is renowned for clean, English-like syntax and vast ecosystem across web development, data science, and AI.

\`\`\`python
# This is a comment in Python
print("Hello, Codify Student!")
\`\`\`

#### Key Highlights:
1. **Readable Code**: Python uses indentation (whitespace) rather than curly braces \`{}\`.
2. **Dynamically Typed**: You do not need to declare variable types explicitly.
3. **Batteries Included**: Comes with rich standard libraries ready out of the box.`,
    keyTakeaways: [
      'print() displays text to standard output.',
      'Comments start with the hash symbol (#).',
      'Python executes code sequentially from top to bottom.',
    ],
    interactiveExamples: [
      {
        id: 'py-intro-ex1',
        title: 'Custom Welcome Message',
        description: 'Experiment with printing multiple values and formatted strings.',
        initialCode: `name = "Alex"\nage = 20\nprint(f"Welcome to Codify, {name}! You are {age} years old.")\nprint("Let's master Python together!")`,
        expectedOutput: `Welcome to Codify, Alex! You are 20 years old.\nLet's master Python together!`,
        hints: ['You can use f-strings like f"Hello {variable}" for string interpolation.'],
        explanation: 'F-strings allow placing expressions directly inside strings enclosed in curly braces.',
      },
    ],
    quizQuestions: [
      {
        id: 'py-q1',
        question: 'Which built-in function is used to output data to the console in Python?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'console.log()' },
          { id: 'b', text: 'print()' },
          { id: 'c', text: 'System.out.println()' },
          { id: 'd', text: 'printf()' },
        ],
        correctAnswerId: 'b',
        explanation: 'In Python, print() is the built-in function for outputting text to the screen.',
      },
      {
        id: 'py-q2',
        question: 'Predict the output of the following code snippet:',
        type: 'predict-output',
        codeSnippet: `x = 10\ny = 5\nprint(x + y * 2)`,
        options: [
          { id: 'a', text: '30' },
          { id: 'b', text: '20' },
          { id: 'c', text: '25' },
          { id: 'd', text: '15' },
        ],
        correctAnswerId: 'b',
        explanation: 'Operator precedence executes multiplication first: 5 * 2 = 10, then 10 + 10 = 20.',
      },
    ],
    practiceExercise: {
      id: 'py-ex-intro',
      title: 'Greetings Generator',
      instruction: 'Write a Python program that defines `language = "Python"` and prints `"I love coding in Python!"`.',
      initialCode: `# Complete the program\nlanguage = "Python"\n# print your message here\n`,
      solutionCode: `language = "Python"\nprint(f"I love coding in {language}!")`,
      testCases: [
        {
          id: 'tc-1',
          input: '',
          expectedOutput: 'I love coding in Python!',
        },
      ],
      hint: 'Use the print function with f"I love coding in {language}!"',
      xpReward: 30,
    },
    xpReward: 50,
  },
  {
    id: 'py-vars',
    language: 'python',
    level: 'beginner',
    topicId: 'py-basics',
    topicTitle: 'Python Fundamentals',
    title: 'Variables, Data Types & Type Conversion',
    summary: 'Understand integers, floats, strings, booleans, and dynamic casting in Python.',
    estimatedMinutes: 12,
    order: 2,
    conceptContent: `### Python Data Types
In Python, variables are created when you assign a value to them.

- **int**: Whole numbers (e.g. \`42\`, \`-7\`)
- **float**: Decimal numbers (e.g. \`3.14159\`)
- **str**: Text enclosed in quotes (e.g. \`"Codify"\`)
- **bool**: \`True\` or \`False\`

\`\`\`python
score = 98          # int
accuracy = 95.5     # float
course = "Python"   # str
is_passed = True    # bool

# Type casting:
converted_score = float(score)  # 98.0
\`\`\``,
    keyTakeaways: [
      'type() function returns the class type of any object.',
      'Explicit conversion functions include int(), float(), str(), bool().',
      'Variable names are case-sensitive and must not start with numbers.',
    ],
    interactiveExamples: [
      {
        id: 'py-vars-ex1',
        title: 'Type Inspection & Casting',
        description: 'Check how Python handles automatic types and casting.',
        initialCode: `val_str = "250"\nval_num = int(val_str)\nresult = val_num + 50\nprint("Result:", result)\nprint("Type of result:", type(result).__name__)`,
        expectedOutput: `Result: 300\nType of result: int`,
        hints: ['int("250") converts a numeric string to an integer.'],
        explanation: 'Always cast string inputs before performing arithmetic operations.',
      },
    ],
    quizQuestions: [
      {
        id: 'py-v-q1',
        question: 'What is the data type of the variable `price = 19.99`?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'int' },
          { id: 'b', text: 'float' },
          { id: 'c', text: 'double' },
          { id: 'd', text: 'decimal' },
        ],
        correctAnswerId: 'b',
        explanation: 'Python uses float for all standard floating-point numbers.',
      },
    ],
    xpReward: 50,
  },
  {
    id: 'py-conditionals',
    language: 'python',
    level: 'beginner',
    topicId: 'py-control',
    topicTitle: 'Control Flow & Logic',
    title: 'Conditional Statements & Boolean Logic',
    summary: 'Control program execution flow using if, elif, else, and logical operators.',
    estimatedMinutes: 15,
    order: 3,
    conceptContent: `### Conditional Branching
Use \`if\`, \`elif\` (else if), and \`else\` to make decisions in code.

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Grade: {grade}")
\`\`\`

#### Logical Operators:
- \`and\`: True if both conditions are True
- \`or\`: True if at least one condition is True
- \`not\`: Reverses the boolean state`,
    keyTakeaways: [
      'Indentation is mandatory for defining block scope.',
      'Comparison operators include ==, !=, <, >, <=, >=.',
    ],
    interactiveExamples: [
      {
        id: 'py-cond-ex1',
        title: 'Discount Calculator',
        description: 'Calculate VIP discounts based on purchase amount.',
        initialCode: 'total = 120\nis_member = True\n\nif total > 100 and is_member:\n    discount = 0.20\nelif total > 50:\n    discount = 0.10\nelse:\n    discount = 0.0\n\nfinal_price = total * (1 - discount)\nprint(f"Discount: {discount * 100}%, Final: ${final_price:.2f}")',
        expectedOutput: `Discount: 20.0%, Final: $96.00`,
        hints: ['Combine boolean checks with the "and" operator.'],
        explanation: 'Because both total > 100 and is_member are True, the 20% discount branch executes.',
      },
    ],
    quizQuestions: [
      {
        id: 'py-c-q1',
        question: 'Which keyword is used in Python for "else if"?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'else if' },
          { id: 'b', text: 'elseif' },
          { id: 'c', text: 'elif' },
          { id: 'd', text: 'when' },
        ],
        correctAnswerId: 'c',
        explanation: 'Python uses the keyword "elif" for else-if branches.',
      },
    ],
    xpReward: 50,
  },
  {
    id: 'py-loops',
    language: 'python',
    level: 'beginner',
    topicId: 'py-control',
    topicTitle: 'Control Flow & Logic',
    title: 'Loops: While, For & Range',
    summary: 'Iterate through sequences and repeat actions with for loops, while loops, and range().',
    estimatedMinutes: 15,
    order: 4,
    conceptContent: `### Iteration in Python
Loops allow running a block of code multiple times.

#### The \`for\` loop:
\`\`\`python
for i in range(1, 6):
    print(f"Count: {i}")
\`\`\`

#### The \`while\` loop:
\`\`\`python
count = 3
while count > 0:
    print(f"Countdown: {count}")
    count -= 1
\`\`\`

#### Loop Controls:
- \`break\`: Exits the loop immediately.
- \`continue\`: Skips to the next iteration.`,
    keyTakeaways: [
      'range(start, stop, step) generates an immutable sequence of numbers.',
      'Always ensure while loops have an update condition to avoid infinite loops.',
    ],
    interactiveExamples: [
      {
        id: 'py-loop-ex1',
        title: 'Sum of Even Numbers',
        description: 'Sum all even numbers from 2 up to 10.',
        initialCode: `total = 0\nfor n in range(2, 11, 2):\n    total += n\n    print(f"Added {n}, running total = {total}")\nprint("Final sum:", total)`,
        expectedOutput: `Added 2, running total = 2\nAdded 4, running total = 6\nAdded 6, running total = 12\nAdded 8, running total = 20\nAdded 10, running total = 30\nFinal sum: 30`,
        hints: ['range(2, 11, 2) starts at 2, stops before 11, with step 2.'],
        explanation: 'Step 2 produces 2, 4, 6, 8, 10.',
      },
    ],
    quizQuestions: [
      {
        id: 'py-l-q1',
        question: 'What is the output of `list(range(1, 5))`?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: '[1, 2, 3, 4, 5]' },
          { id: 'b', text: '[1, 2, 3, 4]' },
          { id: 'c', text: '[0, 1, 2, 3, 4]' },
          { id: 'd', text: '[2, 3, 4, 5]' },
        ],
        correctAnswerId: 'b',
        explanation: 'range(start, stop) stops BEFORE the stop value, so range(1, 5) yields 1, 2, 3, 4.',
      },
    ],
    xpReward: 50,
  },
  {
    id: 'py-lists',
    language: 'python',
    level: 'intermediate',
    topicId: 'py-data-structures',
    topicTitle: 'Collections & Data Structures',
    title: 'Lists, Slicing & List Comprehensions',
    summary: 'Master dynamic arrays, indexing, slicing, methods, and elegant list comprehensions.',
    estimatedMinutes: 20,
    order: 5,
    conceptContent: `### Python Lists
Lists are ordered, mutable collections of items.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")

# Slicing: [start:stop:step]
subset = fruits[1:3]  # ['banana', 'cherry']

# List Comprehension:
squares = [x**2 for x in range(1, 6)]  # [1, 4, 9, 16, 25]
\`\`\``,
    keyTakeaways: [
      'Lists are indexed from 0. Negative indexes start from -1 at the end.',
      'List comprehensions offer a concise syntax for transforming data.',
    ],
    interactiveExamples: [
      {
        id: 'py-list-ex1',
        title: 'Filter Even Numbers with Comprehension',
        description: 'Square only even numbers in a given list.',
        initialCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8]\neven_squares = [n**2 for n in numbers if n % 2 == 0]\nprint("Even squares:", even_squares)`,
        expectedOutput: `Even squares: [4, 16, 36, 64]`,
        hints: ['Use the modulo operator `n % 2 == 0` in the if filter.'],
        explanation: 'The comprehension filters for even numbers and computes n**2.',
      },
    ],
    quizQuestions: [
      {
        id: 'py-lst-q1',
        question: 'Given `nums = [10, 20, 30, 40, 50]`, what does `nums[-1]` evaluate to?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: '10' },
          { id: 'b', text: '50' },
          { id: 'c', text: 'IndexError' },
          { id: 'd', text: '40' },
        ],
        correctAnswerId: 'b',
        explanation: 'Index -1 refers to the last element of the list, which is 50.',
      },
    ],
    xpReward: 60,
  },
  {
    id: 'py-classes',
    language: 'python',
    level: 'intermediate',
    topicId: 'py-oop',
    topicTitle: 'Object-Oriented Programming',
    title: 'Classes, Objects & __init__',
    summary: 'Build real-world objects using classes, constructors, methods, and attributes.',
    estimatedMinutes: 22,
    order: 6,
    conceptContent: `### Object-Oriented Programming (OOP)
A class is a blueprint for creating objects.

\`\`\`python
class Student:
    def __init__(self, name: str, xp: int = 0):
        self.name = name
        self.xp = xp

    def earn_xp(self, amount: int):
        self.xp += amount
        print(f"{self.name} gained {amount} XP! Total: {self.xp}")

student1 = Student("Elena", 100)
student1.earn_xp(50)
\`\`\``,
    keyTakeaways: [
      '__init__ is the initializer (constructor) method.',
      'self refers to the instance of the object being manipulated.',
    ],
    interactiveExamples: [
      {
        id: 'py-oop-ex1',
        title: 'Bank Account Class',
        description: 'Create a BankAccount class with deposit and withdraw methods.',
        initialCode: 'class BankAccount:\n    def __init__(self, owner: str, balance: float = 0.0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount: float):\n        self.balance += amount\n        return self.balance\n\nacc = BankAccount("Sarah", 500.0)\nacc.deposit(250.0)\nprint(f"Owner: {acc.owner}, Balance: ${acc.balance:.2f}")',
        expectedOutput: `Owner: Sarah, Balance: $750.00`,
        hints: ['Update self.balance inside the deposit method.'],
        explanation: 'Encapsulating data inside a class protects state and bundles logic cleanly.',
      },
    ],
    quizQuestions: [
      {
        id: 'py-cls-q1',
        question: 'What is the purpose of `self` in Python class methods?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'It imports global variables' },
          { id: 'b', text: 'It references the current instance of the class' },
          { id: 'c', text: 'It deletes the object' },
          { id: 'd', text: 'It creates a new thread' },
        ],
        correctAnswerId: 'b',
        explanation: '`self` represents the instance of the object, allowing access to attributes and methods.',
      },
    ],
    xpReward: 70,
  },

  // ==================== C LESSONS ====================
  {
    id: 'c-intro',
    language: 'c',
    level: 'beginner',
    topicId: 'c-basics',
    topicTitle: 'C Basics & Structure',
    title: 'Introduction to C & The Main Function',
    summary: 'Understand the C compilation lifecycle, header files, and standard I/O.',
    estimatedMinutes: 12,
    order: 1,
    conceptContent: `### Welcome to C Programming
C is a foundational procedural systems programming language created by Dennis Ritchie in 1972 at Bell Labs.

\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello from C on Codify!\\n");
    return 0;
}
\`\`\`

#### Anatomy of a C Program:
1. \`#include <stdio.h>\`: Preprocessor directive that imports standard input/output declarations.
2. \`int main()\`: The mandatory starting entry point of every C executable.
3. \`return 0;\`: Indicates successful program execution to the operating system.`,
    keyTakeaways: [
      'C is a compiled language that translates directly into machine code.',
      'Every statement in C must end with a semicolon (;).',
      'printf format specifiers include %d (int), %f (float), %c (char), %s (string).',
    ],
    interactiveExamples: [
      {
        id: 'c-intro-ex1',
        title: 'Formatted Output with printf',
        description: 'Print numbers and strings using format specifiers.',
        initialCode: `#include <stdio.h>\n\nint main() {\n    int studentId = 101;\n    float gpa = 3.92;\n    char grade = 'A';\n    \n    printf("Student ID: %d\\n", studentId);\n    printf("GPA: %.2f\\n", gpa);\n    printf("Grade: %c\\n", grade);\n    return 0;\n}`,
        expectedOutput: `Student ID: 101\nGPA: 3.92\nGrade: A`,
        hints: ['Use %.2f to print floats rounded to 2 decimal places.'],
        explanation: 'printf replaces each % specifier with the corresponding argument passed after the format string.',
      },
    ],
    quizQuestions: [
      {
        id: 'c-q1',
        question: 'Which header file is required to use the `printf()` function in C?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: '<stdlib.h>' },
          { id: 'b', text: '<stdio.h>' },
          { id: 'c', text: '<string.h>' },
          { id: 'd', text: '<math.h>' },
        ],
        correctAnswerId: 'b',
        explanation: '<stdio.h> contains declarations for standard input and output functions.',
      },
      {
        id: 'c-q2',
        question: 'What does a return value of 0 in the main() function signify?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Syntax error' },
          { id: 'b', text: 'Successful termination' },
          { id: 'c', text: 'Memory allocation failure' },
          { id: 'd', text: 'Infinite loop' },
        ],
        correctAnswerId: 'b',
        explanation: 'By Unix and C standards, returning 0 signals successful execution.',
      },
    ],
    xpReward: 50,
  },
  {
    id: 'c-pointers',
    language: 'c',
    level: 'intermediate',
    topicId: 'c-pointers-arrays',
    topicTitle: 'Pointers & Memory Arrays',
    title: 'Pointers, Memory Addresses & Dereferencing',
    summary: 'Master raw memory access, pointer variables, address-of (&) and dereference (*) operators.',
    estimatedMinutes: 25,
    order: 2,
    conceptContent: `### Understanding C Pointers
A pointer is a variable that stores the memory address of another variable.

- **Address-of Operator (\`&\`)**: Gets the memory location of a variable.
- **Dereference Operator (\`*\`)**: Accesses or modifies the value stored at that address.

\`\`\`c
#include <stdio.h>

int main() {
    int num = 42;
    int *ptr = &num; // ptr holds address of num

    printf("Value of num: %d\\n", num);
    printf("Address of num: %p\\n", (void*)ptr);
    printf("Dereferenced value: %d\\n", *ptr);

    *ptr = 100; // Modifies num directly!
    printf("New value of num: %d\\n", num);
    return 0;
}
\`\`\``,
    keyTakeaways: [
      'Pointers allow direct hardware and RAM interaction for maximum speed.',
      'Passing pointers to functions enables pass-by-reference in C.',
      'Always initialize pointers; uninitialized wild pointers can cause segmentation faults.',
    ],
    interactiveExamples: [
      {
        id: 'c-ptr-ex1',
        title: 'Swap Two Numbers using Pointers',
        description: 'Demonstrate pass-by-reference in C by swapping two integers in a function.',
        initialCode: `#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 10, y = 20;\n    printf("Before: x=%d, y=%d\\n", x, y);\n    swap(&x, &y);\n    printf("After: x=%d, y=%d\\n", x, y);\n    return 0;\n}`,
        expectedOutput: `Before: x=10, y=20\nAfter: x=20, y=10`,
        hints: ['Pass &x and &y to the function so it receives memory addresses.'],
        explanation: 'By dereferencing *a and *b inside swap, the original memory contents in main are swapped.',
      },
    ],
    quizQuestions: [
      {
        id: 'c-ptr-q1',
        question: 'Which operator is used to extract the memory address of a variable in C?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: '*' },
          { id: 'b', text: '&' },
          { id: 'c', text: '->' },
          { id: 'd', text: '%' },
        ],
        correctAnswerId: 'b',
        explanation: '& is the address-of operator.',
      },
    ],
    xpReward: 70,
  },
  {
    id: 'c-memory',
    language: 'c',
    level: 'intermediate',
    topicId: 'c-structs-dynamic',
    topicTitle: 'Structs & Dynamic Allocation',
    title: 'Dynamic Memory Allocation: malloc, calloc & free',
    summary: 'Allocate memory on the Heap during runtime and prevent memory leaks.',
    estimatedMinutes: 20,
    order: 3,
    conceptContent: `### Heap Memory Management
When array sizes are unknown at compile-time, allocate memory dynamically from the heap using \`<stdlib.h>\`.

- \`malloc(size)\`: Allocates uninitialized memory chunk.
- \`calloc(n, size)\`: Allocates zero-initialized memory.
- \`free(ptr)\`: Releases heap memory back to the OS.

\`\`\`c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*)malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }
    // Always free allocated memory!
    free(arr);
    arr = NULL;
    return 0;
}
\`\`\``,
    keyTakeaways: [
      'Every malloc/calloc call must have a corresponding free() call to avoid leaks.',
      'Check for NULL return values to ensure the OS had sufficient memory.',
    ],
    interactiveExamples: [
      {
        id: 'c-mem-ex1',
        title: 'Dynamic Array Allocation',
        description: 'Allocate an array of 5 integers, populate it, print, and free.',
        initialCode: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int size = 5;\n    int *arr = (int*)malloc(size * sizeof(int));\n    for (int i = 0; i < size; i++) {\n        arr[i] = (i + 1) * 10;\n    }\n    for (int i = 0; i < size; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n    free(arr);\n    return 0;\n}`,
        expectedOutput: `10 20 30 40 50 `,
        hints: ['Free pointer after usage.'],
        explanation: 'Dynamically allocated arrays act like regular arrays but live on the heap.',
      },
    ],
    quizQuestions: [
      {
        id: 'c-mem-q1',
        question: 'Which function is used to deallocate memory previously allocated by malloc()?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'delete()' },
          { id: 'b', text: 'free()' },
          { id: 'c', text: 'release()' },
          { id: 'd', text: 'clear()' },
        ],
        correctAnswerId: 'b',
        explanation: 'In C, free() returns heap memory back to the memory manager.',
      },
    ],
    xpReward: 75,
  },

  // ==================== JAVA LESSONS ====================
  {
    id: 'java-intro',
    language: 'java',
    level: 'beginner',
    topicId: 'java-basics',
    topicTitle: 'Java Core Fundamentals',
    title: 'Introduction to Java & The JVM',
    summary: 'Write Once, Run Anywhere: Learn Java architecture, main method, and class structure.',
    estimatedMinutes: 12,
    order: 1,
    conceptContent: `### Welcome to Java
Java is a versatile, object-oriented, class-based language built on the principle of **"Write Once, Run Anywhere" (WORA)** via the Java Virtual Machine (JVM).

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java on Codify!");
    }
}
\`\`\`

#### Core Concepts:
- **JDK**: Java Development Kit (compiler, debugger, tools).
- **JRE**: Java Runtime Environment (JVM + standard libraries).
- **JVM**: Executes compiled bytecode (\`.class\` files).`,
    keyTakeaways: [
      'Every Java application must have at least one class and a public static void main method.',
      'Java is strictly and statically typed.',
      'System.out.println() prints a line with a trailing newline.',
    ],
    interactiveExamples: [
      {
        id: 'java-intro-ex1',
        title: 'Variables & Math in Java',
        description: 'Declare variables, calculate circle area, and display formatted output.',
        initialCode: `public class Main {\n    public static void main(String[] args) {\n        String platform = "Codify";\n        int activeStudents = 15000;\n        double rating = 4.9;\n        \n        System.out.println("Platform: " + platform);\n        System.out.println("Active Learners: " + activeStudents);\n        System.out.println("Rating: " + rating + " / 5.0");\n    }\n}`,
        expectedOutput: `Platform: Codify\nActive Learners: 15000\nRating: 4.9 / 5.0`,
        hints: ['String concatenation uses the + operator.'],
        explanation: 'Java automatically converts primitives to strings during concatenation.',
      },
    ],
    quizQuestions: [
      {
        id: 'java-q1',
        question: 'What is the signature of the entry point method in a standard Java application?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'public void main(String[] args)' },
          { id: 'b', text: 'public static void main(String[] args)' },
          { id: 'c', text: 'static int main()' },
          { id: 'd', text: 'private static void Main()' },
        ],
        correctAnswerId: 'b',
        explanation: '`public static void main(String[] args)` is the standard signature required by the JVM.',
      },
    ],
    xpReward: 50,
  },
  {
    id: 'java-classes',
    language: 'java',
    level: 'intermediate',
    topicId: 'java-oop-core',
    topicTitle: 'OOP & Class Hierarchies',
    title: 'Classes, Objects, Encapsulation & Getters/Setters',
    summary: 'Build robust object-oriented software with private fields and public accessors.',
    estimatedMinutes: 20,
    order: 2,
    conceptContent: `### Object-Oriented Java
Java is deeply object-oriented. Data is organized into classes with access modifiers:
- \`public\`: Accessible from any other class.
- \`private\`: Accessible only within the declaring class (Encapsulation).
- \`protected\`: Accessible within same package or subclasses.

\`\`\`java
public class Course {
    private String title;
    private int enrolled;

    public Course(String title) {
        this.title = title;
        this.enrolled = 0;
    }

    public void enroll() {
        this.enrolled++;
    }

    public String getTitle() { return title; }
    public int getEnrolled() { return enrolled; }
}
\`\`\``,
    keyTakeaways: [
      'Encapsulation prevents direct modification of internal object state.',
      'Constructors share the exact name of the class with no return type.',
    ],
    interactiveExamples: [
      {
        id: 'java-oop-ex1',
        title: 'Student Profile Class',
        description: 'Instantiate Student objects, manage XP, and test getter methods.',
        initialCode: `class Student {\n    private String name;\n    private int xp;\n\n    public Student(String name, int initialXp) {\n        this.name = name;\n        this.xp = initialXp;\n    }\n\n    public void addXp(int amount) {\n        this.xp += amount;\n    }\n\n    public void display() {\n        System.out.println(name + " has " + xp + " XP!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s = new Student("Maya", 250);\n        s.addXp(150);\n        s.display();\n    }\n}`,
        expectedOutput: `Maya has 400 XP!`,
        hints: ['Initialize objects using the new keyword.'],
        explanation: 'Calling s.addXp(150) updates Maya\'s private xp field to 400.',
      },
    ],
    quizQuestions: [
      {
        id: 'java-oop-q1',
        question: 'Which access modifier hides class members from all outside classes?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'public' },
          { id: 'b', text: 'protected' },
          { id: 'c', text: 'private' },
          { id: 'd', text: 'default' },
        ],
        correctAnswerId: 'c',
        explanation: '`private` encapsulates fields so they cannot be accessed directly from external code.',
      },
    ],
    xpReward: 65,
  },
  {
    id: 'java-streams',
    language: 'java',
    level: 'advanced',
    topicId: 'java-advanced-topics',
    topicTitle: 'Streams, Threads & Design Patterns',
    title: 'Modern Java: Lambdas & Stream API',
    summary: 'Process collections declaratively with map, filter, reduce, and method references.',
    estimatedMinutes: 20,
    order: 3,
    conceptContent: `### Java Streams & Functional Pipelines
Introduced in Java 8, the Stream API enables functional programming patterns on collections without mutating the source.

\`\`\`java
import java.util.*;
import java.util.stream.*;

List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "Anna");
List<String> filtered = names.stream()
    .filter(n -> n.startsWith("A"))
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// ["ALICE", "ANNA"]
\`\`\``,
    keyTakeaways: [
      'Streams are lazy: intermediate operations (filter, map) execute only when a terminal operation (collect, forEach, reduce) is invoked.',
    ],
    interactiveExamples: [
      {
        id: 'java-stream-ex1',
        title: 'Sum of Even Squares with Streams',
        description: 'Filter even numbers and sum their squares using Stream API.',
        initialCode: `import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6);\n        int sum = nums.stream()\n                      .filter(n -> n % 2 == 0)\n                      .mapToInt(n -> n * n)\n                      .sum();\n        System.out.println("Sum of even squares: " + sum);\n    }\n}`,
        expectedOutput: `Sum of even squares: 56`,
        hints: ['Even numbers: 2, 4, 6. Squares: 4, 16, 36. Sum = 56.'],
        explanation: 'Functional stream operations allow writing concise, expressive collection processing.',
      },
    ],
    quizQuestions: [
      {
        id: 'java-str-q1',
        question: 'Which of the following is a terminal operation in Java Streams?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'filter()' },
          { id: 'b', text: 'map()' },
          { id: 'c', text: 'collect()' },
          { id: 'd', text: 'sorted()' },
        ],
        correctAnswerId: 'c',
        explanation: '`collect()` is a terminal operation that triggers stream computation and gathers results.',
      },
    ],
    xpReward: 80,
  },
];

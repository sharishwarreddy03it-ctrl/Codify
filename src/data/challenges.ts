import { CodingChallenge } from '../types';

export const CHALLENGES: CodingChallenge[] = [
  // 1. Two Sum / Pair Sum
  {
    id: 'two-sum',
    title: 'Two Sum Finder',
    language: 'python',
    category: 'algorithms',
    difficulty: 'Easy',
    description: `Given a list of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

Assume each input has exactly one solution, and you may not use the same element twice.`,
    inputFormat: 'Comma-separated integers followed by target integer on a new line (e.g. 2,7,11,15 \\n 9)',
    outputFormat: 'Indices [i, j] or "i j"',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6, so return [1, 2].',
      },
    ],
    starterCode: `def two_sum(nums, target):
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test execution:
print(two_sum([2, 7, 11, 15], 9))
print(two_sum([3, 2, 4], 6))
`,
    testCases: [
      {
        id: 'tc-1',
        input: '[2, 7, 11, 15], 9',
        expectedOutput: '[0, 1]',
      },
      {
        id: 'tc-2',
        input: '[3, 2, 4], 6',
        expectedOutput: '[1, 2]',
      },
      {
        id: 'tc-3',
        input: '[3, 3], 6',
        expectedOutput: '[0, 1]',
        hidden: true,
      },
    ],
    hints: [
      'A brute-force solution checks all pairs in O(n^2) time.',
      'You can achieve O(n) time using a hash map to store each number and its index.',
    ],
    xpReward: 100,
    tags: ['Hash Map', 'Arrays', 'Beginner Friendly'],
  },

  // 2. Reverse a String / Palindrome Check
  {
    id: 'palindrome-check',
    title: 'Valid Palindrome Checker',
    language: 'python',
    category: 'beginner',
    difficulty: 'Easy',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Write a function \`is_palindrome(s)\` that returns \`True\` or \`False\`.`,
    inputFormat: 'A string s',
    outputFormat: 'True or False',
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    examples: [
      {
        input: '"A man, a plan, a canal: Panama"',
        output: 'True',
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: '"race a car"',
        output: 'False',
        explanation: '"raceacar" is not a palindrome.',
      },
    ],
    starterCode: `def is_palindrome(s: str) -> bool:
    # Filter alphanumeric and lowercase
    cleaned = "".join(ch.lower() for ch in s if ch.isalnum())
    return cleaned == cleaned[::-1]

print(is_palindrome("A man, a plan, a canal: Panama"))
print(is_palindrome("race a car"))
`,
    testCases: [
      {
        id: 'tc-1',
        input: 'A man, a plan, a canal: Panama',
        expectedOutput: 'True',
      },
      {
        id: 'tc-2',
        input: 'race a car',
        expectedOutput: 'False',
      },
      {
        id: 'tc-3',
        input: ' ',
        expectedOutput: 'True',
        hidden: true,
      },
    ],
    hints: ['Use Python string slicing [::-1] or two pointers meeting in the middle.'],
    xpReward: 75,
    tags: ['Strings', 'Two Pointers'],
  },

  // 3. C: Reverse an Array In-Place
  {
    id: 'c-reverse-array',
    title: 'In-Place Array Reversal',
    language: 'c',
    category: 'data-structures',
    difficulty: 'Medium',
    description: `In C, write a function \`void reverseArray(int *arr, int size)\` that reverses an array of integers in-place without using extra memory allocation.`,
    inputFormat: 'An array of integers and its size',
    outputFormat: 'Array printed in reversed order',
    constraints: ['1 <= size <= 1000', 'Space Complexity: O(1)'],
    examples: [
      {
        input: '[1, 2, 3, 4, 5], size = 5',
        output: '5 4 3 2 1',
      },
    ],
    starterCode: `#include <stdio.h>

void reverseArray(int *arr, int size) {
    int start = 0;
    int end = size - 1;
    while (start < end) {
        int temp = arr[start];
        arr[start] = arr[end];
        arr[end] = temp;
        start++;
        end--;
    }
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int size = 5;
    
    reverseArray(arr, size);
    
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}
`,
    testCases: [
      {
        id: 'tc-1',
        input: '1 2 3 4 5',
        expectedOutput: '5 4 3 2 1 ',
      },
    ],
    hints: ['Use two pointers (start and end) and swap elements until they cross.'],
    xpReward: 120,
    tags: ['Pointers', 'Arrays', 'Memory Management'],
  },

  // 4. Java: Longest Substring Without Repeating Characters
  {
    id: 'java-longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    language: 'java',
    category: 'interview',
    difficulty: 'Medium',
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    inputFormat: 'String s',
    outputFormat: 'Integer representing maximum length',
    constraints: ['0 <= s.length <= 5 * 10^4'],
    examples: [
      {
        input: '"abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: '"bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
    ],
    starterCode: `import java.util.*;

public class Main {
    public static int lengthOfLongestSubstring(String s) {
        int n = s.length();
        int maxLength = 0;
        Map<Character, Integer> charMap = new HashMap<>();
        
        for (int right = 0, left = 0; right < n; right++) {
            char current = s.charAt(right);
            if (charMap.containsKey(current)) {
                left = Math.max(charMap.get(current) + 1, left);
            }
            charMap.put(current, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb"));
        System.out.println(lengthOfLongestSubstring("bbbbb"));
        System.out.println(lengthOfLongestSubstring("pwwkew"));
    }
}
`,
    testCases: [
      {
        id: 'tc-1',
        input: 'abcabcbb',
        expectedOutput: '3\n1\n3',
      },
    ],
    hints: ['Use the Sliding Window technique with two pointers (left and right).', 'A HashMap tracks the last seen position of each character.'],
    xpReward: 150,
    tags: ['Sliding Window', 'HashMap', 'String'],
  },

  // 5. Python: Fibonacci Sequence Memoization
  {
    id: 'py-fibonacci',
    title: 'Fast Fibonacci with Memoization',
    language: 'python',
    category: 'intermediate',
    difficulty: 'Easy',
    description: `Write a function \`fib(n)\` that computes the nth Fibonacci number efficiently using dynamic programming or memoization.
    
Fib(0) = 0, Fib(1) = 1, Fib(n) = Fib(n-1) + Fib(n-2).`,
    inputFormat: 'Integer n',
    outputFormat: 'Integer Fib(n)',
    constraints: ['0 <= n <= 50'],
    examples: [
      {
        input: 'n = 10',
        output: '55',
      },
      {
        input: 'n = 20',
        output: '6765',
      },
    ],
    starterCode: `def fib(n: int, memo={}) -> int:
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

print(fib(10))
print(fib(20))
`,
    testCases: [
      {
        id: 'tc-1',
        input: '10',
        expectedOutput: '55\n6765',
      },
    ],
    hints: ['Standard recursion takes O(2^n) which is too slow. Use memoization for O(n) runtime.'],
    xpReward: 90,
    tags: ['Dynamic Programming', 'Recursion', 'Math'],
  },

  // 6. C: Binary Search Implementation
  {
    id: 'c-binary-search',
    title: 'Binary Search in Sorted Array',
    language: 'c',
    category: 'algorithms',
    difficulty: 'Easy',
    description: `Given a sorted array of \`n\` integers and a \`target\` value, return the index of \`target\` in the array. If target does not exist, return \`-1\`.`,
    inputFormat: 'Array, size, target',
    outputFormat: 'Index or -1',
    constraints: ['1 <= n <= 10^4', 'Time Complexity: O(log n)'],
    examples: [
      {
        input: 'arr = [-1, 0, 3, 5, 9, 12], target = 9',
        output: '4',
      },
    ],
    starterCode: `#include <stdio.h>

int binarySearch(int arr[], int size, int target) {
    int low = 0, high = size - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {-1, 0, 3, 5, 9, 12};
    int size = 6;
    printf("%d\\n", binarySearch(arr, size, 9));
    printf("%d\\n", binarySearch(arr, size, 2));
    return 0;
}
`,
    testCases: [
      {
        id: 'tc-1',
        input: 'target=9, target=2',
        expectedOutput: '4\n-1',
      },
    ],
    hints: ['Calculate mid = low + (high - low) / 2 to avoid integer overflow.'],
    xpReward: 100,
    tags: ['Binary Search', 'Algorithms', 'Arrays'],
  },

  // 7. Java: Merge Interval Lists
  {
    id: 'java-merge-intervals',
    title: 'Merge Overlapping Intervals',
    language: 'java',
    category: 'real-world',
    difficulty: 'Hard',
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    inputFormat: 'List of intervals',
    outputFormat: 'Merged intervals',
    constraints: ['1 <= intervals.length <= 10^4'],
    examples: [
      {
        input: '[[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
      },
    ],
    starterCode: `import java.util.*;

public class Main {
    public static int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        
        // Sort by starting time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        
        List<int[]> result = new ArrayList<>();
        int[] currentInterval = intervals[0];
        result.add(currentInterval);
        
        for (int[] interval : intervals) {
            int currentEnd = currentInterval[1];
            int nextStart = interval[0];
            int nextEnd = interval[1];
            
            if (currentEnd >= nextStart) {
                currentInterval[1] = Math.max(currentEnd, nextEnd);
            } else {
                currentInterval = interval;
                result.add(currentInterval);
            }
        }
        
        return result.toArray(new int[result.size()][]);
    }

    public static void main(String[] args) {
        int[][] intervals = {{1,3}, {2,6}, {8,10}, {15,18}};
        int[][] merged = merge(intervals);
        System.out.print("[");
        for (int i = 0; i < merged.length; i++) {
            System.out.print("[" + merged[i][0] + "," + merged[i][1] + "]" + (i < merged.length - 1 ? "," : ""));
        }
        System.out.println("]");
    }
}
`,
    testCases: [
      {
        id: 'tc-1',
        input: '[[1,3],[2,6],[8,10],[15,18]]',
        expectedOutput: '[[1,6],[8,10],[15,18]]',
      },
    ],
    hints: ['Sort intervals first by start time so overlapping candidates are adjacent.'],
    xpReward: 200,
    tags: ['Sorting', 'Intervals', 'Real-world Project'],
  },
];

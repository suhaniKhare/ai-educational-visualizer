const dsa = {
  id: "dsa",
  title: "Data Structures & Algorithms",
  description:
    "Learn and visualize fundamental data structures and algorithms through interactive simulations.",
  icon: "Database",

  topics: [
    {
      id: "array",
      title: "Array",
      description:
        "Visualize array operations like insertion, deletion, searching, and traversal.",
      visualizer: "array",
      difficulty: "Beginner",
    },

    {
      id: "linked-list",
      title: "Linked List",
      description:
        "Understand nodes, pointers, insertion, deletion, and traversal in linked lists.",
      visualizer: "linked-list",
      difficulty: "Beginner",
    },

    {
      id: "stack",
      title: "Stack",
      description:
        "Explore LIFO operations including push, pop, and peek with an interactive stack.",
      visualizer: "stack",
      difficulty: "Beginner",
    },

    {
      id: "queue",
      title: "Queue",
      description:
        "Visualize FIFO operations such as enqueue, dequeue, and peek.",
      visualizer: "queue",
      difficulty: "Beginner",
    },

    {
      id: "tree",
      title: "Tree",
      description:
        "Explore binary search trees, insertion, searching, and tree traversals.",
      visualizer: "tree",
      difficulty: "Intermediate",
    },

    {
      id: "graph",
      title: "Graph",
      description:
        "Visualize graph nodes, edges, BFS, DFS, and graph traversal.",
      visualizer: "graph",
      difficulty: "Intermediate",
    },

    {
      id: "dp",
      title: "Dynamic Programming",
      description:
        "Understand dynamic programming using problems like Fibonacci and 0/1 Knapsack.",
      visualizer: "dp",
      difficulty: "Advanced",
    },
  ],
};

export default dsa;
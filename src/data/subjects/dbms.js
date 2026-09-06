const dbms = {
  id: "dbms",

  title: "Database Management Systems (DBMS)",

  description:
    "Explore core database concepts through interactive query execution, normalization, and B+ tree indexing visualizers.",

  icon: "Database",

  topics: [
    {
      id: "sql",
      title: "SQL Query Visualizer",
      description:
        "See how SQL queries process, scan, filter, and project data step by step.",
      category: "Query Processing",
      difficulty: "Intermediate",
      visualizer: "sql",
    },

    {
      id: "normalization",
      title: "Normalization Visualizer",
      description:
        "Understand 1NF, 2NF, and 3NF database normalization step by step with functional dependencies.",
      category: "Database Design",
      difficulty: "Intermediate",
      visualizer: "normalization",
    },

    {
      id: "indexing",
      title: "Indexing / B+ Tree Visualizer",
      description:
        "Compare full table scans vs indexed B+ tree search and observe node insertion & splits.",
      category: "Storage & Indexing",
      difficulty: "Advanced",
      visualizer: "indexing",
    },
  ],
};

export default dbms;

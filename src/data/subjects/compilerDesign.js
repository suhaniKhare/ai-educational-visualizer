const compilerDesign = {
  id: "compiler-design",

  title: "Compiler Design",

  description:
    "Explore compiler fundamentals through interactive lexical analysis, syntax analysis, and intermediate code generation visualizers.",

  icon: "Code2",

  topics: [
    {
      id: "lexical-analysis",
      title: "Lexical Analysis Visualizer",
      description:
        "See how a compiler breaks source code into tokens such as keywords, identifiers, operators, literals, and symbols.",
      category: "Lexical Analysis",
      difficulty: "Beginner",
      visualizer: "lexical-analysis",
    },

    {
      id: "syntax-analysis",
      title: "Syntax Analysis Visualizer",
      description:
        "Visualize grammar derivation and parse expressions step by step using a simple context-free grammar.",
      category: "Syntax Analysis",
      difficulty: "Intermediate",
      visualizer: "syntax-analysis",
    },

    {
      id: "intermediate-code",
      title: "Intermediate Code Generation",
      description:
        "Convert arithmetic expressions into three-address code and visualize the generation of temporary variables.",
      category: "Intermediate Code",
      difficulty: "Intermediate",
      visualizer: "intermediate-code",
    },
  ],
};

export default compilerDesign;
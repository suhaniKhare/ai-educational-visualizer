const computerGraphics = {
  id: "computer-graphics",

  title: "Computer Graphics",

  description:
    "Explore graphics concepts through interactive algorithms, animations, and visual simulations.",

  icon: "Palette",

  topics: [
    {
      id: "dda-line-drawing",
      title: "DDA Line Drawing",
      description:
        "Visualize how the DDA algorithm generates a line pixel by pixel.",

      category: "Line Drawing",

      difficulty: "Easy",

      visualizer: "dda",
    },

    {
      id: "bresenham-line-drawing",
      title: "Bresenham Line Drawing",
      description:
        "Understand how Bresenham's algorithm efficiently selects pixels using integer calculations.",

      category: "Line Drawing",

      difficulty: "Medium",

      visualizer: "bresenham",
    },

    {
      id: "2d-transformations",
      title: "2D Transformations",
      description:
        "Interact with translation, rotation, scaling, and other geometric transformations.",

      category: "Transformations",

      difficulty: "Medium",

      visualizer: "2d-transformations",
    },
  ],
};

export default computerGraphics;
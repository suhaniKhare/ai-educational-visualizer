const computerNetworks = {
  id: "computer-networks",

  title: "Computer Networks (CN)",

  description:
    "Explore core networking concepts through interactive OSI model, TCP handshake, and IP subnetting visualizers.",

  icon: "Network",

  topics: [
    {
      id: "osi-model",
      title: "OSI Model Visualizer",
      description:
        "Understand the seven OSI layers and visualize how data moves through encapsulation and decapsulation.",
      category: "Network Architecture",
      difficulty: "Beginner",
      visualizer: "osi-model",
    },

    {
      id: "tcp-handshake",
      title: "TCP 3-Way Handshake",
      description:
        "Visualize SYN, SYN-ACK, and ACK messages to understand how TCP establishes a reliable connection.",
      category: "Transport Layer",
      difficulty: "Intermediate",
      visualizer: "tcp-handshake",
    },

    {
      id: "subnetting",
      title: "IP Addressing & Subnetting",
      description:
        "Calculate network address, broadcast address, usable hosts, and visualize IPv4 subnet structure.",
      category: "Network Layer",
      difficulty: "Intermediate",
      visualizer: "subnetting",
    },
  ],
};

export default computerNetworks;
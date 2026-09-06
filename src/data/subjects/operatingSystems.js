const operatingSystems = {
  id: "operating-systems",

  title: "Operating Systems (OS)",

  description:
    "Explore core operating system concepts through interactive CPU scheduling, page replacement memory management, and process synchronization visualizers.",

  icon: "Monitor",

  topics: [
    {
      id: "cpu-scheduling",
      title: "CPU Scheduling Visualizer",
      description:
        "Visualize FCFS, SJF, SRTF, Round Robin, and Priority scheduling algorithms with interactive Gantt charts and ready queues.",
      category: "Process Management",
      difficulty: "Intermediate",
      visualizer: "cpu-scheduling",
    },

    {
      id: "page-replacement",
      title: "Page Replacement Visualizer",
      description:
        "Observe virtual memory management and page fault rates using FIFO, LRU, and Optimal page replacement algorithms.",
      category: "Memory Management",
      difficulty: "Intermediate",
      visualizer: "page-replacement",
    },

    {
      id: "process-synchronization",
      title: "Process Synchronization Visualizer",
      description:
        "Understand critical sections, semaphores, mutex locks, and the producer-consumer problem with interactive buffers.",
      category: "Concurrency & Sync",
      difficulty: "Advanced",
      visualizer: "process-synchronization",
    },
  ],
};

export default operatingSystems;

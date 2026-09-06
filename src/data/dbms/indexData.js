export const initialIndexRecords = [
  { id: 10, name: "Alice", department: "IT", salary: 50000 },
  { id: 20, name: "Bob", department: "HR", salary: 45000 },
  { id: 30, name: "Charlie", department: "IT", salary: 70000 },
  { id: 40, name: "Diana", department: "Sales", salary: 60000 },
  { id: 50, name: "Evan", department: "IT", salary: 55000 },
  { id: 60, name: "Fiona", department: "HR", salary: 48000 },
  { id: 70, name: "George", department: "Sales", salary: 75000 },
  { id: 80, name: "Hannah", department: "IT", salary: 65000 },
];

export const sampleBPlusTree = {
  id: "root",
  isLeaf: false,
  keys: [40, 70],
  children: [
    {
      id: "leaf1",
      isLeaf: true,
      keys: [10, 20, 30],
      records: [
        { id: 10, name: "Alice" },
        { id: 20, name: "Bob" },
        { id: 30, name: "Charlie" },
      ],
    },
    {
      id: "leaf2",
      isLeaf: true,
      keys: [40, 50, 60],
      records: [
        { id: 40, name: "Diana" },
        { id: 50, name: "Evan" },
        { id: 60, name: "Fiona" },
      ],
    },
    {
      id: "leaf3",
      isLeaf: true,
      keys: [70, 80],
      records: [
        { id: 70, name: "George" },
        { id: 80, name: "Hannah" },
      ],
    },
  ],
};

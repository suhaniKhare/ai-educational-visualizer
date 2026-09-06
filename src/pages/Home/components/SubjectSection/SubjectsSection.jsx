import {
  Code2,
  Database,
  GitBranch,
  Monitor,
  Network,
  Palette,
} from "lucide-react";

import "./SubjectsSection.css";

const subjects = [
  {
    id: "computer-graphics",
    title: "Computer Graphics",
    description: "Understand graphics algorithms through visual animations.",
    icon: Palette,
  },
  {
    id: "operating-systems",
    title: "Operating Systems",
    description: "Visualize processes, memory, scheduling, and more.",
    icon: Monitor,
  },
  {
    id: "dbms",
    title: "DBMS",
    description: "Explore databases, queries, indexing, and relationships.",
    icon: Database,
  },
  {
    id: "dsa",
    title: "Data Structures",
    description: "See how arrays, stacks, queues, trees, and graphs work.",
    icon: GitBranch,
  },
  {
    id: "computer-networks",
    title: "Computer Networks",
    description: "Understand networking concepts through visual simulations.",
    icon: Network,
  },
  {
    id: "compiler-design",
    title: "Compiler Design",
    description: "Visualize lexical analysis, parsing, and compilation.",
    icon: Code2,
  },
];

function SubjectsSection() {
  return (
    <section id="subjects" className="subjects-section">
      <div className="subjects-header">
        <span className="subjects-label">EXPLORE SUBJECTS</span>

        <h2>
          Learn by <span>seeing</span>, not just reading.
        </h2>

        <p>
          Choose a subject and explore complex computer science concepts through
          interactive visualizations.
        </p>
      </div>

      <div className="subjects-grid">
        {subjects.map((subject) => {
          const Icon = subject.icon;

          return (
            <div className="subject-card" key={subject.title}>
              <div className="subject-icon">
                <Icon size={24} />
              </div>

              <h3>{subject.title}</h3>

              <p>{subject.description}</p>

              <button
                className="subject-link"
                onClick={() => {
                  window.location.href = `/subject/${subject.id}`;
                }}
              >
                Explore →
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SubjectsSection;

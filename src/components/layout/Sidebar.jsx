import {
  ChevronRight,
  Database,
  GitBranch,
  Home,
  Monitor,
  Network,
  Palette,
} from "lucide-react";

import "./Sidebar.css";

const subjects = [
  {
    id: "computer-graphics",
    name: "Computer Graphics",
    icon: Palette,
  },
  {
    id: "operating-systems",
    name: "Operating Systems",
    icon: Monitor,
  },
  {
    id: "dbms",
    name: "DBMS",
    icon: Database,
  },
  {
    id: "data-structures",
    name: "Data Structures",
    icon: GitBranch,
  },
  {
    id: "computer-networks",
    name: "Computer Networks",
    icon: Network,
  },
  {
    id: "compiler-design",
    name: "Compiler Design",
    icon: GitBranch,
  },
];

function Sidebar() {
  const currentPath = window.location.pathname;
  const isHome = currentPath === "/";

  return (
    <aside className="sidebar">
      {/* Home */}
      <div className="sidebar__section">
        <p className="sidebar__label">MAIN</p>

        <button
          className={`sidebar__item ${isHome ? "sidebar__item--active" : ""}`}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <Home size={18} />
          <span>Home</span>
        </button>
      </div>

      {/* Subjects */}
      <div className="sidebar__section">
        <p className="sidebar__label">SUBJECTS</p>

        <nav className="sidebar__navigation">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            const isActive = currentPath.includes(subject.id);

            return (
              <button
                key={subject.id}
                className={`sidebar__item ${isActive ? "sidebar__item--active" : ""}`}
                onClick={() => {
                  window.location.href = `/subject/${subject.id}`;
                }}
              >
                <Icon size={18} />

                <span>{subject.name}</span>

                <ChevronRight className="sidebar__arrow" size={15} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Information */}
      <div className="sidebar__footer">
        <div className="sidebar__footer-icon">✦</div>

        <div>
          <p className="sidebar__footer-title">Visual Learning</p>
          <p className="sidebar__footer-text">
            Explore concepts interactively
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
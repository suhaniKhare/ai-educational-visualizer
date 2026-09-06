import computerGraphics from "../../data/subjects/computerGraphics";
import dbms from "../../data/subjects/dbms";
import operatingSystems from "../../data/subjects/operatingSystems";

import "./Subject.css";

function Subject({ subjectData, subjectId }) {
  const path = window.location.pathname;

  const currentSubject =
    subjectData ||
    (path.includes("dbms")
      ? dbms
      : path.includes("operating-systems")
      ? operatingSystems
      : computerGraphics);

  const currentSubjectId =
    subjectId ||
    (path.includes("dbms")
      ? "dbms"
      : path.includes("operating-systems")
      ? "operating-systems"
      : "computer-graphics");

  return (
    <main className="subject-page">
      <section className="subject-header">
        <span className="subject-header__label">SUBJECT</span>

        <h1 className="subject-header__title">{currentSubject.title}</h1>

        <p className="subject-header__description">{currentSubject.description}</p>
      </section>

      <section className="subject-topics">
        <div className="subject-topics__header">
          <span>EXPLORE TOPICS</span>

          <h2>
            Choose a concept to <strong>visualize</strong>
          </h2>
        </div>

        <div className="subject-topics__grid">
          {currentSubject.topics &&
            currentSubject.topics.map((topic, index) => (
              <article className="topic-card" key={topic.id}>
                <div className="topic-card__number">0{index + 1}</div>

                <div className="topic-card__content">
                  <span className="topic-card__category">{topic.category}</span>

                  <h3>{topic.title}</h3>

                  <p>{topic.description}</p>

                  <div className="topic-card__footer">
                    <span>Difficulty: {topic.difficulty}</span>

                    <button
                      onClick={() => {
                        window.location.href = `/subject/${currentSubjectId}/${topic.visualizer}`;
                      }}
                    >
                      Explore →
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}

export default Subject;

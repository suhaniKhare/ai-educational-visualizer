export const normalizationData = {
  unf: {
    title: "UNF (Unnormalized Form)",
    description: "Contains repeating groups and multi-valued attributes in a single record.",
    problem: "Multi-valued attributes, extreme redundancy, anomalies.",
    tables: [
      {
        tableName: "STUDENT_COURSE_UNF",
        columns: ["student_id", "student_name", "courses (course_id, course_name, teacher, phone)"],
        rows: [
          {
            student_id: 101,
            student_name: "Rahul",
            courses: "C101 (DBMS, Dr. Sharma, 9876543210), C102 (OS, Dr. Verma, 9876543211)",
          },
          {
            student_id: 102,
            student_name: "Priya",
            courses: "C101 (DBMS, Dr. Sharma, 9876543210), C103 (CN, Dr. Gupta, 9876543212)",
          },
        ],
      },
    ],
  },

  nf1: {
    title: "1NF (First Normal Form)",
    description: "Eliminated repeating groups. All column values are now atomic.",
    problem: "Partial Dependency: Non-prime attributes depend on part of composite key (student_id, course_id).",
    primaryKey: "(student_id, course_id)",
    tables: [
      {
        tableName: "STUDENT_COURSE_1NF",
        columns: ["student_id", "student_name", "course_id", "course_name", "teacher", "teacher_phone", "grade"],
        rows: [
          { student_id: 101, student_name: "Rahul", course_id: "C101", course_name: "DBMS", teacher: "Dr. Sharma", teacher_phone: "9876543210", grade: "A" },
          { student_id: 101, student_name: "Rahul", course_id: "C102", course_name: "OS", teacher: "Dr. Verma", teacher_phone: "9876543211", grade: "B" },
          { student_id: 102, student_name: "Priya", course_id: "C101", course_name: "DBMS", teacher: "Dr. Sharma", teacher_phone: "9876543210", grade: "A+" },
          { student_id: 102, student_name: "Priya", course_id: "C103", course_name: "CN", teacher: "Dr. Gupta", teacher_phone: "9876543212", grade: "A" },
        ],
      },
    ],
    dependencies: [
      { lhs: "student_id", rhs: "student_name", type: "Partial Dependency", color: "#f472b6" },
      { lhs: "course_id", rhs: "course_name, teacher, teacher_phone", type: "Partial Dependency", color: "#f472b6" },
      { lhs: "(student_id, course_id)", rhs: "grade", type: "Full Dependency", color: "#34d399" },
    ],
  },

  nf2: {
    title: "2NF (Second Normal Form)",
    description: "Eliminated partial dependencies by decomposing into separate tables for Student, Course, and Enrollment.",
    problem: "Transitive Dependency: Non-prime attribute (teacher_phone) depends on non-prime attribute (teacher).",
    tables: [
      {
        tableName: "STUDENT",
        columns: ["student_id (PK)", "student_name"],
        rows: [
          { student_id: 101, student_name: "Rahul" },
          { student_id: 102, student_name: "Priya" },
        ],
      },
      {
        tableName: "COURSE",
        columns: ["course_id (PK)", "course_name", "teacher", "teacher_phone"],
        rows: [
          { course_id: "C101", course_name: "DBMS", teacher: "Dr. Sharma", teacher_phone: "9876543210" },
          { course_id: "C102", course_name: "OS", teacher: "Dr. Verma", teacher_phone: "9876543211" },
          { course_id: "C103", course_name: "CN", teacher: "Dr. Gupta", teacher_phone: "9876543212" },
        ],
      },
      {
        tableName: "ENROLLMENT",
        columns: ["student_id (FK)", "course_id (FK)", "grade"],
        rows: [
          { student_id: 101, course_id: "C101", grade: "A" },
          { student_id: 101, course_id: "C102", grade: "B" },
          { student_id: 102, course_id: "C101", grade: "A+" },
          { student_id: 102, course_id: "C103", grade: "A" },
        ],
      },
    ],
    dependencies: [
      { lhs: "teacher", rhs: "teacher_phone", type: "Transitive Dependency", color: "#fbbf24" },
    ],
  },

  nf3: {
    title: "3NF (Third Normal Form)",
    description: "Eliminated transitive dependencies. Database schema is now fully normalized into 4 clean tables!",
    problem: "None! Database is free from update, insert, and delete anomalies.",
    tables: [
      {
        tableName: "STUDENT",
        columns: ["student_id (PK)", "student_name"],
        rows: [
          { student_id: 101, student_name: "Rahul" },
          { student_id: 102, student_name: "Priya" },
        ],
      },
      {
        tableName: "COURSE",
        columns: ["course_id (PK)", "course_name", "instructor_id (FK)"],
        rows: [
          { course_id: "C101", course_name: "DBMS", instructor_id: "T1" },
          { course_id: "C102", course_name: "OS", instructor_id: "T2" },
          { course_id: "C103", course_name: "CN", instructor_id: "T3" },
        ],
      },
      {
        tableName: "INSTRUCTOR",
        columns: ["instructor_id (PK)", "teacher_name", "phone"],
        rows: [
          { instructor_id: "T1", teacher_name: "Dr. Sharma", phone: "9876543210" },
          { instructor_id: "T2", teacher_name: "Dr. Verma", phone: "9876543211" },
          { instructor_id: "T3", teacher_name: "Dr. Gupta", phone: "9876543212" },
        ],
      },
      {
        tableName: "ENROLLMENT",
        columns: ["student_id (FK)", "course_id (FK)", "grade"],
        rows: [
          { student_id: 101, course_id: "C101", grade: "A" },
          { student_id: 101, course_id: "C102", grade: "B" },
          { student_id: 102, course_id: "C101", grade: "A+" },
          { student_id: 102, course_id: "C103", grade: "A" },
        ],
      },
    ],
    dependencies: [
      { lhs: "student_id", rhs: "student_name", type: "Full Key Dependency", color: "#34d399" },
      { lhs: "course_id", rhs: "course_name, instructor_id", type: "Full Key Dependency", color: "#34d399" },
      { lhs: "instructor_id", rhs: "teacher_name, phone", type: "Full Key Dependency", color: "#34d399" },
    ],
  },
};

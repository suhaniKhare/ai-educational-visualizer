import Home from "../pages/Home/Home";
import DDAVisualizer from "../pages/Subject/ComputerGraphics/DDAVisualizer/DDAVisualizer";
import BresenhamVisualizer from "../pages/Subject/ComputerGraphics/BresenhamVisualizer/BresenhamVisualizer";
import TransformationsVisualizer from "../pages/Subject/ComputerGraphics/TransformationsVisualizer/TransformationsVisualizer";
import SQLVisualizer from "../pages/Subject/DBMS/SQLVisualizer/SQLVisualizer";
import NormalizationVisualizer from "../pages/Subject/DBMS/NormalizationVisualizer/NormalizationVisualizer";
import IndexingVisualizer from "../pages/Subject/DBMS/IndexingVisualizer/IndexingVisualizer";
import CPUSchedulingVisualizer from "../pages/Subject/OS/CPUSchedulingVisualizer/CPUSchedulingVisualizer";
import PageReplacementVisualizer from "../pages/Subject/OS/PageReplacementVisualizer/PageReplacementVisualizer";
import ProcessSynchronizationVisualizer from "../pages/Subject/OS/ProcessSynchronizationVisualizer/ProcessSynchronizationVisualizer";
import Subject from "../pages/Subject/Subject";
import computerGraphics from "../data/subjects/computerGraphics";
import dbms from "../data/subjects/dbms";
import operatingSystems from "../data/subjects/operatingSystems";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/subject/computer-graphics",
    element: (
      <Subject
        subjectData={computerGraphics}
        subjectId="computer-graphics"
      />
    ),
  },
  {
    path: "/subject/computer-graphics/dda",
    element: <DDAVisualizer />,
  },
  {
    path: "/subject/computer-graphics/bresenham",
    element: <BresenhamVisualizer />,
  },
  {
    path: "/subject/computer-graphics/2d-transformations",
    element: <TransformationsVisualizer />,
  },
  {
    path: "/subject/computer-graphics/transformations",
    element: <TransformationsVisualizer />,
  },
  {
    path: "/subject/dbms",
    element: <Subject subjectData={dbms} subjectId="dbms" />,
  },
  {
    path: "/subject/dbms/sql",
    element: <SQLVisualizer />,
  },
  {
    path: "/subject/dbms/normalization",
    element: <NormalizationVisualizer />,
  },
  {
    path: "/subject/dbms/indexing",
    element: <IndexingVisualizer />,
  },
  {
    path: "/subject/operating-systems",
    element: (
      <Subject
        subjectData={operatingSystems}
        subjectId="operating-systems"
      />
    ),
  },
  {
    path: "/subject/operating-systems/cpu-scheduling",
    element: <CPUSchedulingVisualizer />,
  },
  {
    path: "/subject/operating-systems/page-replacement",
    element: <PageReplacementVisualizer />,
  },
  {
    path: "/subject/operating-systems/process-synchronization",
    element: <ProcessSynchronizationVisualizer />,
  },
];

export default routes;
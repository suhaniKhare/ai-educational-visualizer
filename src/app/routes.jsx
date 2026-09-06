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

import OSIModelVisualizer from "../pages/Subject/CN/OSIModelVisualizer/OSIModelVisualizer";
import TCPHandshakeVisualizer from "../pages/Subject/CN/TCPHandshakeVisualizer/TCPHandshakeVisualizer";
import SubnettingVisualizer from "../pages/Subject/CN/SubnettingVisualizer/SubnettingVisualizer";

import computerNetworks from "../data/subjects/computerNetworks";

import LexicalAnalysisVisualizer from "../pages/Subject/CompilerDesign/LexicalAnalysisVisualizer/LexicalAnalysisVisualizer";
import SyntaxAnalysisVisualizer from "../pages/Subject/CompilerDesign/SyntaxAnalysisVisualizer/SyntaxAnalysisVisualizer";
import IntermediateCodeVisualizer from "../pages/Subject/CompilerDesign/IntermediateCodeVisualizer/IntermediateCodeVisualizer";

import compilerDesign from "../data/subjects/compilerDesign";

import ArrayVisualizer from "../pages/Subject/DSA/Data-Structures/ArrayVisualizer/ArrayVisualizer";
import LinkedListVisualizer from "../pages/Subject/DSA/Data-Structures/LinkedListVisualizer/LinkedListVisualizer";
import StackVisualizer from "../pages/Subject/DSA/Data-Structures/StackVisualizer/StackVisualizer";
import QueueVisualizer from "../pages/Subject/DSA/Data-Structures/QueueVisualizer/QueueVisualizer";
import TreeVisualizer from "../pages/Subject/DSA/Data-Structures/TreeVisualizer/TreeVisualizer";
import GraphVisualizer from "../pages/Subject/DSA/Data-Structures/GraphVisualizer/GraphVisualizer";
import DPVisualizer from "../pages/Subject/DSA/Data-Structures/DPVisualizer/DPVisualizer";

import dsa from "../data/subjects/dsa";

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
  {
  path: "/subject/computer-networks",
  element: (
    <Subject
      subjectData={computerNetworks}
      subjectId="computer-networks"
    />
  ),
},

{
  path: "/subject/computer-networks/osi-model",
  element: <OSIModelVisualizer />,
},

{
  path: "/subject/computer-networks/tcp-handshake",
  element: <TCPHandshakeVisualizer />,
},

{
  path: "/subject/computer-networks/subnetting",
  element: <SubnettingVisualizer />,
},
{
  path: "/subject/compiler-design",
  element: (
    <Subject
      subjectData={compilerDesign}
      subjectId="compiler-design"
    />
  ),
},

{
  path: "/subject/compiler-design/lexical-analysis",
  element: <LexicalAnalysisVisualizer />,
},

{
  path: "/subject/compiler-design/syntax-analysis",
  element: <SyntaxAnalysisVisualizer />,
},

{
  path: "/subject/compiler-design/intermediate-code",
  element: <IntermediateCodeVisualizer />,
},

{
  path: "/subject/dsa",
  element: (
    <Subject
      subjectData={dsa}
      subjectId="dsa"
    />
  ),
},
{
  path: "/subject/dsa/array",
  element: <ArrayVisualizer />,
},
{
  path: "/subject/dsa/linked-list",
  element: <LinkedListVisualizer />,
},
{
  path: "/subject/dsa/stack",
  element: <StackVisualizer />,
},
{
  path: "/subject/dsa/queue",
  element: <QueueVisualizer />,
},
{
  path: "/subject/dsa/tree",
  element: <TreeVisualizer />,
},
{
  path: "/subject/dsa/graph",
  element: <GraphVisualizer />,
},
{
  path: "/subject/dsa/dp",
  element: <DPVisualizer />,
},

];

export default routes;
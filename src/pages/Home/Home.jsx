import HeroSection from "./components/HeroSection/HeroSection";
import SubjectsSection from "./components/SubjectSection/SubjectsSection";

import "./Home.css";

function Home() {
  return (
    <main className="home">
      <HeroSection />
      <SubjectsSection />
    </main>
  );
}

export default Home;
import { Routes, Route } from "react-router-dom"

import WorkoutLogPage from "../src/pages/WorkoutLogPage.tsx"
import HomePage from "./pages/HomePage.tsx";
import CreateExercise from "./pages/CreateExercise.tsx";
import WorkoutSummaryPage from "./pages/WorkoutSummaryPage.tsx";
import ExerciseSummaryPage from "./pages/ExerciseSummaryPage.tsx";


function App() {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-set" element={<WorkoutLogPage />} />
        <Route path = "/create-exercise" element={<CreateExercise />} />
        <Route path = "/workout-summary" element={<WorkoutSummaryPage />} />
        <Route path = "/exercise-summary" element={<ExerciseSummaryPage />} />
        <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App
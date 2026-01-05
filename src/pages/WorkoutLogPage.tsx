import { useState }  from "react";

import WorkoutForm from "../components/WorkoutForm.tsx";
import AddExercise from "../components/AddExercise.tsx"

import "../css/workoutLog.css";

const WorkoutLogPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewExercise = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="outercontainer">
        <h2>Create Exercise</h2>
      <AddExercise onAdd={handleNewExercise} />
      <WorkoutForm key={refreshKey} />
    </div>
  );
};

export default WorkoutLogPage;
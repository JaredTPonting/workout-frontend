import React, { useState }  from "react";

import WorkoutForm from "../components/WorkoutForm.tsx";
import AddExercise from "../components/AddExercise.tsx"

const WorkoutLogPage = () => {
  const [refreshKey, setRefreshKey] = useState(0); // Simple way to refresh WorkoutForm

  const handleNewExercise = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div>
      <h1>Workout Tracker</h1>
      <AddExercise onAdd={handleNewExercise} />
      <WorkoutForm key={refreshKey} />
    </div>
  );
};

export default WorkoutLogPage;
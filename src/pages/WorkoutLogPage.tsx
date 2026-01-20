import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import WorkoutForm from "../components/WorkoutForm.tsx";
import AddExercise from "../components/AddExercise.tsx"

import "../css/workoutLog.css";

const WorkoutLogPage = () => {
    const navigate = useNavigate();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleNewExercise = () => {
        setRefreshKey((k) => k + 1);
    };

    return (
        <div className="outercontainer">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    <ArrowLeft size={20} />
                </button>
                <h2>Log Workout</h2>
                <div style={{ width: 36 }} />
            </div>

            <AddExercise onAdd={handleNewExercise} />
            <WorkoutForm key={refreshKey} />
        </div>
    );
};

export default WorkoutLogPage;

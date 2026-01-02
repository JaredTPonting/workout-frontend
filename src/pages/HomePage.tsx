import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="container home">
            <h1 className="home-title">Workout Tracker</h1>

            <div className="home-actions card">
                <button onClick={() => navigate("/create-exercise")}>
                    Create Exercise
                </button>

                <button onClick={() => navigate("/add-set")}>
                    Add Set
                </button>

                <button onClick={() => navigate("/workout-summary")}>
                    Workout Summary
                </button>

                <button onClick={() => navigate("/exercise-summary")}>
                    Exercise Summary
                </button>
            </div>
        </div>
    );
};

export default HomePage;

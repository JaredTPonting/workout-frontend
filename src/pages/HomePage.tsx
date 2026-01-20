import { useNavigate } from "react-router-dom";
import { Dumbbell, Plus, CalendarDays, BarChart3 } from "lucide-react";
import "../css/HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
            <h1 className="home-title">Workout Tracker</h1>
            <p className="home-subtitle">Track your progress, crush your goals</p>

            <div className="home-actions">
                <button
                    className="home-btn home-btn--blue stagger-item"
                    onClick={() => navigate("/create-exercise")}
                >
                    <Dumbbell className="home-btn-icon" />
                    <span className="home-btn-label">Create Exercise</span>
                </button>

                <button
                    className="home-btn home-btn--green stagger-item"
                    onClick={() => navigate("/add-set")}
                >
                    <Plus className="home-btn-icon" />
                    <span className="home-btn-label">Add Set</span>
                </button>

                <button
                    className="home-btn home-btn--purple stagger-item"
                    onClick={() => navigate("/workout-summary")}
                >
                    <CalendarDays className="home-btn-icon" />
                    <span className="home-btn-label">Workout Summary</span>
                </button>

                <button
                    className="home-btn home-btn--orange stagger-item"
                    onClick={() => navigate("/exercise-summary")}
                >
                    <BarChart3 className="home-btn-icon" />
                    <span className="home-btn-label">Exercise Summary</span>
                </button>
            </div>
        </div>
    );
};

export default HomePage;

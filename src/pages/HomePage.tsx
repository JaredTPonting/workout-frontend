import { useNavigate } from "react-router-dom";
import { Dumbbell, Plus, CalendarDays, BarChart3, LogOut, Eye } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../css/HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isGuest, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="home">
            {/* Auth status badge */}
            <div className="auth-badge-container">
                {isGuest && (
                    <div className="auth-badge auth-badge--guest">
                        <Eye size={14} />
                        Guest Mode
                    </div>
                )}
                {isAuthenticated && (
                    <div className="auth-badge auth-badge--authenticated">
                        Logged In
                    </div>
                )}
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={16} />
                    {isGuest ? "Exit" : "Logout"}
                </button>
            </div>

            <h1 className="home-title">Workout Tracker</h1>
            <p className="home-subtitle">
                {isGuest
                    ? "Viewing as guest - read only mode"
                    : "Track your progress, crush your goals"}
            </p>

            <div className="home-actions">
                <button
                    className={`home-btn home-btn--blue stagger-item ${isGuest ? "home-btn--disabled" : ""}`}
                    onClick={() => !isGuest && navigate("/create-exercise")}
                    disabled={isGuest}
                >
                    <Dumbbell className="home-btn-icon" />
                    <span className="home-btn-label">Create Exercise</span>
                    {isGuest && <span className="home-btn-locked">Requires login</span>}
                </button>

                <button
                    className={`home-btn home-btn--green stagger-item ${isGuest ? "home-btn--disabled" : ""}`}
                    onClick={() => !isGuest && navigate("/add-set")}
                    disabled={isGuest}
                >
                    <Plus className="home-btn-icon" />
                    <span className="home-btn-label">Add Set</span>
                    {isGuest && <span className="home-btn-locked">Requires login</span>}
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

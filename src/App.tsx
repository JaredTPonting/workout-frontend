import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import WorkoutLogPage from "./pages/WorkoutLogPage";
import CreateExercise from "./pages/CreateExercise";
import WorkoutSummaryPage from "./pages/WorkoutSummaryPage";
import ExerciseSummaryPage from "./pages/ExerciseSummaryPage";

function AppRoutes() {
    const { isAuthenticated, isGuest } = useAuth();

    // Show login page if not authenticated and not a guest
    if (!isAuthenticated && !isGuest) {
        return <LoginPage />;
    }

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-set" element={<WorkoutLogPage />} />
            <Route path="/create-exercise" element={<CreateExercise />} />
            <Route path="/workout-summary" element={<WorkoutSummaryPage />} />
            <Route path="/exercise-summary" element={<ExerciseSummaryPage />} />
            <Route path="*" element={<HomePage />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;

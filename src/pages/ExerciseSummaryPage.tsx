import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Calendar, TrendingUp } from "lucide-react";
import Plot from "react-plotly.js";
import {
    getExercises,
    getSetsByExercise,
} from "../services/api";
import "../css/exerciseSummary.css";

interface Exercise {
    id: number;
    name: string;
}

interface ExerciseSet {
    id: number;
    reps: number;
    weight: number;
    unit: string;
    created_at: string;
}

const ExerciseSummaryPage = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exerciseId, setExerciseId] = useState<number | null>(null);
    const [sets, setSets] = useState<ExerciseSet[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getExercises()
            .then((data) => {
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setExercises(sorted);
            })
            .catch(() => setExercises([]));
    }, []);

    useEffect(() => {
        if (!exerciseId) return;

        setLoading(true);
        setSets([]);

        getSetsByExercise(exerciseId)
            .then((data) => setSets(data ?? []))
            .finally(() => setLoading(false));
    }, [exerciseId]);

    // Group sets by date
    const setsByDate = sets.reduce<Record<string, ExerciseSet[]>>((acc, set) => {
        const date = set.created_at.slice(0, 10);
        acc[date] ??= [];
        acc[date].push(set);
        return acc;
    }, {});

    const sortedDates = Object.keys(setsByDate).sort();

    // Get last 3 workout sessions
    const lastThreeDates = sortedDates.slice(-3).reverse();
    const recentSessions = lastThreeDates.map(date => ({
        date,
        sets: setsByDate[date],
    }));

    // Calculate max weight lifted
    const maxWeightSet = sets.length > 0
        ? sets.reduce((max, set) => set.weight > max.weight ? set : max, sets[0])
        : null;

    // Calculate total workouts count
    const totalWorkouts = sortedDates.length;

    // Volume by date for daily chart
    const volumeByDate = sets.reduce<Record<string, number>>((acc, set) => {
        const date = set.created_at.slice(0, 10);
        acc[date] = (acc[date] ?? 0) + set.reps * set.weight;
        return acc;
    }, {});
    const dailyVolume = sortedDates.map((d) => volumeByDate[d]);

    // Volume by month
    const volumeByMonth = sets.reduce<Record<string, number>>((acc, set) => {
        const month = set.created_at.slice(0, 7);
        acc[month] = (acc[month] ?? 0) + set.reps * set.weight;
        return acc;
    }, {});
    const volumeMonths = Object.keys(volumeByMonth).sort();
    const monthlyVolume = volumeMonths.map((m) => volumeByMonth[m]);

    // Workouts count by month
    const workoutsByMonth = sets.reduce<Record<string, Set<string>>>((acc, set) => {
        const month = set.created_at.slice(0, 7);
        const date = set.created_at.slice(0, 10);
        acc[month] ??= new Set();
        acc[month].add(date);
        return acc;
    }, {});
    const workoutMonths = Object.keys(workoutsByMonth).sort();
    const monthlyWorkoutCounts = workoutMonths.map((m) => workoutsByMonth[m].size);

    const chartLayout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#94a3b8', family: 'Inter, system-ui, sans-serif' },
        margin: { t: 40, r: 20, b: 60, l: 60 },
        xaxis: {
            gridcolor: '#334155',
            linecolor: '#334155',
        },
        yaxis: {
            gridcolor: '#334155',
            linecolor: '#334155',
        },
    };

    return (
        <div className="exercise-summary-container">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    <ArrowLeft size={20} />
                </button>
                <h2>Exercise Summary</h2>
                <div style={{ width: 36 }} />
            </div>

            <div className="exercise-selector">
                <select
                    value={exerciseId ?? ""}
                    onChange={(e) => setExerciseId(Number(e.target.value))}
                >
                    <option value="" disabled>
                        Select an exercise
                    </option>
                    {exercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                            {ex.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p className="status-message">Loading...</p>}

            {!loading && exerciseId && sets.length === 0 && (
                <p className="status-message">No data for this exercise yet.</p>
            )}

            {sets.length > 0 && (
                <>
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card stat-card--gold">
                            <div className="stat-icon">
                                <Trophy size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">Max Weight</span>
                                <span className="stat-value">
                                    {maxWeightSet?.weight} {maxWeightSet?.unit}
                                </span>
                                <span className="stat-detail">
                                    {maxWeightSet?.reps} reps
                                </span>
                            </div>
                        </div>

                        <div className="stat-card stat-card--blue">
                            <div className="stat-icon">
                                <Calendar size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">Total Workouts</span>
                                <span className="stat-value">{totalWorkouts}</span>
                                <span className="stat-detail">sessions logged</span>
                            </div>
                        </div>

                        <div className="stat-card stat-card--green">
                            <div className="stat-icon">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">Total Sets</span>
                                <span className="stat-value">{sets.length}</span>
                                <span className="stat-detail">all time</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Sessions */}
                    <div className="recent-sessions">
                        <h3>Recent Sessions</h3>
                        <div className="sessions-grid">
                            {recentSessions.map((session, idx) => (
                                <div key={session.date} className={`session-card ${idx === 0 ? 'session-card--latest' : ''}`}>
                                    <div className="session-header">
                                        <span className="session-date">{session.date}</span>
                                        {idx === 0 && <span className="session-badge">Latest</span>}
                                    </div>
                                    <div className="session-sets">
                                        {session.sets.map((s, i) => (
                                            <div key={s.id} className="session-set">
                                                Set {i + 1}: <strong>{s.reps}</strong> × <strong>{s.weight} {s.unit}</strong>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="session-summary">
                                        Volume: {session.sets.reduce((sum, s) => sum + s.reps * s.weight, 0).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="charts-container">
                        <div className="chart-card">
                            <h3>Workouts Per Month</h3>
                            <Plot
                                data={[
                                    {
                                        x: workoutMonths,
                                        y: monthlyWorkoutCounts,
                                        type: "bar",
                                        marker: {
                                            color: "#10b981",
                                            line: { color: "#059669", width: 2 }
                                        },
                                    },
                                ]}
                                layout={{
                                    ...chartLayout,
                                    xaxis: { ...chartLayout.xaxis, title: "Month" },
                                    yaxis: { ...chartLayout.yaxis, title: "Number of Workouts" },
                                }}
                                style={{ width: "100%", height: "300px" }}
                                config={{ displayModeBar: false, responsive: true }}
                            />
                        </div>

                        <div className="chart-card">
                            <h3>Daily Training Volume</h3>
                            <Plot
                                data={[
                                    {
                                        x: sortedDates,
                                        y: dailyVolume,
                                        type: "scatter",
                                        mode: "lines+markers",
                                        line: { shape: "spline", color: "#3b82f6", width: 3 },
                                        marker: { size: 8, color: "#3b82f6" },
                                        fill: "tozeroy",
                                        fillcolor: "rgba(59, 130, 246, 0.1)",
                                    },
                                ]}
                                layout={{
                                    ...chartLayout,
                                    xaxis: { ...chartLayout.xaxis, title: "Date" },
                                    yaxis: { ...chartLayout.yaxis, title: "Volume (reps × weight)" },
                                }}
                                style={{ width: "100%", height: "300px" }}
                                config={{ displayModeBar: false, responsive: true }}
                            />
                        </div>

                        <div className="chart-card">
                            <h3>Monthly Training Volume</h3>
                            <Plot
                                data={[
                                    {
                                        x: volumeMonths,
                                        y: monthlyVolume,
                                        type: "bar",
                                        marker: {
                                            color: monthlyVolume.map((_, i) =>
                                                `rgba(139, 92, 246, ${0.5 + (i / monthlyVolume.length) * 0.5})`
                                            ),
                                            line: { color: "#8b5cf6", width: 2 }
                                        },
                                    },
                                ]}
                                layout={{
                                    ...chartLayout,
                                    xaxis: { ...chartLayout.xaxis, title: "Month" },
                                    yaxis: { ...chartLayout.yaxis, title: "Volume" },
                                }}
                                style={{ width: "100%", height: "300px" }}
                                config={{ displayModeBar: false, responsive: true }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExerciseSummaryPage;

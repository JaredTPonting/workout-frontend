import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

    const volumeByDate = sets.reduce<Record<string, number>>((acc, set) => {
        const date = set.created_at.slice(0, 10);
        acc[date] = (acc[date] ?? 0) + set.reps * set.weight;
        return acc;
    }, {});

    const sortedDates = Object.keys(volumeByDate).sort();
    const dailyVolume = sortedDates.map((d) => volumeByDate[d]);

    const volumeByMonth = sets.reduce<Record<string, number>>((acc, set) => {
        const month = set.created_at.slice(0, 7);
        acc[month] = (acc[month] ?? 0) + set.reps * set.weight;
        return acc;
    }, {});
    const months = Object.keys(volumeByMonth).sort();
    const monthlyVolume = months.map((m) => volumeByMonth[m]);

    const latestDate = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null;
    const latestSessionSets = latestDate
        ? sets.filter((s) => s.created_at.slice(0, 10) === latestDate)
        : [];

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

            {latestSessionSets.length > 0 && (
                <div className="latest-session-card">
                    <h3>
                        Latest Session
                        <span className="date-badge">{latestDate}</span>
                    </h3>
                    {latestSessionSets.map((s, i) => (
                        <div key={s.id} className="session-set">
                            Set {i + 1}: <strong>{s.reps} reps</strong> × <strong>{s.weight} {s.unit}</strong>
                        </div>
                    ))}
                </div>
            )}

            {sets.length > 0 && (
                <div className="charts-container">
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
                            style={{ width: "100%", height: "350px" }}
                            config={{ displayModeBar: false, responsive: true }}
                        />
                    </div>

                    <div className="chart-card">
                        <h3>Monthly Training Volume</h3>
                        <Plot
                            data={[
                                {
                                    x: months,
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
                            style={{ width: "100%", height: "350px" }}
                            config={{ displayModeBar: false, responsive: true }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseSummaryPage;

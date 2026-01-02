import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import {
    getExercises,
    getSetsByExercise,
} from "../services/api";
import React from "react";


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
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exerciseId, setExerciseId] = useState<number | null>(null);
    const [sets, setSets] = useState<ExerciseSet[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getExercises()
            .then(setExercises)
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


    return (
        <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
            <h2>Exercise Summary</h2>

            {/* Exercise selector */}
            <div style={{ marginBottom: "1.5rem" }}>
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

            {loading && <p>Loading...</p>}

            {!loading && exerciseId && sets.length === 0 && (
                <p>No data for this exercise yet.</p>
            )}

            {/* Latest session */}
            {latestSessionSets.length > 0 && (
                <div className="card" style={{ marginBottom: "2rem" }}>
                    <h3>Latest Session ({latestDate})</h3>
                    {latestSessionSets.map((s, i) => (
                        <div key={s.id}>
                            Set {i + 1}: {s.reps} reps × {s.weight} {s.unit}
                        </div>
                    ))}
                </div>
            )}

            {/* Charts */}
            {sets.length > 0 && (
                <>
                    {/* Daily volume trend */}
                    <Plot
                        data={[
                            {
                                x: sortedDates,
                                y: dailyVolume,
                                type: "scatter",
                                mode: "lines+markers",
                                line: { shape: "linear", color: "#111827" },
                                marker: { size: 6 },
                            },
                        ]}
                        layout={{
                            title: "Daily Training Volume",
                            xaxis: { title: "Date" },
                            yaxis: { title: "Volume (reps × weight)" },
                        }}
                        style={{ width: "100%", height: "400px", marginBottom: "2rem" }}
                    />

                    {/* Monthly volume */}
                    <Plot
                        data={[
                            {
                                x: months,
                                y: monthlyVolume,
                                type: "bar",
                                marker: { color: "#1f2937" },
                            },
                        ]}
                        layout={{
                            title: "Monthly Training Volume",
                            xaxis: { title: "Month" },
                            yaxis: { title: "Volume" },
                        }}
                        style={{ width: "100%", height: "400px" }}
                    />
                </>
            )}
        </div>
    );
};

export default ExerciseSummaryPage;

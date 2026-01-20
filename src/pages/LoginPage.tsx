import { useState } from "react";
import { Dumbbell, User, Lock, LogIn, Eye, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../css/LoginPage.css";

const LoginPage = () => {
    const { login, continueAsGuest } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(username, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestAccess = () => {
        continueAsGuest();
    };

    return (
        <div className="login-page">
            <div className="login-card card">
                <div className="login-header">
                    <Dumbbell className="login-icon" />
                    <h1>Workout Tracker</h1>
                    <p>Sign in to track your progress</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="login-error">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 size={20} className="spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="divider">or</div>

                <button className="guest-btn" onClick={handleGuestAccess}>
                    <Eye size={20} />
                    Continue as Guest
                </button>
                <p className="guest-note">
                    Guests can view workouts but cannot add or edit data
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

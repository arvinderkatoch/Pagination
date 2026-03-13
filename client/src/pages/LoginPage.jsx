import { useState } from 'react';
import { login } from '../services/authApi';
import { useNavigate, Navigate } from 'react-router-dom';
function LoginPage({ user, setUser }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    if (user) return <Navigate to="/" replace />;

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(form);
            const loggedInUser = res?.data?.user || res?.user || null;
            console.log('res:', res);
            alert('success', 'Logged in Successfully');
            if (loggedInUser) setUser(loggedInUser);
            if (res.status == 'success') {
                window.setTimeout(() => {
                    navigate("/")
                }, 1500)
            }
        } catch (error) {
            console.error(error);
            alert('Login request failed. Check Credential');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h1>Login</h1>
            <p>Placeholder form connected to /api/v1/users/login</p>
            <form className="form" onSubmit={onSubmit}>
                <label>
                    Email
                    <input name="email" type="email" value={form.email} onChange={onChange} required />
                </label>

                <label>
                    Password
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </section>
    );
}

export default LoginPage;
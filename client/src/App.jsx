import { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import OverviewPage from './pages/OverviewPage';
import TourPage from './pages/TourPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MePage from './pages/MePage';
import NotFoundPage from './pages/NotFoundPage';
import apiClient from './services/apiClient';


function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/users/me', { withCredentials: true })
            .then((res) => {
                console.log('User info:', res);
                setUser(res.data.data.data)

            })

            .catch(() => setUser(null))
            .finally(() => setAuthLoading(false));
    }, []);

    if (authLoading) return null;

    return (
        <Routes>
            <Route element={<MainLayout user={user} setUser={setUser} />}>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/tour/:slug" element={<TourPage user={user} />} />
                <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/me" element={<MePage />} />
            </Route>

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
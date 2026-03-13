import apiClient from './apiClient';

export async function login({ email, password }) {
    const res = await apiClient.post('/users/login', { email, password });
    return res.data;
}

export async function signup({ name, email, password, passwordConfirm }) {
    const res = await apiClient.post('/users/signup', {
        name,
        email,
        password,
        passwordConfirm
    });
    return res.data;
}

export async function logout() {
    const res = await apiClient.get('/users/logout');
    return res.data;
}
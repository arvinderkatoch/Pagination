import axios from 'axios';
import { displayAlert } from './alert';
export const signup = async function signup(name, email, password, passwordConfirm) {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }, withCredentials: true

        },
        )
        if (res.data.status == 'success') {
            displayAlert('success', 'Signed up successfully');
            window.setTimeout(() => {
                location.assign("/")
            }, 1500)
        }
        console.log(res);
    } catch (err) {
        displayAlert('error', err.response?.data?.message || 'Signup failed');
    }
};
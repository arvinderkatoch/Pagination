import apiClient from './apiClient';

export const bookTour = async (tourId) => {
    try {
        const { data } = await apiClient.get(`/bookings/checkout-session/${tourId}`);
        window.location.assign(data.session.url);
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Something went wrong!';
        alert(errorMessage);
    }
};
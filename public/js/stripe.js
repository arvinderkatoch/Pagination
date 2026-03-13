import axios from 'axios';
import { displayAlert } from './alert';
const Stripe = require('stripe');
const stripe = Stripe('pk_test_BUkd0ZXAj6m0q0jMyRgBxNns00PPtgvjjr');

export const bookTour = async (tourId) => {
    try {
        console.log("hefnknekn");
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

        // Redirect to the session URL
        window.location.assign(session.data.session.url);
    } catch (err) {
        // Improved error handling for better user feedback
        const errorMessage = err.response ? err.response.data.message : 'Something went wrong!';
        displayAlert('error', errorMessage);
    }
};


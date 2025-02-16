
import '@babel/polyfill'
import { login } from './login'
import { logout } from './login'
import { bookTour } from './stripe';
console.log("Hello from parcel")
console.log(document.querySelector('.nav__el--logout'))
const logoutButton = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');
const mapBox = document.getElementById('map');

const form = document.querySelector('form')
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const userName = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        login(userName, password);
    });
}

if (logoutButton) {
    console.log("logoutbutton");
    logoutButton.addEventListener('click', logout)
}

if (bookBtn)
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
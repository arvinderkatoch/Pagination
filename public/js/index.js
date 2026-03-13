
import '@babel/polyfill'
import { login } from './login'
import { logout } from './login'
import { signup } from './signup'
import { bookTour } from './stripe';
console.log("Hello from parcel")
console.log(document.querySelector('.nav__el--logout'))
const logoutButton = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');


const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
console.log("i am here");
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userName = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        login(userName, password);
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("passwordConfirm").value;

        signup(name, email, password, passwordConfirm);
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
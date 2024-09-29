console.log("Hello from parcel")
import '@babel/polyfill'
import {login} from './login'
import { displayMap } from './mapbox';
import {logout} from './login'


const logoutButton = document.querySelector('.nav__el--logout');
const mapBox = document.getElementById('map');

if (mapBox){
const locations= JSON.parse(mapBox.dataset.locations);
displayMap(locations)
}

const form = document.querySelector('form')
if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const userName = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      login(userName, password);
    });
  }

  if(logoutButton) {
    logoutButton.addEventListener('click',logout)
  }
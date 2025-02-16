import axios from 'axios';
import { displayAlert } from './alert';
export const login = async function login(email,password) {
    try{
const res = await axios({
    method: 'POST',
    url: 'http://127.0.0.1:3000/api/v1/users/login',
    data: {
      email,
      password
    }, withCredentials: true
    
},
)
if(res.data.status == 'success'){
    displayAlert('success','Logged in Successfully');
    window.setTimeout(() => {
        location.assign("/")
    },1500)
}
console.log(res);
    } catch(err) {
        displayAlert('error','Logged in Successfully');
    }
};

export const logout = async function logout() {
    try{
const res = await axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/api/v1/users/logout',    
},
)
if(res.data.status == 'success'){
  location.reload();
}
    } catch(err) {
        displayAlert('error','Logged in Successfully');
    }
}


import { authHeader } from '../_helpers';
import  axios  from 'axios';
import _ from 'lodash'

export const userService = {
    login,
    logout,
    register,
    search,
    getAll,
    getById,
    update,
    delete: _delete
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };
    let result=[];
    return axios({
        url:'https://swapi.co/api/people/?search='+username,
        method:'GET',
        Headers:[]
      }) .then(response => {
        if (response) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
              result =_.filter(response.data.results, function(o) { 
                return o.name.toLowerCase() == username.toLowerCase() && o.birth_year==password; 
             });
             if(result.length>0){
            localStorage.setItem('user', JSON.stringify(result[0]));
             }
        }

        return result;
      }).catch(error=>{
      });
}

function search(pageNo,value) {
    let result=[];
    let urlString ='';
    if( value && value!=''){
        urlString=   'https://swapi.co/api/planets/?page='+pageNo+'&search='+value
    }else{
        urlString=   'https://swapi.co/api/planets/?page='+pageNo
    }
    return axios({
        url:urlString,
        method:'GET',
        Headers:[]
    })
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('/users', requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('/users/' + _id, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch('/users/register', requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch('/users/' + user.id, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch('/users/' + id, requestOptions).then(handleResponse);;
}

function handleResponse(response) {
    if (!response.ok) { 
        return Promise.reject(response.statusText);
    }

    return response.json();
}
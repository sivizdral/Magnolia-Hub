import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(usernameFromForm, passwordFromForm) {
    const data = {
      username: usernameFromForm,
      password: passwordFromForm
    }

    return this.http.post('http://localhost:4000/users/login', data)
  }

  register(username, password, firstname, lastname, email, type) {
    const data = {
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname,
      email: email,
      type: type
    }

    return this.http.post('http://localhost:4000/users/signup', data)
  }
  
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(usernameFromForm, passwordFromForm): Observable<any> {
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

  forgotPass(email) {
    const data = {
      email: email
    }

    return this.http.post('http://localhost:4000/users/password-reset', data)
  }

  resetPass(password, userId, token) {
    const data = {
      password: password
    }

    const link = "http://localhost:4000/users/password-reset/" + userId + "/" + token
    console.log(link)

    return this.http.post(link, data)
  }

  changePass(oldPass, newPass, username) {
    
    const data = {
      oldPass: oldPass,
      newPass: newPass,
      username: username
    }

    return this.http.post('http://localhost:4000/users/password-change', data)
  }
  
}

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

  register(username, password, firstname, lastname, email, phone, type, org_name, address, tin, photo) {
    const formData =  new  FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("type", type == "1" ? "participant" : "organizer");
    formData.append("organizationName", org_name);
    formData.append("organizationAddress", address);
    formData.append("taxNumber", tin);
    formData.append("photo", photo, photo.name);

    return this.http.post('http://localhost:4000/users/signup', formData)
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

  getData(user_id) {
    return this.http.get('http://localhost:4000/users/myData?user_id=' + user_id)
  }
  
}

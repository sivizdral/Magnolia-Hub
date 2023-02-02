import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get('http://localhost:4000/admin/getUsers')
  }

  approve(username) {
    const data = {username: username, status: 'approved'}
    return this.http.post('http://localhost:4000/admin/changeRequestStatus', data)
  }

  reject(username) {
    const data = {username: username, status: 'denied'}
    return this.http.post('http://localhost:4000/admin/changeRequestStatus', data)
  }

  delete(username) {
    const data = {username: username}
    return this.http.post('http://localhost:4000/admin/deleteUser', data)
  }

  create(username, password, firstname, lastname, email, phone, type, org_name, address, tin, photo) {
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

    return this.http.post('http://localhost:4000/admin/addUser', formData)
  }
}

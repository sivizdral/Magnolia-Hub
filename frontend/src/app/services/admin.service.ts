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
}

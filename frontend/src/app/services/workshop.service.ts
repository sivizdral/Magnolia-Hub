import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  constructor(private http: HttpClient) { }

  getMostLiked(): Observable<any> {
    return this.http.get('http://localhost:4000/workshops/top')
  }

  getPhoto(str): Observable<any> {
    return this.http.get('http://localhost:4000/workshops/image?path=' + str, { responseType: 'blob' })
  }

  getAll(): Observable<any> {
    return this.http.get('http://localhost:4000/workshops/all')
  }

  searchByCriteria(name, place): Observable<any> {
    return this.http.get('http://localhost:4000/workshops/all?name=' + name + "&place=" + place)
  }

  sort(name, place, sort): Observable<any> {
    return this.http.get('http://localhost:4000/workshops/all?name=' + name + "&place=" + place + "&sort=" + sort)
  }
}

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
}

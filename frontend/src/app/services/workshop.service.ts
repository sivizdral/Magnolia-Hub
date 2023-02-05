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

  getDetails(id): Observable<any> {
    return this.http.get('http://localhost:4000/workshops/details?id='+id)
  }

  getAvailablePlaces(id): Observable<any> {
    return this.http.get('http://localhost:4000/workshops/availablePlaces?id='+id)
  }

  apply(workshop, user): Observable<any> {
    const data = {
      workshop_id: workshop,
      user_id: user
    }
    return this.http.post('http://localhost:4000/participants/apply', data)
  }

  getApplied(id): Observable<any> {
    return this.http.get('http://localhost:4000/participants/appliedWorkshops?id='+id)
  }

  cancel(user_id, workshop_id): Observable<any> {
    const data = {
      user_id: user_id,
      workshop_id: workshop_id
    }
    return this.http.post('http://localhost:4000/participants/cancelApplication', data);
  }

  getAllOrganizer(id): Observable<any> {
    return this.http.get('http://localhost:4000/workshops/organizerWorkshops?id='+id)
  }

  cancelWorkshop(id): Observable<any> {
    const data = {
      workshop_id: id
    }
    return this.http.post('http://localhost:4000/workshops/cancelWorkshop', data)
  }

  saveJSON(id): Observable<any> {
    const data = {
      workshop_id: id
    }
    return this.http.post('http://localhost:4000/workshops/saveJSON', data)
  }

  
}

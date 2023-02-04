import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getChat(user, workshop, organizer): Observable<any> {
    return this.http.get('http://localhost:4000/chats/userChat?user_id=' + user + "&workshop_id=" + workshop + "&organizer_id=" + organizer)
  }

  sendMsg(user, workshop, text, sender): Observable<any> {
    const data = {
      user_id: user,
      workshop_id: workshop,
      text: text,
      sender: sender,
      timestamp: Date.now()
    }
    return this.http.post('http://localhost:4000/chats/sendMessage', data)
  }
}

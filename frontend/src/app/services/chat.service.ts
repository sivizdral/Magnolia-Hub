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

  organizerSendMsg(participant, organizer, workshop, text): Observable<any> {
    const data = {
      user_id: participant,
      workshop_id: workshop,
      text: text,
      organizer_id: organizer,
      timestamp: Date.now()
    }
    return this.http.post('http://localhost:4000/chats/organizerSendMessage', data)
  }

  comment(user, workshop, text): Observable<any> {
    const data = {
      workshop_id: workshop,
      user_id: user,
      text: text
    }

    return this.http.post('http://localhost:4000/actions/comment', data)
  }

  getComments(workshop): Observable<any> {
    return this.http.get('http://localhost:4000/actions/allWorkshopComments?id='+ workshop)
  }

  like(workshop, user): Observable<any> {
    const data = {
      workshop_id: workshop,
      username: user
    }

    return this.http.post('http://localhost:4000/actions/like', data)
  }

  removeLike(workshop, user): Observable<any> {
    const data = {
      workshop_id: workshop,
      username: user
    }

    return this.http.post('http://localhost:4000/actions/removeLike', data)
  }

  getLikes(workshop): Observable<any> {
    return this.http.get('http://localhost:4000/actions/allWorkshopLikes?id='+ workshop)
  }

  getOrganizerWorkshopChats(workshop, organizer): Observable<any> {
    return this.http.get('http://localhost:4000/chats/organizerWorkshopChats?workshop_id=' + workshop + "&organizer_id=" + organizer)
  }

  
}

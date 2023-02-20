import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Chat } from 'src/app/model/chat';
import { User } from 'src/app/model/user';
import { UserFull } from 'src/app/model/userFull';
import { Workshop } from 'src/app/model/workshop';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { WorkshopService } from 'src/app/services/workshop.service';

@Component({
  selector: 'app-workshop-single-organizer',
  templateUrl: './workshop-single-organizer.component.html',
  styleUrls: ['./workshop-single-organizer.component.css']
})
export class WorkshopSingleOrganizerComponent implements OnInit {

  constructor(private wService: WorkshopService, 
    private chatService: ChatService, 
    private readonly sanitizer: DomSanitizer,
    private uService: UserService,
    private router: Router) { }
  
  workshops: Workshop[] = [];
  message: string = "";
  chats: Chat[] = [];
  users: any[] = [];
  myName: string = "";
  myPhoto;
  photos: any[] = [];
  firstnames: string[] = [];
  selectedChats: Chat[] = [];
  msgs: string[] = [];
  org: boolean = false;
 
  async ngOnInit() {
    let wString = localStorage.getItem('workshop');
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.org = (user.type == 'organizer');
    this.myName = user.firstname;
    await this.wService.getDetails(wString).subscribe((w: Workshop[]) => {
      this.workshops = w;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    this.wService.getPhoto(user.photo[0].path).subscribe(data => {
      this.myPhoto = URL.createObjectURL(new Blob([data]));
      this.myPhoto = this.sanitizer.bypassSecurityTrustUrl(this.myPhoto);
    })

    await this.chatService.getOrganizerWorkshopChats(wString, user.id).subscribe((c: Chat[]) => {
      this.chats = c;
    })
    
    await new Promise(resolve => setTimeout(resolve, 100));

    for (let i = 0; i < this.chats.length; i++) {
      await this.uService.getData(this.chats[i].participant).subscribe(data => {
        this.users.push(data as User);
      })
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));

    for (let i = 0; i < this.users.length; i++) {
      this.wService.getPhoto(this.users[i].photo[0].path).subscribe(data => {
        this.photos[i] = URL.createObjectURL(new Blob([data]));
        this.photos[i] = this.sanitizer.bypassSecurityTrustUrl(this.photos[i]);
      })
    }

    for (let k = 0; k < this.chats.length; k++) {
      for (let i = 0; i < this.chats[k].messages.length; i++) {
        const formattedDate = (new Date(this.chats[k].messages[i].timestamp)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        this.chats[k].messages[i].timestamp = formattedDate;
      }
    }
    

  }

  async sendMsg(participant, i) {
    if (this.msgs[i] == "") return;
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    let wString = localStorage.getItem('workshop');

    await this.chatService.organizerSendMsg(participant, user.id, wString, this.msgs[i]).subscribe(error => {
      this.message = error.error.message;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    await this.chatService.getOrganizerWorkshopChats(wString, user.id).subscribe((c: Chat[]) => {
      this.chats = c;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    for (let k = 0; k < this.chats.length; k++) {
      for (let i = 0; i < this.chats[k].messages.length; i++) {
        const formattedDate = (new Date(this.chats[k].messages[i].timestamp)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        this.chats[k].messages[i].timestamp = formattedDate;
      }
      for (let i = 0; i < this.selectedChats.length; i++) {
        if (this.selectedChats[i].participant == this.chats[k].participant) {
          this.selectedChats[i]= this.chats[k];
          break;
        }
      }
    }

    this.msgs[i] = "";
  }

  chosen(user) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] == user && !this.selectedChats.includes(this.chats[i])) {
        this.selectedChats.push(this.chats[i]);
        this.msgs.push("");
      }
    }
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }

}

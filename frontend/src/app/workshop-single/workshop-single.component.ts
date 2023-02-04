import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { Chat } from '../model/chat';
import { User } from '../model/user';
import { UserFull } from '../model/userFull';
import { Workshop } from '../model/workshop';
import { ChatService } from '../services/chat.service';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';

declare var baguetteBox: any;

@Component({
  selector: 'app-workshop-single',
  templateUrl: './workshop-single.component.html',
  styleUrls: ['./workshop-single.component.css']
})
export class WorkshopSingleComponent implements OnInit {

  constructor(private wService: WorkshopService, 
    private tService: TokenService, 
    private chatService: ChatService, 
    private readonly sanitizer: DomSanitizer,
    private uService: UserService) { }
  
  images: GalleryItem[];
  workshops: Workshop[] = [];
  available: boolean = false;
  message: string = "";
  chats: Chat[] = [];
  organizerName: string = "";
  organizerPhoto;
  myName: string = "";
  myPhoto;
  msgText: string = "";

  async ngOnInit() {
    let wString = localStorage.getItem('workshop');
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.myName = user.firstname;
    await this.wService.getDetails(wString).subscribe((w: Workshop[]) => {
      this.workshops = w;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    this.wService.getAvailablePlaces(wString).subscribe(data => {
      const avail = data['availablePlaces'];
      this.available = avail > 0;
    })

    this.images = [
      new ImageItem({ src: 'assets/img/admin2.jpg', thumb: 'Alpha' }),
      new ImageItem({ src: 'assets/img/admin2.jpg', thumb: 'Alpha' })
    ];

    this.wService.getPhoto(user.photo[0].path).subscribe(data => {
      this.myPhoto = URL.createObjectURL(new Blob([data]));
      this.myPhoto = this.sanitizer.bypassSecurityTrustUrl(this.myPhoto);
    })

    this.uService.getData(this.workshops[0].organizer).subscribe(data => {
      const dat = data as any;
      this.organizerName = dat.firstname;
      this.organizerPhoto = dat.photo[0].path;
    })

    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(this.organizerPhoto)

    this.wService.getPhoto(this.organizerPhoto).subscribe(data => {
      this.organizerPhoto = URL.createObjectURL(new Blob([data]));
      this.organizerPhoto = this.sanitizer.bypassSecurityTrustUrl(this.organizerPhoto);
    })

    await this.chatService.getChat(user.id, wString, this.workshops[0].organizer).subscribe((c: Chat[]) => {
      this.chats = c;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    for (let i = 0; i < this.chats[0].messages.length; i++) {
      const formattedDate = (new Date(this.chats[0].messages[i].timestamp)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.chats[0].messages[i].timestamp = formattedDate;
    }
  }

  getMapURL() {
    //let address: string[] = this.workshop.location.split(' ')
    let address: string[] = ['Belgrade'];
    let address2 = address.join('%20')
    return `https://maps.google.com/maps?q=${address2}&t=&z=13&ie=UTF8&iwloc=&output=embed`
  }

  reserve() {
    console.log("HERE")
    let wString = localStorage.getItem('workshop');
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.wService.apply(wString, user.id).subscribe(data => {
      this.message = data.message;
    }, error => {
      this.message = error.error.message;
    })
  }

  async sendMsg() {
    if (this.msgText == "") return;
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    let wString = localStorage.getItem('workshop');
    await this.chatService.sendMsg(user.id, wString, this.msgText, "participant").subscribe(error => {
      this.message = error.error.message;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    await this.chatService.getChat(user.id, wString, this.workshops[0].organizer).subscribe((c: Chat[]) => {
      this.chats = c;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    for (let i = 0; i < this.chats[0].messages.length; i++) {
      const formattedDate = (new Date(this.chats[0].messages[i].timestamp)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.chats[0].messages[i].timestamp = formattedDate;
    }
  }
  

}


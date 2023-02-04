import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { Chat } from '../model/chat';
import { CommentMy } from '../model/comment';
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
  commentText: string = "";
  comments: CommentMy[] = [];
  photos: any[] = [];
  firstnames: string[] = [];
  likes: string[] = [];
  liked: boolean = false;

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

    this.wService.getPhoto(this.organizerPhoto).subscribe(data => {
      this.organizerPhoto = URL.createObjectURL(new Blob([data]));
      this.organizerPhoto = this.sanitizer.bypassSecurityTrustUrl(this.organizerPhoto);
    })

    await this.chatService.getChat(user.id, wString, this.workshops[0].organizer).subscribe((c: Chat[]) => {
      this.chats = c;
    })

    await this.chatService.getComments(wString).subscribe(data => {
      const dat = data as any;
      this.comments = dat.comments;
      this.photos = dat.photos;
      this.firstnames = dat.firstnames;
    })

    await this.chatService.getLikes(wString).subscribe(data => {
      this.likes = data.likes;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    if (this.likes.includes(user.username)) this.liked = true;

    console.log(this.likes)

    for (let i = 0; i < this.photos.length; i++) {
      await this.wService.getPhoto(this.photos[i]).subscribe(data => {
        this.photos[i] = URL.createObjectURL(new Blob([data]));
        this.photos[i] = this.sanitizer.bypassSecurityTrustUrl(this.photos[i]);
      })
    }

    console.log(this.photos)

    for (let i = 0; i < this.chats[0].messages.length; i++) {
      const formattedDate = (new Date(this.chats[0].messages[i].timestamp)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.chats[0].messages[i].timestamp = formattedDate;
    }

    for (let i = 0; i < this.comments.length; i++) {
      const formattedDate = (new Date(this.comments[i].timestamp)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.comments[i].timestamp = formattedDate;
    }
  }

  getMapURL() {
    let address: string[] = this.workshops[0].location.split(' ')
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
    this.msgText = "";
  }

  async sendComment() {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    let wString = localStorage.getItem('workshop');

    this.chatService.comment(user.id, wString, this.commentText).subscribe()

    await new Promise(resolve => setTimeout(resolve, 100));

    await this.chatService.getComments(wString).subscribe(data => {
      const dat = data as any;
      this.comments = dat.comments;
      this.photos = dat.photos;
      this.firstnames = dat.firstnames;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    for (let i = 0; i < this.photos.length; i++) {
      await this.wService.getPhoto(this.photos[i]).subscribe(data => {
        this.photos[i] = URL.createObjectURL(new Blob([data]));
        this.photos[i] = this.sanitizer.bypassSecurityTrustUrl(this.photos[i]);
      })
    }

    for (let i = 0; i < this.comments.length; i++) {
      const formattedDate = (new Date(this.comments[i].timestamp)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.comments[i].timestamp = formattedDate;
    }

    this.commentText = "";
  }

  async like() {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    let wString = localStorage.getItem('workshop');
    this.liked = true;
    await this.chatService.like(wString, user.username).subscribe();

    await new Promise(resolve => setTimeout(resolve, 100));

    await this.chatService.getLikes(wString).subscribe(data => {
      this.likes = data.likes;
    })
  }

  async removeLike() {
    this.liked = false;
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    let wString = localStorage.getItem('workshop');
    await this.chatService.removeLike(wString, user.username).subscribe();

    await new Promise(resolve => setTimeout(resolve, 100));

    await this.chatService.getLikes(wString).subscribe(data => {
      this.likes = data.likes;
    })
  }
  

}


import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { Chat } from '../model/chat';
import { User } from '../model/user';
import { Workshop } from '../model/workshop';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {

  form: any = {
    username: null,
    email: null,
    password: null,
    firstname: null,
    lastname: null,
    phone: null,
    type: null,
    org_name: null,
    address: null,
    tin: null,
    photo: null
  };
  errorMessage = '';
  firstPage = true;
  secondPage = false;
  thirdPage = false;
  myImage: Observable<any>;
  base64code: any;
  file: File = null;
  username: string = "";
  firstname: string = "";
  lastname: string = "";
  phone: string = "";
  email: string = "";
  myPhoto: any;
  chats: Chat[] = [];
  organizers: User[] = [];
  photos: any[] = [];
  selectedChats: Chat[] = [];
  msgs: string[] = [];
  workshops: Workshop[] = [];
  pastWorkshops: Workshop[] = [];
  info: boolean = true;
  past:boolean = false;
  actions: boolean = false;
  ch: boolean = false;
  update: boolean = false;

  ids: string[] = [];
  names: string[] = [];
  idsCom: string[] = [];
  namesCom: string[] = [];
  textsCom: string[] = [];

  constructor(private authService: UserService, private router: Router, private wService: WorkshopService, private sanitizer: DomSanitizer,
    private chatService: ChatService) { }

  async ngOnInit() {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.authService.getData(user.id).subscribe(data => {
      let dat = data as any;
      this.form.username = dat.username;
      this.username = dat.username;
      this.form.firstname = dat.firstname;
      this.firstname = dat.firstname;
      this.form.lastname = dat.lastname;
      this.lastname = dat.lastname;
      this.form.phone = dat.phone;
      this.phone = dat.phone;
      //this.form.photo = dat.photo;
      this.form.email = dat.email;
      this.email = dat.email;
    })

    this.wService.getPhoto(user.photo[0].path).subscribe(data => {
      this.myPhoto = URL.createObjectURL(new Blob([data]));
      this.myPhoto = this.sanitizer.bypassSecurityTrustUrl(this.myPhoto);
    })

    this.wService.pastUserWorkshops(user.id).subscribe((w: Workshop[]) => {
      this.pastWorkshops = w;
    })

    this.chatService.getUserLikes(user.id).subscribe(data => {
      this.ids = data.ids;
      this.names = data.names;
    })

    this.chatService.getUserComments(user.id).subscribe(data => {
      this.idsCom = data.ids;
      this.namesCom = data.names;
      this.textsCom = data.texts;
    })

    await this.chatService.getAllUserChats(user.id).subscribe((c: Chat[]) => {
      this.chats = c;
    })
    
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log(this.namesCom, this.idsCom, this.textsCom)

    for (let i = 0; i < this.chats.length; i++) {
      await this.authService.getData(this.chats[i].organizer).subscribe(data => {
        this.organizers.push(data as User);
      })
      await this.wService.getDetails(this.chats[i].workshop).subscribe(data => {
        this.workshops[i] = data[0] as Workshop;
        this.workshops[i].workshop_id = data[0]._id;
      })
    }
    
    
    await new Promise(resolve => setTimeout(resolve, 100));

    for (let i = 0; i < this.organizers.length; i++) {
      this.wService.getPhoto(this.organizers[i].photo[0].path).subscribe(data => {
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

  onSubmit(): void {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.errorMessage = "";

    if (!this.form.firstname) {
      this.errorMessage += "First name is required!\n";
    }
    if (!this.form.lastname) {
      this.errorMessage += "Last name is required!\n";
    }
    if (!this.form.phone) {
      this.errorMessage += "Phone number is required!\n";
    } else if (!/^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(this.form.phone)) {
      this.errorMessage += "Phone number is not valid!\n";
    }

    if (this.errorMessage != "") return;

    const { username, email, password, firstname, lastname, phone, type, org_name, address, tin } = this.form;

    this.authService.update(user.id, firstname, lastname, email, phone, this.file).subscribe({
      next: data => {
        this.errorMessage = "User successfully updated!";
      },
      error: err => {
        this.errorMessage = err.error.message;
      }
    });
  }

  next() {
    this.errorMessage = "";
    if (this.firstPage) {
      if (!this.form.username) {
        this.errorMessage += "Username is required!\n";
      } else if (this.form.username.length < 3 || this.form.username.length > 20) {
        this.errorMessage += "Username must be 3 to 20 characters long!\n";
      }
      if (!this.form.email) {
        this.errorMessage += "Email is required!\n";
      } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.form.email)) {
        this.errorMessage += "Invalid email format!\n";
      }
      if (this.errorMessage != "") {
        return;
      }
      this.firstPage = false;
      this.secondPage = true;
      return;
    }
  }

  prev() {
    if (this.secondPage) {
      this.errorMessage = "";
      this.secondPage = false;
      this.firstPage = true;
      return;
    }
  }

  onUpload($event: Event) {
    const target = $event.target as HTMLInputElement
    this.file = (target.files as FileList)[0]

    const observable = new Observable((subscriber: Subscriber<any>) => {
      try {
        const filereader = new FileReader()
        filereader.readAsDataURL(this.file)
        filereader.onload = () => {
          subscriber.next(filereader.result)
          subscriber.complete()
        }
  
        filereader.onerror = () => {
          subscriber.error()
          subscriber.complete()
        }
      }
      catch {
        this.errorMessage = ''
      }
    })

    observable.subscribe((d) => {
      this.myImage = d
      var img = new Image();
      img.onload = () => {
          let width = img.width
          let height = img.height
          if (width < 100 || width > 300 || height < 100 || height > 300) {
            this.errorMessage = 'Image size must be between 100x100px and 300x300px.'
            this.myImage = null
            return
          }
          this.errorMessage = ''
      }
      img.src = this.myImage.toString()
    })
  }

  async sendMsg(workshop, i) {
    if (this.msgs[i] == "") return;
    let user = JSON.parse(sessionStorage.getItem('auth-user'));

    await this.chatService.sendMsg(user.id, workshop, this.msgs[i], "participant").subscribe(error => {
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    await this.chatService.getAllUserChats(user.id).subscribe((c: Chat[]) => {
      this.chats = c;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    for (let k = 0; k < this.chats.length; k++) {
      for (let i = 0; i < this.chats[k].messages.length; i++) {
        const formattedDate = (new Date(this.chats[k].messages[i].timestamp)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        this.chats[k].messages[i].timestamp = formattedDate;
      }
      for (let i = 0; i < this.selectedChats.length; i++) {
        if (this.selectedChats[i].workshop == this.chats[k].workshop) {
          this.selectedChats[i]= this.chats[k];
          break;
        }
      }
    }

    this.msgs[i] = "";
  }

  chosen(workshop) {
    for (let i = 0; i < this.workshops.length; i++) {
      if (this.workshops[i].workshop_id == workshop && !this.selectedChats.includes(this.chats[i])) {
        this.selectedChats.push(this.chats[i]);
        this.msgs.push("");
      }
    }
  }

  sortByName() {
    this.pastWorkshops.sort((a, b) => a.name.localeCompare(b.name));
  }

  sortByDate() {
    this.pastWorkshops.sort((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime());
  }

  sortByLocation() {
    this.pastWorkshops.sort((a, b) => a.location.localeCompare(b.location));
  }

  sortByCapacity() {
    this.pastWorkshops.sort((a, b) => b.capacity - a.capacity);
  }

  selectInfo() {
    this.info = true;
    this.actions = false;
    this.past = false;
    this.ch = false;
    this.update = false;
  }

  selectActions() {
    this.info = false;
    this.actions = true;
    this.past = false;
    this.ch = false;
    this.update = false;
  }

  selectUpdate() {
    this.info = false;
    this.actions = false;
    this.past = false;
    this.ch = false;
    this.update = true;
  }

  selectPast() {
    this.info = false;
    this.actions = false;
    this.past = true;
    this.ch = false;
    this.update = false;
  }

  selectChats() {
    this.info = false;
    this.actions = false;
    this.past = false;
    this.ch = true;
    this.update = false;
  }

  removeLike(id) {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.chatService.removeLike(id, user.username).subscribe();
    this.chatService.getUserLikes(user.id).subscribe(data => {
      this.ids = data.ids;
      this.names = data.names;
    })
  }

  removeComment(id) {
    console.log(id)
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.chatService.removeComment(id).subscribe();
    this.chatService.getUserComments(user.id).subscribe(data => {
      this.idsCom = data.ids;
      this.namesCom = data.names;
      this.textsCom = data.texts;
    })
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  

}

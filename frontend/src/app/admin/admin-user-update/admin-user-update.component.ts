import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { WorkshopService } from 'src/app/services/workshop.service';

@Component({
  selector: 'app-admin-user-update',
  templateUrl: './admin-user-update.component.html',
  styleUrls: ['./admin-user-update.component.css']
})
export class AdminUserUpdateComponent implements OnInit {

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
  myPhoto: any;

  constructor(private authService: UserService, private router: Router, private wService: WorkshopService, private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    let user = localStorage.getItem('user-update');
    console.log(user)
    this.authService.getData(user).subscribe(data => {
      let dat = data as any;
      this.form.username = dat.username;
      this.form.firstname = dat.firstname;
      this.form.lastname = dat.lastname;
      this.form.phone = dat.phone;
      this.form.email = dat.email;
      this.myPhoto = dat.photo;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    this.wService.getPhoto(this.myPhoto[0].path).subscribe(data => {
      this.myPhoto = URL.createObjectURL(new Blob([data]));
      this.myPhoto = this.sanitizer.bypassSecurityTrustUrl(this.myPhoto);
    })
  }

  onSubmit(): void {
    let user = localStorage.getItem('user-update');
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

    this.authService.update(user, firstname, lastname, email, phone, this.file).subscribe({
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

}

import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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
  isOrganizer = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  firstPage = true;
  secondPage = false;
  thirdPage = false;
  myImage: Observable<any>;
  base64code: any;
  file: File;

  constructor(private authService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.errorMessage = "";
    if (this.isOrganizer) {
      if (!this.form.org_name) this.errorMessage += "Organization name is required!\n";
      if (!this.form.address) this.errorMessage += "Address is required!\n";
      if (!this.form.tin) this.errorMessage += "TIN is required!\n";
    }

    if (this.errorMessage != "") return;

    const { username, email, password, firstname, lastname, phone, type, org_name, address, tin } = this.form;

    this.authService.register(username, password, firstname, lastname, email, phone, type, org_name, address, tin, this.file).subscribe({
      next: data => {
        this.errorMessage = "User successfully registered!";
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  changeType() {
    if (this.form.type == "2") {
      this.isOrganizer = true;
    } else {
      this.isOrganizer = false;
    }
  }

  next() {
    this.errorMessage = "";
    if (this.firstPage) {
      if (!this.form.username) {
        this.errorMessage += "Username is required!\n";
      } else if (this.form.username.length < 3 || this.form.username.length > 20) {
        this.errorMessage += "Username must be 3 to 20 characters long!\n";
      }
      if (!this.form.password) {
        this.errorMessage += "Password is required!\n";
      } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!#@\$%\^&\*\.])(?=.{8,16})/.test(this.form.password)) {
        this.errorMessage += "Password must be 8 to 16 characters long!\nPassword must contain at least\none uppercase, one lowercase, one \nnumber and one special character!\n"
      } else if (!/^[a-zA-Z]/.test(this.form.password)) {
        this.errorMessage += "Password must start with a letter!\n";
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
    if (this.secondPage) {
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
      this.secondPage = false;
      this.thirdPage = true;
    }
  }

  prev() {
    if (this.secondPage) {
      this.errorMessage = "";
      this.secondPage = false;
      this.firstPage = true;
      return;
    }
    if (this.thirdPage) {
      this.errorMessage = "";
      this.thirdPage = false;
      this.secondPage = true;
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

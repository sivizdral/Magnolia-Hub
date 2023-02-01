import { Component, OnInit } from '@angular/core';
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
    tin: null
  };
  isOrganizer = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  firstPage = true;
  secondPage = false;
  thirdPage = false;

  constructor(private authService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { username, email, password, firstname, lastname, phone, type, org_name, address, tin } = this.form;

    this.authService.register(username, password, firstname, lastname, email, 1).subscribe({
      next: data => {
        console.log(data);
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
    if (this.firstPage) {
      this.firstPage = false;
      this.secondPage = true;
      return;
    }
    if (this.secondPage) {
      this.secondPage = false;
      this.thirdPage = true;
    }
  }

  prev() {
    if (this.secondPage) {
      this.secondPage = false;
      this.firstPage = true;
      return;
    }
    if (this.thirdPage) {
      this.thirdPage = false;
      this.secondPage = true;
    }
  }

}

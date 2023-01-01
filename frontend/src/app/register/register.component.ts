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
    lastname: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { username, email, password, firstname, lastname } = this.form;

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

}

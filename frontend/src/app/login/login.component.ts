import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private tokenService: TokenService) { }

  ngOnInit(): void {
  }

  username: String;
  password: String;
  message: String = "";
  forgotPass: boolean = false;
  email: String;

  login(){
    this.userService.login(this.username, this.password).subscribe(
      {
        next: data => {
          this.tokenService.saveToken(data.accessToken);
          this.tokenService.saveUser(data);
          this.router.navigate(['/passch']);
        },
        error: err => {
          this.message = err.error.message;
        }
      }
    )
  }

  forgotPassword() {
    this.forgotPass = true;
  }

  backToLogin() {
    this.forgotPass = false;
  }

  submitEmail() {
    this.userService.forgotPass(this.email).subscribe({
      error: err => {
        this.message = err.error.message;
      }
    })
  }

}

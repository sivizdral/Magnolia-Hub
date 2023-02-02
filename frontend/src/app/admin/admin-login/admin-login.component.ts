import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private tokenService: TokenService) { }

  username: String;
  password: String;
  message: String = "";
  email: String;
  user: User;

  ngOnInit(): void {
  }

  login(){
    this.userService.login(this.username, this.password).subscribe(
      {
        next: data => {
          this.tokenService.saveToken(data.accessToken);
          this.tokenService.saveUser(data);
          this.user = JSON.parse(window.sessionStorage.getItem('auth-user'));
          if (this.user.type != "admin") {
            this.message = "You are not an administrator!";
            return;
          }
          this.router.navigate(['']);
        },
        error: err => {
          this.message = err.error.message;
        }
      }
    )
  }

}

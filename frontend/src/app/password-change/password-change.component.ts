import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  constructor(private userService : UserService, private tokenService : TokenService, private router: Router) { }

  ngOnInit(): void {
  }

  message: String = "";
  password: String = "";
  confirm: String = "";
  old: String = "";

  submitPassword() {

    if (this.password == "" || this.old == "") {
      this.message = "Password is required!";
      return;
    }
    
    if (this.password != this.confirm) {
      this.message = "Password and confirmation do not match!";
      return;
    }
    const strongRegex  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/;
    const start = /^[a-zA-Z]/;
    if (!strongRegex.test(this.password.toString()) || !start.test(this.password.toString())) {
      this.message = "Password is not strong enough! It must contain at least one capital letter, one number, one special \
      character and be 8 to 16 characters in length!";
      return;
    }
    this.message = "";

    

    this.userService.changePass(this.old, this.password, this.tokenService.getUser().username).subscribe({
      next: data => {
          this.tokenService.signOut();
          this.router.navigate(['']);
      },
      error: err => {
        this.message = err.error.message;
      }
    })
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  
}

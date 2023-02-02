import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  constructor(private userService: UserService, private route:ActivatedRoute) { }

  ngOnInit(): void {
  }

  message: String = "";
  password: String = "";
  confirm: String = "";

  async submitPassword() {

    if (this.password == "") {
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
    
    const userId = this.route.snapshot.paramMap.get('userId');
    const token = this.route.snapshot.paramMap.get('token');
    console.log(this.route.snapshot.paramMap)

    this.userService.resetPass(this.password, userId, token).subscribe({
      error: err => {
        this.message = err.error.message;
      }
    })

    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!this.message) this.message = "Password successfully changed! Remember your secrets better next time ;)!";
  }

}

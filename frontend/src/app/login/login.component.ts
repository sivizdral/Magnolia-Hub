import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  username: String;
  password: String;
  message: String = "abc";

  login(){
    this.userService.login(this.username, this.password).subscribe((userFromDB: User)=>{
      if(userFromDB!=null){
        if(userFromDB.type==0){
          this.router.navigate(['user']);
        }
        else{
          this.router.navigate(['admin']);
        }
      }
      else{
        this.message="Error"
      }
    })
    
  }

}

import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserFull } from 'src/app/model/userFull';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.css']
})
export class AdminUserListComponent implements OnInit {

  constructor(private aService: AdminService) { }

  users: UserFull[] = [];
  photos: any[] = [];

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  async ngOnInit(): Promise<void> {
    await this.aService.getAllUsers().subscribe((u: UserFull[]) => {
      this.users = u;
    })
    await new Promise(resolve => setTimeout(resolve, 500));
    for (let i = this.users.length; i--; ) {
      if (this.users[i].status == 'denied') this.users.splice(i, 1);
    }
    for (let i = 0; i < this.users.length; i++) {
      const index = this.getRandomInt(11);
      const str = "assets/img/avatars/avatar" + index + ".jpg";
      this.photos[i] = str;
    }
    console.log(this.photos)
  }

  approve(user: UserFull) {
    this.aService.approve(user.username).subscribe({
      error: err => {
        console.log(err);
      }
    })
    window.location.reload();
  }

  reject(user: UserFull) {
    this.aService.reject(user.username).subscribe({
      error: err => {
        console.log(err);
      }
    })
    window.location.reload();
  }

  delete(user: UserFull) {
    this.aService.delete(user.username).subscribe({
      error: err => {
        console.log(err);
      }
    })
    window.location.reload();
  }

}

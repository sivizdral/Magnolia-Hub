import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkshopService } from 'src/app/services/workshop.service';

@Component({
  selector: 'app-consider-applications',
  templateUrl: './consider-applications.component.html',
  styleUrls: ['./consider-applications.component.css']
})
export class ConsiderApplicationsComponent implements OnInit{

  names: string[] = [];
  ids: string[] = [];

  constructor(private wService: WorkshopService, private router: Router) { }

  ngOnInit() {
    let wString = localStorage.getItem('workshop');
    this.wService.getPendingApplicants(wString).subscribe(data => {
      this.names = data.names;
      this.ids = data.ids;
    })
  }

  async accept(i) {
    let wString = localStorage.getItem('workshop');
    this.wService.acceptApplication(wString, this.ids[i]).subscribe();
    await new Promise(resolve => setTimeout(resolve, 100));
    this.wService.getPendingApplicants(wString).subscribe(data => {
      this.names = data.names;
      this.ids = data.ids;
    })
  }

  async reject(i) {
    let wString = localStorage.getItem('workshop');
    this.wService.rejectApplication(wString, this.ids[i]).subscribe();
    await new Promise(resolve => setTimeout(resolve, 100));
    this.wService.getPendingApplicants(wString).subscribe(data => {
      this.names = data.names;
      this.ids = data.ids;
    })
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }

}

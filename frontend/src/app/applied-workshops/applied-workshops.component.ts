import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Workshop } from '../model/workshop';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-applied-workshops',
  templateUrl: './applied-workshops.component.html',
  styleUrls: ['./applied-workshops.component.css']
})
export class AppliedWorkshopsComponent implements OnInit {

  constructor(private wService: WorkshopService, private readonly sanitizer: DomSanitizer, private router: Router) { }

  workshops: Workshop[] = [];
  photos: any[] = [];
  name: string = "";
  place: string = "";
  searched: boolean = false;
  late: boolean[] = [];

  async ngOnInit(): Promise<void> {
    let user = JSON.parse(sessionStorage.getItem('auth-user'))
    await this.wService.getApplied(user.id).subscribe((w: Workshop[]) => {
      this.workshops = w;
    })
    await new Promise(resolve => setTimeout(resolve, 100));
    for(let i = 0; i < this.workshops.length; i++) {
      const str = this.workshops[4].photo[0].path;
      await this.wService.getPhoto(str).subscribe(data => {
        this.photos[i] = URL.createObjectURL(new Blob([data]));
        this.photos[i] = this.sanitizer.bypassSecurityTrustUrl(this.photos[i]);
      })
    }
    for (let i = 0; i < this.workshops.length; i++) {
      let currentTime = Date.now()
      let workshopTime = this.workshops[i].date.getTime();

      let diff = workshopTime - currentTime

      if (diff < 1000 * 60 * 60 * 12) {
        this.late[i] = true;
      }
      else this.late[i] = false;
    }
  }

  click(id) {
    localStorage.setItem('workshop', id);
    this.router.navigate(['workshop-details']);
  }

  cancel(id) {
    let user = JSON.parse(sessionStorage.getItem('auth-user'))
    this.wService.cancel(user.id, id).subscribe(
      error => {
        console.log(error);
      }
    )
    window.location.reload();
  }

}

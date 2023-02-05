import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Workshop } from 'src/app/model/workshop';
import { WorkshopService } from 'src/app/services/workshop.service';

@Component({
  selector: 'app-organizer-workshops',
  templateUrl: './organizer-workshops.component.html',
  styleUrls: ['./organizer-workshops.component.css']
})
export class OrganizerWorkshopsComponent implements OnInit {

  constructor(private wService: WorkshopService, private readonly sanitizer: DomSanitizer, private router: Router) { }

  workshops: Workshop[] = [];
  photos: any[] = [];
  name: string = "";
  place: string = "";

  async ngOnInit(): Promise<void> {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    await this.wService.getAllOrganizer(user.id).subscribe((w: Workshop[]) => {
      this.workshops = w;
    })
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(this.workshops)
    for(let i = 0; i < this.workshops.length; i++) {
      const str = this.workshops[i].photo[0].path;
      await this.wService.getPhoto(str).subscribe(data => {
        this.photos[i] = URL.createObjectURL(new Blob([data]));
        this.photos[i] = this.sanitizer.bypassSecurityTrustUrl(this.photos[i]);
      })
    }
  }

  click(id) {
    localStorage.setItem('workshop', id);
    this.router.navigate(['organizer/workshop-details']);
  }
}

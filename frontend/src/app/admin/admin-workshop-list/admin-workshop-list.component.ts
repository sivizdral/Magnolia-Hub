import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Workshop } from 'src/app/model/workshop';
import { AdminService } from 'src/app/services/admin.service';
import { WorkshopService } from 'src/app/services/workshop.service';

@Component({
  selector: 'app-admin-workshop-list',
  templateUrl: './admin-workshop-list.component.html',
  styleUrls: ['./admin-workshop-list.component.css']
})
export class AdminWorkshopListComponent implements OnInit {
  constructor(private wService: WorkshopService, private readonly sanitizer: DomSanitizer, private router: Router,
    private aService: AdminService) { }

  workshops: Workshop[] = [];
  photos: any[] = [];
  name: string = "";
  place: string = "";
  searched: boolean = false;
  log: boolean = true;
  available: boolean[] = [];

  async ngOnInit(): Promise<void> {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.log = !(user == null);
    await this.wService.getAll().subscribe((w: Workshop[]) => {
      this.workshops = w;
    })
    await new Promise(resolve => setTimeout(resolve, 100));
    for(let i = 0; i < this.workshops.length; i++) {
      const str = this.workshops[i].photo[0].path;
      await this.wService.getPhoto(str).subscribe(data => {
        this.photos[i] = URL.createObjectURL(new Blob([data]));
        this.photos[i] = this.sanitizer.bypassSecurityTrustUrl(this.photos[i]);
      })
    }
    for (let i = 0; i < this.workshops.length; i++) {
      if (this.workshops[i].status == 'unapproved') {
        this.aService.canApprove(this.workshops[i].workshop_id).subscribe(data => {
          let dat = data as any;
          if (dat.message == 'Yes') this.available[i] = true;
          else this.available[i] = false;
        })
      } else this.available[i] = false;
    }
  }

  click(id) {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    if (user == null) return;
    localStorage.setItem('workshop', id);
    this.router.navigate(['workshop-details']);
  }

  async approve(id) {
    console.log(id)
    this.aService.approveProposal(id).subscribe();
    await this.wService.getAll().subscribe((w: Workshop[]) => {
      this.workshops = w;
    })
    await new Promise(resolve => setTimeout(resolve, 100));
    for(let i = 0; i < this.workshops.length; i++) {
      const str = this.workshops[i].photo[0].path;
      await this.wService.getPhoto(str).subscribe(data => {
        this.photos[i] = URL.createObjectURL(new Blob([data]));
        this.photos[i] = this.sanitizer.bypassSecurityTrustUrl(this.photos[i]);
      })
    }
    for (let i = 0; i < this.workshops.length; i++) {
      if (this.workshops[i].status == 'unapproved') {
        this.aService.canApprove(this.workshops[i].workshop_id).subscribe(data => {
          let dat = data as any;
          if (dat.message == 'Yes') this.available[i] = true;
          else this.available[i] = false;
        })
      } else this.available[i] = false;
    }
  }

  async reject(id) {
    this.aService.rejectProposal(id).subscribe();
    await this.wService.getAll().subscribe((w: Workshop[]) => {
      this.workshops = w;
    })
    await new Promise(resolve => setTimeout(resolve, 100));
    for(let i = 0; i < this.workshops.length; i++) {
      const str = this.workshops[i].photo[0].path;
      await this.wService.getPhoto(str).subscribe(data => {
        this.photos[i] = URL.createObjectURL(new Blob([data]));
        this.photos[i] = this.sanitizer.bypassSecurityTrustUrl(this.photos[i]);
      })
    }
    for (let i = 0; i < this.workshops.length; i++) {
      if (this.workshops[i].status == 'unapproved') {
        this.aService.canApprove(this.workshops[i].workshop_id).subscribe(data => {
          let dat = data as any;
          if (dat.message == 'Yes') this.available[i] = true;
          else this.available[i] = false;
        })
      } else this.available[i] = false;
    }
  }

  async delete(id) {
    this.wService.delete(id).subscribe();
    await this.wService.getAll().subscribe((w: Workshop[]) => {
      this.workshops = w;
    })
    await new Promise(resolve => setTimeout(resolve, 100));
    for(let i = 0; i < this.workshops.length; i++) {
      const str = this.workshops[i].photo[0].path;
      await this.wService.getPhoto(str).subscribe(data => {
        this.photos[i] = URL.createObjectURL(new Blob([data]));
        this.photos[i] = this.sanitizer.bypassSecurityTrustUrl(this.photos[i]);
      })
    }
    for (let i = 0; i < this.workshops.length; i++) {
      if (this.workshops[i].status == 'unapproved') {
        this.aService.canApprove(this.workshops[i].workshop_id).subscribe(data => {
          let dat = data as any;
          if (dat.message == 'Yes') this.available[i] = true;
          else this.available[i] = false;
        })
      } else this.available[i] = false;
    }
  }

  update(id) {
    localStorage.setItem('workshop', id);
    this.router.navigate(['admin/update-workshop']);
  }

}

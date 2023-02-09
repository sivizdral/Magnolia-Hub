import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Workshop } from '../model/workshop';
import { WorkshopService } from '../services/workshop.service';

@Pipe({ name: 'safeResourceUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  public transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-all-workshops',
  templateUrl: './all-workshops.component.html',
  styleUrls: ['./all-workshops.component.css']
})
export class AllWorkshopsComponent implements OnInit {

  constructor(private wService: WorkshopService, private readonly sanitizer: DomSanitizer, private router: Router) { }

  workshops: Workshop[] = [];
  photos: any[] = [];
  name: string = "";
  place: string = "";
  searched: boolean = false;

  async ngOnInit(): Promise<void> {
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
      const formattedDate = (new Date(this.workshops[i].date)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.workshops[i].date = formattedDate;
    }
  }

  async search() {
    this.searched = true;
    await this.wService.searchByCriteria(this.name, this.place).subscribe((w: Workshop[]) => {
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
      const formattedDate = (new Date(this.workshops[i].date)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.workshops[i].date = formattedDate;
    }
  }

  async backToSearch() {
    this.searched = false;
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
      const formattedDate = (new Date(this.workshops[i].date)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.workshops[i].date = formattedDate;
    }
  }

  async sortByName() {
    await this.wService.sort(this.name, this.place, "name").subscribe((w: Workshop[]) => {
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
      const formattedDate = (new Date(this.workshops[i].date)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.workshops[i].date = formattedDate;
    }
  }

  async sortByDate() {
    await this.wService.sort(this.name, this.place, "date").subscribe((w: Workshop[]) => {
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
      const formattedDate = (new Date(this.workshops[i].date)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.workshops[i].date = formattedDate;
    }
  }

  click(id) {
    localStorage.setItem('workshop', id);
    this.router.navigate(['workshop-details']);
  }

}

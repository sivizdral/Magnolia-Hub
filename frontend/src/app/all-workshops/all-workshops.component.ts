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
      const str = this.workshops[4].photo[0].path;
      await this.wService.getPhoto(str).subscribe(data => {
        this.photos[i] = URL.createObjectURL(new Blob([data]));
        this.photos[i] = this.sanitizer.bypassSecurityTrustUrl(this.photos[i]);
      })
    }
  }

  async search() {
    this.searched = true;
    await this.wService.searchByCriteria(this.name, this.place).subscribe((w: Workshop[]) => {
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
  }

  async backToSearch() {
    this.searched = false;
    await this.wService.getAll().subscribe((w: Workshop[]) => {
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
  }

  async sortByName() {
    await this.wService.sort(this.name, this.place, "name").subscribe((w: Workshop[]) => {
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
  }

  async sortByDate() {
    await this.wService.sort(this.name, this.place, "date").subscribe((w: Workshop[]) => {
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
  }

  click(id) {
    localStorage.setItem('workshop', id);
    this.router.navigate(['workshop-details']);
  }

}

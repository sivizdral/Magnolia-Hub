import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Workshop } from '../model/workshop';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {

  constructor(private wService: WorkshopService, private readonly sanitizer: DomSanitizer) { }

  log: boolean = false;
  workshops: Workshop[] = [];
  photos: any[] = [];
  

  async ngOnInit(): Promise<void> {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.log = !(user == null);
    await this.wService.getMostLiked().subscribe((w: Workshop[]) => {
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
    await new Promise(resolve => setTimeout(resolve, 100));
    for (let i = 0; i < this.workshops.length; i++) {
      const formattedDate = (new Date(this.workshops[i].date)).toLocaleDateString("en-GB", { year: "numeric", month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      this.workshops[i].date = formattedDate;
    }
  }

}

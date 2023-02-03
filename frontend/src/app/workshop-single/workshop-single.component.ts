import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { User } from '../model/user';
import { Workshop } from '../model/workshop';
import { TokenService } from '../services/token.service';
import { WorkshopService } from '../services/workshop.service';

declare var baguetteBox: any;

@Component({
  selector: 'app-workshop-single',
  templateUrl: './workshop-single.component.html',
  styleUrls: ['./workshop-single.component.css']
})
export class WorkshopSingleComponent implements OnInit {

  constructor(private wService: WorkshopService, private tService: TokenService) { }
  
  images: GalleryItem[];
  workshops: Workshop[] = [];
  available: boolean = false;
  message: string = "";

  ngOnInit() {
    let wString = localStorage.getItem('workshop');
    this.wService.getDetails(wString).subscribe((w: Workshop[]) => {
      this.workshops = w;
    })

    this.wService.getAvailablePlaces(wString).subscribe(data => {
      const avail = data['availablePlaces'];
      this.available = avail > 0;
    })

    this.images = [
      new ImageItem({ src: 'assets/img/admin2.jpg', thumb: 'Alpha' }),
      new ImageItem({ src: 'assets/img/admin2.jpg', thumb: 'Alpha' })
    ];
  }

  getMapURL() {
    //let address: string[] = this.workshop.location.split(' ')
    let address: string[] = ['Belgrade'];
    let address2 = address.join('%20')
    return `https://maps.google.com/maps?q=${address2}&t=&z=13&ie=UTF8&iwloc=&output=embed`
  }

  reserve() {
    console.log("HERE")
    let wString = localStorage.getItem('workshop');
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.wService.apply(wString, user.id).subscribe(data => {
      this.message = data.message;
    }, error => {
      this.message = error.error.message;
    })
  }

}

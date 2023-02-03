import { Component, OnInit } from '@angular/core';
import {baguetteBox} from 'baguettebox.js'
import { GalleryItem, ImageItem } from 'ng-gallery';

declare var baguetteBox: any;

@Component({
  selector: 'app-workshop-single',
  templateUrl: './workshop-single.component.html',
  styleUrls: ['./workshop-single.component.css']
})
export class WorkshopSingleComponent implements OnInit {

  constructor() { }
  
  images: GalleryItem[];

  ngOnInit() {
    this.images = [
      new ImageItem({ src: 'assets/img/admin2.jpg', thumb: 'Alpha' })
    ];
}

}

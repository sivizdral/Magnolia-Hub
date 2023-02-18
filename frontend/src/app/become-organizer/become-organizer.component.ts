import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-become-organizer',
  templateUrl: './become-organizer.component.html',
  styleUrls: ['./become-organizer.component.css']
})
export class BecomeOrganizerComponent implements OnInit {
  
  form: any = {
    name: null,
    date: null,
    location: null,
    short: null,
    long: null,
    photo: null,
    gallery: null,
    capacity: null
  };
  errorMessage = '';
  firstPage = true;
  secondPage = false;
  myImage: Observable<any>;
  base64code: any;
  file!: File;
  realfile: File;
  gallery: File[] = [];
  workshop: string = "";
  names: string[] = [];
  ids: string[] = [];
  pho: any[] = [];
  gal: any[] = [];

  constructor(private wService: WorkshopService, private router: Router) { }

  async ngOnInit() {
  }

  async onSubmit() {
    this.errorMessage = "";

    if (!this.form.short) {
      this.errorMessage += "Short description is required!\n";
    }
    if (!this.form.long) {
      this.errorMessage += "Long description is required!\n";
    }
    if (!this.form.capacity) {
      this.errorMessage += "Capacity is required!\n";
    }
    if (this.errorMessage != "") {
      return;
    }

    if (this.errorMessage != "") return;
    let user = JSON.parse(sessionStorage.getItem('auth-user'));

    const { name, date, location, short, long, photo, gallery, capacity } = this.form;

    await this.wService.create(name, date, location, short, long, user.id, this.file, capacity).subscribe({
      next: data => {
        this.errorMessage = "Workshop successfully submitted!";
        this.workshop = data.workshop_id;
      },
      error: err => {
        this.errorMessage = err.error.message;
      }
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    await this.wService.updateStatus(this.workshop, "proposed").subscribe({
      
    });

    await this.wService.addGallery(this.workshop, this.gallery).subscribe();
  }

  next() {
    this.errorMessage = "";
    if (this.firstPage) {
      if (!this.form.name) {
        this.errorMessage += "Name is required!\n";
      }
      if (!this.form.date) {
        this.errorMessage += "Date is required!\n";
      }
      if (!this.form.location) {
        this.errorMessage += "Location is required!\n";
      }
      if (!this.form.photo && !this.file) {
        this.errorMessage += "Photo is required!\n";
      }
      if (this.errorMessage != "") {
        return;
      }
      this.firstPage = false;
      this.secondPage = true;
      return;
    }
  }

  prev() {
    if (this.secondPage) {
      this.errorMessage = "";
      this.secondPage = false;
      this.firstPage = true;
      return;
    }
  }

  onUpload($event: Event) {
    const target = $event.target as HTMLInputElement
    this.file = (target.files as FileList)[0]
  }

  onUploadGallery($event: Event) {
    this.gallery = [];
    const target = $event.target as HTMLInputElement
    let list = (target.files as FileList)
    for (let i = 0; i < list.length; i++) {
      this.gallery.push(list[i]);
    }
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}

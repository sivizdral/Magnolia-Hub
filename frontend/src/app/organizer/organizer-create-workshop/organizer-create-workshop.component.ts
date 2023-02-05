import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { WorkshopService } from 'src/app/services/workshop.service';

@Component({
  selector: 'app-organizer-create-workshop',
  templateUrl: './organizer-create-workshop.component.html',
  styleUrls: ['./organizer-create-workshop.component.css']
})
export class OrganizerCreateWorkshopComponent implements OnInit {
  
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
  file: File;
  gallery: File[] = [];
  workshop: string = "";
  names: string[] = [];
  ids: string[] = [];

  constructor(private wService: WorkshopService) { }

  async ngOnInit() {
    await this.wService.getAllJSON().subscribe(data => {
      this.names = data.names;
      this.ids = data.ids;
    })

    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(this.names);
    console.log(this.ids);
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

    console.log(date)

    

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
      if (!this.form.photo) {
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
    const target = $event.target as HTMLInputElement
    let list = (target.files as FileList)
    for (let i = 0; i < list.length; i++) {
      this.gallery.push(list[i]);
    }
  }

}

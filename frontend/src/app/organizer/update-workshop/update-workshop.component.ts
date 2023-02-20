import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkshopService } from 'src/app/services/workshop.service';
import * as moment from 'moment';
import { Workshop } from 'src/app/model/workshop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-workshop',
  templateUrl: './update-workshop.component.html',
  styleUrls: ['./update-workshop.component.css']
})
export class UpdateWorkshopComponent implements OnInit {
  
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
  file: File = null;
  realfile: File;
  gallery: File[] = [];
  workshop: string = "";
  names: string[] = [];
  ids: string[] = [];
  pho: any[] = [];
  gal: any[] = [];
  workshops: Workshop[] = [];
  org: boolean = false;

  constructor(private wService: WorkshopService, private router: Router) { }

  async ngOnInit() {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.org = (user.type == 'organizer');

    let wString = localStorage.getItem('workshop');
    this.wService.getDetails(wString).subscribe((w: Workshop[]) => {
      this.workshops = w;
      this.form.name = w[0].name;
      this.form.date = (new Date(w[0].date)).toISOString().slice(0, 16);;
      this.form.location = w[0].location;
      this.form.short = w[0].short_description;
      this.form.long = w[0].long_description;
      this.form.capacity = w[0].capacity;
    })

    await new Promise(resolve => setTimeout(resolve, 100));
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

    let wString = localStorage.getItem('workshop');

    await this.wService.update(wString, name, date, location, short, long, capacity, this.file).subscribe({
      next: data => {
        this.errorMessage = "Workshop successfully updated!";
        this.workshop = data.workshop_id;
      },
      error: err => {
        this.errorMessage = err.error.message;
      }
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    if (this.gallery.length > 0) await this.wService.addGallery(this.workshop, this.gallery).subscribe();

    await new Promise(resolve => setTimeout(resolve, 100));

    if (this.errorMessage == "") this.errorMessage = "Successfully updated!"
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

  async getDataFromJSON(i) {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    await this.wService.loadJSON(this.ids[i], user.id).subscribe(data => {
      this.form.name = data.name;
      this.form.date = moment(data.date).format("YYYY-MM-DDTHH:mm:ss.SSS");;
      console.log(data.date)
      this.form.location = data.location;
      this.form.short = data.short_description;
      this.form.long = data.long_description;
      this.form.capacity = data.capacity;
      this.pho = data.photo[0].path;
      this.gal = data.gallery;
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    console.log(this.gal)

    await this.wService.getPhoto(this.pho).subscribe(data => {
      this.file = data;
    })

    await new Promise(resolve => setTimeout(resolve, 100));
    this.file = new File([this.file], "photo.png", {lastModified: 1534584790000, type: 'image/png'});
    

    for (let i = 0; i < this.gal.length; i++) {
      await this.wService.getPhoto(this.gal[i].path).subscribe(data => {
        this.gallery[i] = data;
        this.gallery[i] = new File([this.gallery[i]], "gallery_item.png", {lastModified: 1534584790000, type: 'image/png'});
      })
    }
    
  }

  blobToFile(theBlob: Blob, fileName:string): File {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
}

logOut() {
  sessionStorage.clear();
  this.router.navigate(['']);
}

}


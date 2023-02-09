import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { WorkshopService } from 'src/app/services/workshop.service';
import * as moment from 'moment';

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
  file!: File;
  realfile: File;
  gallery: File[] = [];
  workshop: string = "";
  names: string[] = [];
  ids: string[] = [];
  pho: any[] = [];
  gal: any[] = [];

  constructor(private wService: WorkshopService) { }

  async ngOnInit() {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    await this.wService.getAllJSON(user.id).subscribe(data => {
      this.names = data.names;
      this.ids = data.ids;
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

    console.log(date)
    console.log(this.file)
    console.log(this.realfile)

    

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

    await new Promise(resolve => setTimeout(resolve, 100));

    if (this.errorMessage == "") this.errorMessage = "Successfully submitted!"
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

}

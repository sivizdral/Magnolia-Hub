import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  log: boolean = true;
  org: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    let user = JSON.parse(sessionStorage.getItem('auth-user'));
    this.log = !(user == null);
    if (this.log) this.org = (user.type == 'organizer');
    const translate = document.querySelectorAll(".translate");
const big_title = document.querySelector(".big-title") as HTMLElement;
const header = document.querySelector("header") as HTMLElement;
const shadow = document.querySelector(".shadow") as HTMLElement;
const content = document.querySelector(".content") as HTMLElement;
const section = document.querySelector("section") as HTMLElement;
const image_container = document.querySelector(".imgContainer") as HTMLElement;
const opacity = document.querySelectorAll(".opacity");
const border = document.querySelector(".border") as HTMLElement;

let header_height = header.offsetHeight;
let section_height = section.offsetHeight;

window.addEventListener('scroll', () => {
    let scroll = window.pageYOffset;
    let sectionY = section.getBoundingClientRect();

    translate.forEach(element => {
        let speed = +(element as HTMLElement).dataset['speed'];
        (element as HTMLElement).style.transform = `translateY(${scroll * speed}px)`;
    });

    opacity.forEach(element => {
      (element as HTMLElement).style.opacity = (scroll / (sectionY.top + section_height)) + "";
    })

    big_title.style.opacity = (-scroll / (header_height / 2) + 1) + "";
    shadow.style.height = `${scroll * 0.5 + 300}px`;

    content.style.transform = `translateY(${scroll / (section_height + sectionY.top) * 50 - 50}px)`;
    image_container.style.transform = `translateY(${scroll / (section_height + sectionY.top) * -50 + 50}px)`;

    border.style.width = `${scroll / (sectionY.top + section_height) * 30}%`;
})
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }

}

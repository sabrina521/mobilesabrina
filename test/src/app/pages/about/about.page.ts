import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private router: Router) {
   }

  ngOnInit() {
  }
  logOut() {
    localStorage.removeItem("email");
    localStorage.removeItem("isAdmin"); 
    this.router.navigate(["/signin"]);
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-about',
  templateUrl: './user-about.component.html',
  styleUrls: ['./user-about.component.css'],
})
export class UserAboutComponent implements OnInit {
  UserId!: number;
  FullName!: string;
  Identification!: string;
  PhoneNumber!: string;
  Email!: string;
  IsActive!: boolean;
  Address!: string;
  Roles!: string[];

  ngOnInit() {
    const currentUserString = localStorage.getItem('currentUser');

    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);

      this.UserId = currentUser.user.UserId;
      this.FullName = currentUser.user.FullName;
      this.Identification = currentUser.user.Identification;
      this.PhoneNumber = currentUser.user.PhoneNumber;
      this.Email = currentUser.user.Email;
      this.IsActive = currentUser.user.IsActive;
      this.Address = currentUser.user.Address;
      this.Roles = currentUser.user.Roles;
    }
  }
}

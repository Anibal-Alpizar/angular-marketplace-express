import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/share/users.service';
import { NotificationService } from 'src/app/share/notification.service';
import { IMAGECLIENT, IMAGEVENDOR } from 'src/app/constants/images.constants';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchText: string = '';
  showActiveUsers: boolean = true;
  showInactiveUsers: boolean = true;

  constructor(
    private userService: UsersService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.list('/users').subscribe(
      (response) => {
        if (response.status && response.data && Array.isArray(response.data)) {
          this.users = response.data;
          this.filteredUsers = this.users;
        } else {
          this.notificationService.showError('Error fetching users');
        }
      },
      (error) => {
        this.notificationService.showError('Error fetching users');
      }
    );
  }

  searchUsers(): void {
    this.filteredUsers = this.users.filter((user) => {
      const nameMatches = user.FullName.toLowerCase().includes(
        this.searchText.toLowerCase()
      );
      if (this.showActiveUsers && this.showInactiveUsers) {
        return nameMatches;
      } else if (this.showActiveUsers) {
        return user.IsActive && nameMatches;
      } else if (this.showInactiveUsers) {
        return !user.IsActive && nameMatches;
      }
      return false;
    });
  }

  getUserImage(user: any): string {
    if (user.Roles.includes('Vendor')) {
      return IMAGEVENDOR;
    } else {
      return IMAGECLIENT;
    }
  }

  updateUserStatus(userId: number, isActive: boolean): void {
    this.userService.updateUserStatus(userId, isActive).subscribe(
      (data) => {
        const updatedUserIndex = this.users.findIndex(
          (user) => user.UserId === userId
        );
        if (updatedUserIndex !== -1) {
          this.users[updatedUserIndex].IsActive = isActive;
        }
        console.log('User status updated successfully:', data);
        this.notificationService.showSuccess('Estado de usuario actualizado');
      },
      (error) => {
        console.error('Error updating user status:', error);
        this.notificationService.showError(
          'Error actualizando estado de usuario'
        );
      }
    );
  }
}

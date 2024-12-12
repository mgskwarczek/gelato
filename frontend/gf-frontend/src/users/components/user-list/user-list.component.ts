import { Component, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../app/common/components/button/button.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PopupComponent } from '../../../app/common/components/popup/popup.component';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    ButtonComponent,
    MatPaginatorModule,
    MatIconModule,
    PopupComponent,
    MatSnackBarModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  faEdit = faEdit;
  faTrash = faTrash;

  @Input() users: User[] = [];
  @Output() editUser = new EventEmitter<number>();
  @Output() deleteUser = new EventEmitter<number>();
  @Output() userDeleted = new EventEmitter<void>();

  isPopupVisible: boolean = false;
  selectedUserId: number | undefined;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  onEditClick(userId: number | undefined): void {
    if (userId !== undefined) {
      this.editUser.emit(userId);
    }
  }

  onDeleteClick(userId: number | undefined): void {
    if (userId !== undefined) {
      this.selectedUserId = userId;
      this.showDeletePopup();
    }
  }

  navigateToCreateUser() {
    this.router.navigate(['/create-user']);
  }

  showDeletePopup(): void {
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
    this.selectedUserId = undefined;
  }

  confirmDelete(): void {
    if (this.selectedUserId !== undefined) {
      this.userService.deleteUser(this.selectedUserId).subscribe({
        next: () => {
          this.snackBar.open('User successfully deleted.', 'Close', {
            duration: 5000,
          });
          this.closePopup();
          this.userDeleted.emit();
        },
        error: (err) => {
          console.error('Error deleting user: ', err);
          this.snackBar.open(
            'Failed to delete user. Please try again.',
            'Close',
            {
              duration: 5000,
            },
          );
          this.closePopup();
        },
      });
    }
  }
}

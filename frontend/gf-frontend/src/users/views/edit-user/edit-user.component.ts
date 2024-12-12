import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../app/common/components/button/button.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownComponent } from '../../../app/common/components/dropdown/dropdown.component';
import { InputGroupComponent } from '../../../app/common/components/input-group/input-group.component';
import { SideBarComponent } from '../../../app/common/components/side-bar/side-bar.component';
import { NavBarComponent } from '../../../app/common/components/nav-bar/nav-bar.component';
import { UserService } from '../../services/user.service';
import { UserUpdateDto } from '../../interfaces/user-update-dto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupComponent } from '../../../app/common/components/popup/popup.component';
@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    DropdownComponent,
    InputGroupComponent,
    SideBarComponent,
    NavBarComponent,
    ReactiveFormsModule,
    MatSnackBarModule,
    PopupComponent,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  isSubmitted: boolean = false;
  roles: any[] = [];
  updateUserForm: FormGroup;
  userId!: number;

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.updateUserForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.loadRoles();
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getById(this.userId).subscribe({
      next: (user) => {
        this.updateUserForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roleId:
            this.roles.find((role) => role.name === user.roleName)?.id || '',
        });
        console.log('Zaktualizowany formularz: ', this.updateUserForm.value);
      },
      error: (err) => {
        console.log('Error loading user data: ', err);
      },
    });
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.log('Error loading roles: ', err);
      },
    });
  }

  editUser() {
    this.isSubmitted = true;
    const updatedUser: UserUpdateDto = {
      ...this.updateUserForm.value,
      id: this.userId,
      roleId: this.updateUserForm.value.roleId,
    };

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: () => {
        console.log('User has been updated.');
        this.snackBar.open('User has been successfully updated.', 'Close', {
          duration: 5000,
        });
        this.navigateToAdminPanel();
      },
      error: (err) => {
        console.log('Error editing user: ', err);
      },
    });
  }

  navigateToAdminPanel() {
    this.router.navigate(['/admin']);
  }

  isPopupVisible: boolean = false;
  showPopup(): void {
    if (this.updateUserForm.valid) {
      this.isPopupVisible = true;
    }
  }

  confirmPopup() {
    this.editUser();
    this.isPopupVisible = false;
  }
  closePopup() {
    this.isPopupVisible = false;
  }
}

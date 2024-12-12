import { Component } from '@angular/core';

import {
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../app/common/components/button/button.component';
import { NavBarComponent } from '../../../app/common/components/nav-bar/nav-bar.component';
import { SideBarComponent } from '../../../app/common/components/side-bar/side-bar.component';
import { InputGroupComponent } from '../../../app/common/components/input-group/input-group.component';
import { PopupComponent } from '../../../app/common/components/popup/popup.component';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    RouterLink,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ButtonComponent,
    NavBarComponent,
    SideBarComponent,
    InputGroupComponent,
    PopupComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';

  faArrowLeft = faArrowLeft;

  changePasswordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.changePasswordForm = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator },
    );
  }

  isPopupVisible: boolean = false;

  passwordMatchValidator(group: FormGroup): any {
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { notMatching: true };
  }

  showPopup(): void {
    if (this.changePasswordForm.valid) {
      this.isPopupVisible = true;
    }
  }

  confirmPopup() {
    this.changePassword();
    this.isPopupVisible = false;
  }

  changePassword(): void {
    const userId = 101;

    const { currentPassword, newPassword } = this.changePasswordForm.value;
    const requestPayload = {
      userId: userId,
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    this.userService.changePassword(requestPayload).subscribe({
      next: () => {
        console.log('Password has been changed.');
        this.snackBar.open('Password has been successfully changed.', 'Close', {
          duration: 5000,
        });
      },
      error: (err) => {
        console.error('Error changing password: ', err);
      },
    });
  }

  closePopup() {
    this.isPopupVisible = false;
  }
}

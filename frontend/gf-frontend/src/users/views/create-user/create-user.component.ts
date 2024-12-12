import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../app/common/components/button/button.component';
import { InputGroupComponent } from '../../../app/common/components/input-group/input-group.component';
import { DropdownComponent } from '../../../app/common/components/dropdown/dropdown.component';
import { SideBarComponent } from '../../../app/common/components/side-bar/side-bar.component';
import { NavBarComponent } from '../../../app/common/components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopupComponent } from '../../../app/common/components/popup/popup.component';
@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    ButtonComponent,
    DropdownComponent,
    InputGroupComponent,
    SideBarComponent,
    PopupComponent,
    NavBarComponent,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent implements OnInit {
  faInfoCircle = faInfoCircle;
  showTooltip = false;

  createUserForm: FormGroup;
  isSubmitted: boolean = false;
  isPopupVisible: boolean = false;
  roles: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
  ) {
    this.createUserForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      roleId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
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

  createUser(): void {
    this.isSubmitted = true;
    const userCreateDto = this.createUserForm.value;
    const roleId = userCreateDto.roleId?.id || userCreateDto.roleId;
    const userPayload = {
      firstName: userCreateDto.firstName,
      lastName: userCreateDto.lastName,
      email: userCreateDto.email,
      password: userCreateDto.password,
      roleId: roleId,
    };
    this.userService.createUser(userPayload).subscribe({
      next: () => {
        console.log('User created.');
        this.snackBar.open('User was successfully created.', 'Close', {
          duration: 5000,
        });
        this.navigateToAdminPanel();
      },
      error: (err) => {
        console.log('Error creating user: ', err);
      },
    });
  }
  navigateToAdminPanel() {
    this.router.navigate(['/admin']);
  }

  showPopup(): void {
    if (this.createUserForm.valid) {
      this.isPopupVisible = true;
    }
  }

  confirmPopup() {
    this.createUser();
    this.isPopupVisible = false;
  }

  closePopup() {
    this.isPopupVisible = false;
  }
}

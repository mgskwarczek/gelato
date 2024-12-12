import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../../app/common/components/nav-bar/nav-bar.component';
import { SideBarComponent } from '../../../app/common/components/side-bar/side-bar.component';
import { DropdownComponent } from '../../../app/common/components/dropdown/dropdown.component';
import { DateRangePickerComponent } from '../../../app/common/components/date-range-picker/date-range-picker.component';
import { ButtonComponent } from '../../../app/common/components/button/button.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { InputGroupComponent } from '../../../app/common/components/input-group/input-group.component';
import { HttpClientModule } from '@angular/common/http';
import {
  FormsModule,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { DatePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    SideBarComponent,
    NavBarComponent,
    DropdownComponent,
    DateRangePickerComponent,
    ButtonComponent,
    UserListComponent,
    InputGroupComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
  ],
  providers: [DatePipe],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  users: User[] = [];
  searchForm: FormGroup;
  searchMessage: string = '';
  firstName = '';
  lastName = '';
  email = '';
  roleName = '';
  roles: any[] = [];
  totalUsers: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: number = 0;
  selectedRoleName: string = '';

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.searchForm = this.formBuilder.group(
      {
        firstName: [''],
        lastName: [''],
        email: [''],
        roleName: [''],
        creationLowerDate: [''],
        creationUpperDate: [''],
        modificationLowerDate: [''],
        modificationUpperDate: [''],
        deletionLowerDate: [''],
        deletionUpperDate: [''],
      },
      { validators: this.dateRangeValidator() },
    );
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }
  dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const errors: any = {};

      const creationFromDate = group.get('creationLowerDate')?.value;
      const creationToDate = group.get('creationUpperDate')?.value;
      if (creationFromDate && creationToDate) {
        const from = new Date(creationFromDate);
        const to = new Date(creationToDate);
        if (from > to) {
          errors.creationDateRangeInvalid = true;
        }
      }

      const modificationFromDate = group.get('modificationLowerDate')?.value;
      const modificationToDate = group.get('modificationUpperDate')?.value;
      if (modificationFromDate && modificationToDate) {
        const from = new Date(modificationFromDate);
        const to = new Date(modificationToDate);
        if (from > to) {
          errors.modificationDateRangeInvalid = true;
        }
      }
      const deletionFromDate = group.get('deletionLowerDate')?.value;
      const deletionToDate = group.get('deletionUpperDate')?.value;
      if (deletionFromDate && deletionToDate) {
        const from = new Date(deletionFromDate);
        const to = new Date(deletionToDate);
        if (from > to) {
          errors.deletionDateRangeInvalid = true;
        }
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        console.log(this.roles);
      },
      error: (err) => {
        console.error('Error loading roles:', err);
      },
    });
  }

  onRoleChange(event: any): void {
    const selectedRoleId = Number(event.target.value);
    const selectedRole = this.roles.find((role) => role.id === selectedRoleId);
    if (selectedRole) {
      this.selectedRoleName = selectedRole.name;
    }
    this.searchForm.patchValue({
      roleName: this.selectedRoleName,
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalUsers = response.totalItems;
        this.pageIndex = response.currentPage;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      if (this.searchForm.errors?.['creationDateRangeInvalid']) {
        this.snackBar.open(
          '"Creation From" date cannot be later than "Creation To" date.',
          'Close',
          {
            duration: 5000,
            verticalPosition: 'top',
          },
        );
      }

      if (this.searchForm.errors?.['modificationDateRangeInvalid']) {
        this.snackBar.open(
          '"Modification From" date cannot be later than "Modification To" date.',
          'Close',
          {
            duration: 5000,
            verticalPosition: 'top',
          },
        );
      }

      if (this.searchForm.errors?.['deletionDateRangeInvalid']) {
        this.snackBar.open(
          '"Deletion From" date cannot be later than "Deletion To" date.',
          'Close',
          {
            duration: 5000,
            verticalPosition: 'top',
          },
        );
      }
      return;
    }

    const formValues = this.searchForm.value;

    formValues.creationLowerDate = formValues.creationLowerDate
      ? `${formValues.creationLowerDate}T00:00:00`
      : '';
    formValues.creationUpperDate = formValues.creationUpperDate
      ? `${formValues.creationUpperDate}T23:59:59`
      : '';
    formValues.modificationLowerDate = formValues.modificationLowerDate
      ? `${formValues.modificationLowerDate}T00:00:00`
      : '';
    formValues.modificationUpperDate = formValues.modificationUpperDate
      ? `${formValues.modificationUpperDate}T23:59:59`
      : '';
    formValues.deletionLowerDate = formValues.deletionLowerDate
      ? `${formValues.deletionLowerDate}T00:00:00`
      : '';
    formValues.deletionUpperDate = formValues.deletionUpperDate
      ? `${formValues.deletionUpperDate}T23:59:59`
      : '';

    if (
      formValues.firstName ||
      formValues.lastName ||
      formValues.email ||
      formValues.roleName ||
      formValues.creationLowerDate ||
      formValues.creationUpperDate ||
      formValues.modificationLowerDate ||
      formValues.modificationUpperDate ||
      formValues.deletionLowerDate ||
      formValues.deletionUpperDate
    ) {
      this.userService
        .searchUsers(formValues, this.pageIndex, this.pageSize)
        .subscribe({
          next: (response) => {
            this.users = response.users;
            this.totalUsers = response.totalItems;
            this.pageIndex = response.currentPage;
          },
          error: (err) => {
            console.error('Error searching users:', err);
          },
        });
    } else {
      this.loadUsers();
    }
  }

  onPageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.onSearch();
  }

  onEditUser(userId: number): void {
    this.router.navigate(['/edit-user', userId]);
  }

  onDeleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== userId);
          this.totalUsers -= 1;
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        },
      });
    }
  }
}

import { Component } from '@angular/core';
import { SideBarComponent } from '../../../app/common/components/side-bar/side-bar.component';
import { NavBarComponent } from '../../../app/common/components/nav-bar/nav-bar.component';
import { ButtonComponent } from '../../../app/common/components/button/button.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { PopupComponent } from '../../../app/common/components/popup/popup.component';
import { User } from '../../interfaces/user';
import { Shop } from '../../interfaces/shop';
import { UsersShops } from '../../interfaces/users-shops';
import { ShopService } from '../../services/shop.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEdit,
  faTrash,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

export interface ShopCreateDto {
  shopName: string;
}
export interface ShopDetailsDto {
  shopName: string;
}

@Component({
  selector: 'app-shop-management',
  standalone: true,
  imports: [
    PopupComponent,
    CommonModule,
    SideBarComponent,
    NavBarComponent,
    ButtonComponent,
    MatTabsModule,
    FormsModule,
    MatSnackBarModule,
    FontAwesomeModule,
  ],
  templateUrl: './shop-management.component.html',
  styleUrl: './shop-management.component.css',
})
export class ShopManagementComponent {
  faEdit = faEdit;
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;

  constructor(
    private shopService: ShopService,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

shops: Shop[] = [];
  isAddPopupVisible: boolean = false;
  isDeletePopupVisible: boolean = false;
  selectedShop: Shop | null = null;
  users: User[] = [];
  selectedEmployees: User[] = [];
  selectedUser: User | null = null;
  usersNotInShop: User[] = [];
  usersShops: UsersShops[] = [];
  firstName: string = '';
  lastName: string = '';
  email: string = '';
 shopName: string = '';
  isShopInfoPopupVisible: boolean = false;
  selectedShopForInfo: ShopDetailsDto | null = null;
  showPopupActions: boolean = true;
  isEditShopPopupVisible: boolean = false;
  shopToEdit: Shop | null = null;
  isShopEditMode: boolean = true;
  shopToDelete: Shop | null = null;
  isDeleteShopPopup: boolean = false;
  isShopDeletePopupVisible: boolean = false;
  isAddShopPopupVisible = false;
  newShop: string = '';

  ngOnInit(): void {
    this.shopSearchTerms
      .pipe(debounceTime(2), distinctUntilChanged())
      .subscribe((term) => this.searchShop(term));

    this.employeeSearchTerms
      .pipe(debounceTime(2), distinctUntilChanged())
      .subscribe(({ firstName, lastName, email }) =>
        this.searchEmployees(
          this.selectedShop?.id,
          firstName,
          lastName,
          email,
        ),
      );

    this.nonEmployeesSearchTerms
      .pipe(debounceTime(2), distinctUntilChanged())
      .subscribe(({ firstName, lastName, email }) =>
        this.searchUsersNotInTeam(
          this.selectedShop?.id,
          firstName,
          lastName,
          email,
        ),
      );

    this.loadShops();
  }

  private shopSearchTerms = new Subject<string>();
  private employeeSearchTerms = new Subject<{
    firstName?: string;
    lastName?: string;
    email?: string;
  }>();
  private nonEmployeesSearchTerms = new Subject<{
    firstName?: string;
    lastName?: string;
    email?: string;
  }>();
  search(term: string): void {
    this.shopSearchTerms.next(term);
  }

  searchEmployees(): void {
    this.employeeSearchTerms.next({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    });
  }

  searchNonEmployees(): void {
    this.nonEmployeesSearchTerms.next({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    });
  }

  loadShops() {
    this.shopService.getAll().subscribe({
      next: (shops: Shop[]) => {
        this.shops = shops;
      },
    });
  }

  loadEmployees(shopId: number) {
    this.shopService.searchEmployees(shopId).subscribe({
      next: (employees: User[]) => {
        this.selectedEmployees = employees;
      },
      error: (err) => {
        console.error('Error loading shop employees:', err);
        this.snackBar.open('No employees loaded.', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  loadUsersNotInShop(shopId: number) {
    this.userService.usersNotInShop(shopId).subscribe({
      next: (users: User[]) => {
        this.usersNotInShop = users;
      },
      error: (err) => {
        console.error('Error loading users not in shop:', err);
        this.snackBar.open(
          'No users not belonging to this shop were loaded.',
          'Close',
          {
            duration: 5000,
          },
        );
      },
    });
  }

  isSelected(shop: Shop): boolean {
    return this.selectedShop?.id === shop.id;
  }

  selectShop(shop: Shop) {
    this.selectedShop = shop;
    this.selectedEmployees = [];
    this.usersNotInShop = [];
    this.loadEmployees(shop.id);
    this.loadUsersNotInShop(shop.id);
    this.searchEmployees(shop.id, this.firstName, this.lastName, this.email);
    this.searchUsersNotInShop(
      shop.id,
      this.firstName,
      this.lastName,
      this.email,
    );
  }

  searchShop(name: string) {
    if (name.trim() === '') {
      this.loadShops();
    } else {
      this.shopService.getByName(name).subscribe({
        next: (shops: Shop[]) => {
          this.shops = shops;
        },
      });
    }
  }

  searchEmployees(
    shopId?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
  ) {
    if (shopId) {
      this.shopService
        .searchEmployees(shopId, firstName, lastName, email)
        .subscribe((employees: User[]) => {
          this.selectedEmployees = employees;
        });
    }
  }

  searchUsersNotInShop(
    shopId?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
  ) {
    if (shopId) {
      this.userService
        .usersNotInShop(shopId, firstName, lastName, email)
        .subscribe((users: User[]) => {
          this.usersNotInShop = users;
        });
    }
  }

  deleteUser(): void {
    if (this.selectedShop?.id && this.selectedUser?.id) {
      this.shopService
        .removeUserFromShop(this.selectedShop.id, this.selectedUser.id)
        .subscribe({
          next: (response) => {
            if (response.status === 200 || response.status === 204) {
              this.loadEmployees(this.selectedShop!.id);
              this.loadUsersNotInShop(this.selectedShop!.id);
              this.isDeletePopupVisible = false;
              this.selectedUser = null;

              this.snackBar.open(
                'User has been successfully removed from this shop.',
                'Close',
                {
                  duration: 5000,
                },
              );
            }
          },
          error: (err) => {
            console.error('Error removing user from shop:', err);
            this.snackBar.open(
              'Failed to remove user from shop. Please try again later.',
              'Close',
              {
                duration: 5000,
              },
            );
          },
        });
    }
  }

  addUser(): void {
    if (this.selectedShop?.id && this.selectedUser?.id) {
      this.shopService
        .addUserToTeam(this.selectedShop.id, this.selectedUser.id)
        .subscribe({
          next: (response) => {
            if (response.status === 200) {
              this.loadEmployees(this.selectedShop!.id);
              this.loadUsersNotInShop(this.selectedShop!.id);
              this.isAddPopupVisible = false;
              this.selectedUser = null;

              this.snackBar.open(
                'User has been successfully added to this shop.',
                'Close',
                {
                  duration: 5000,
                },
              );
            }
          },
          error: (err) => {
            console.error('Error adding user to shop:', err);
            this.snackBar.open(
              'Failed to add user to shop. Please try again later.',
              'Close',
              {
                duration: 5000,
              },
            );
          },
        });
    }
  }

  showDeletePopup(user: User) {
    this.selectedUser = user;
    this.isDeletePopupVisible = true;
  }

  closeDeletePopup() {
    this.isDeletePopupVisible = false;
  }

  showAddPopup(user: User) {
    this.selectedUser = user;
    this.isAddPopupVisible = true;
  }

  closeAddPopup() {
    this.isAddPopupVisible = false;
  }

  activeTab: string = 'members';

  selectTab(tab: string) {
    this.activeTab = tab;
    this.updateTabStyles();
  }

  showShopInfo(shop: Shop, event: Event): void {
    event.stopPropagation();
    console.log('Shop Info: ', shop);
    this.shopService.getById(shop.id).subscribe({
      next: (shopDetails: ShopDetailsDto) => {
        this.selectedShopForInfo = shopDetails;
        this.showPopupActions = false;
        this.isShopInfoPopupVisible = true;
      },
      error: (err) => {
        console.error('Error fetching shop details: ', err);
        this.snackBar.open(
          'Failed to load information about this shop.',
          'Close',
          {
            duration: 5000,
          },
        );
      },
    });
  }


  closeTeamInfoPopup(): void {
    this.isShopInfoPopupVisible = false;
    this.selectedShopForInfo = null;
  }

  showEditPopup(shop: Shop, event: Event): void {
    event.stopPropagation();
    this.shopToEdit = shop;
    this.shopName = shop.name;
    this.isEditShopPopupVisible = true;
  }

  showShopDeletePopup(shop: Shop, event: Event): void {
    event.stopPropagation();
    this.shopToDelete = shop;
    this.isShopDeletePopupVisible = true;
  }


  confirmDelete(): void {
    if (this.shopToDelete) {
      this.shopService.deleteShop(this.shopToDelete.id).subscribe({
        next: () => {
          this.loadShops();
          this.closeShopInfoPopup();
          this.snackBar.open('Shop has been successfully deleted.', 'Close', {
            duration: 5000,
          });
        },
      });
    }
  }
  confirmEdit(): void {
    if (this.shopToEdit) {
      this.shopToEdit.name = this.shopName;
      this.shopService
        .updateShop(this.shopToEdit.id, this.shopToEdit)
        .subscribe({
          next: () => {
            this.loadShops();
            this.closeEditPopup();
            this.snackBar.open('Shop has been successfully updated.', 'Close', {
              duration: 5000,
            });
          },
          error: (err) => {
            console.error('Error updating shop:', err);
            this.snackBar.open('Failed to update this shop.', 'Close', {
              duration: 5000,
            });
          },
        });
    }
  }
  closeEditPopup(): void {
    this.isEditShopPopupVisible = false;
    this.shopToEdit = null;
  }

  closeDeleteShopPopup(): void {
    this.isDeletePopupVisible = false;
    this.shopToDelete = null;
  }

  showAddShopPopup(): void {
    this.isAddShopPopupVisible = true;
  }

  closeAddShopPopup(): void {
    this.isAddShopPopupVisible = false;
  }

  addShop(): void {
    const shopCreateDto = { name: this.newShop };
    this.shopService.createShop(shopCreateDto).subscribe({
      next: (shopId) => {
        this.snackBar.open('Shop has been successfully added.', 'Close', {
          duration: 5000,
        });
        this.loadShops();
        this.closeAddShopPopup();
      },
    });
  }
  updateTabStyles() {
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach((button) => {
      button.classList.remove('active');
    });
    const activeButton = document.querySelector(
      `.tab-button.${this.activeTab}`,
    );
    activeButton?.classList.add('active');
  }
}

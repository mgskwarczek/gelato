import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../../../app/common/components/side-bar/side-bar.component';
import { NavBarComponent } from '../../../app/common/components/nav-bar/nav-bar.component';
import { ButtonComponent } from '../../../app/common/components/button/button.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Shop } from '../../interfaces/shop';
import { ShopService } from '../../services/shop.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [
    FontAwesomeModule,
    SideBarComponent,
    NavBarComponent,
    ButtonComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css',
})
export class UserAccountComponent implements OnInit {
  faUserCircle = faUserCircle;

  user: User | null = null;
  teams: Shop[] = [];
  searchTerm: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private teamService: ShopService,
  ) {}

  ngOnInit(): void {
    const userId = 50;

    this.userService.getById(userId).subscribe((users: User) => {
      this.user = users;
    });

    this.userService.getShopsByUserId(userId).subscribe((teams: Shop[]) => {
      this.teams = teams;
    });
  }

  onChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  onSearchTeams(): void {
    if (this.searchTerm) {
      this.teams = this.teams.filter((team) =>
        team.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    } else {
      this.loadTeams();
    }
  }

  loadTeams(): void {
    const userId = 50;
    this.userService.getShopsByUserId(userId).subscribe((teams: Shop[]) => {
      this.teams = teams;
    });
  }
}

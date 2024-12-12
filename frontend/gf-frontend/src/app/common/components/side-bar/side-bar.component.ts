import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faDiagramProject,
  faLayerGroup,
  faUsers,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent {
  faHome = faHome;
  faDiagramProject = faDiagramProject;
  faLayerGroup = faLayerGroup;
  faUsers = faUsers;
  faUser = faUser;
}

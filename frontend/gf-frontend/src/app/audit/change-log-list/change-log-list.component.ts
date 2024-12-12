import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeRecord } from '../../../users/interfaces/user-model';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-change-log-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './change-log-list.component.html',
  styleUrl: './change-log-list.component.css',
})
export class ChangeLogListComponent {
  @Input() records: ChangeRecord[] = [];
}

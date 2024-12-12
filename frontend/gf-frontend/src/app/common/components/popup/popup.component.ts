import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [FontAwesomeModule, ButtonComponent, CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css',
})
export class PopupComponent {
  @Input() isVisible: boolean = false;
  @Input() popupTitle: string = '';
  @Input() message: string = '';
  @Input() showActions: boolean = true;

  faTimes = faTimes;

  @Output() onConfirm: EventEmitter<void> = new EventEmitter();
  @Output() onClose: EventEmitter<void> = new EventEmitter();

  confirmPopup() {
    this.onConfirm.emit();
    this.isVisible = false;
  }

  closePopup() {
    this.isVisible = false;
    this.onClose.emit();
  }
}

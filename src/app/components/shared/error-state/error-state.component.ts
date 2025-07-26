import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.css'
})
export class ErrorStateComponent {
  @Output() retry = new EventEmitter<void>();
}

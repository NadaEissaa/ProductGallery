import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../Core/Services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 w-full max-w-xs space-y-4">
      <div *ngFor="let toast of toasts" 
           [class]="getToastClasses(toast)"
           (click)="remove(toast.id)"
           class="p-4 rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
           role="alert">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ng-container [ngSwitch]="toast.type">
              <svg *ngSwitchCase="'success'" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg *ngSwitchCase="'error'" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <svg *ngSwitchCase="'warning'" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg *ngSwitchDefault class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </ng-container>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">
              {{ toast.message }}
            </p>
          </div>
          <button class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8" 
                  (click)="remove(toast.id); $event.stopPropagation()">
            <span class="sr-only">Close</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-enter {
      opacity: 0;
      transform: translateX(100%);
    }
    .toast-enter-active {
      opacity: 1;
      transform: translateX(0);
      transition: opacity 300ms, transform 300ms;
    }
    .toast-exit {
      opacity: 1;
      transform: translateX(0);
    }
    .toast-exit-active {
      opacity: 0;
      transform: translateX(100%);
      transition: opacity 300ms, transform 300ms;
    }
  `]
})
export class ToastComponent {
  toasts: any[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  remove(id: number): void {
    this.toastService.removeToast(id);
  }

  getToastClasses(toast: { type: 'success' | 'error' | 'info' | 'warning' }): string {
    const baseClasses = 'relative overflow-hidden transition-all duration-300';
    const typeClasses = {
      'success': 'bg-green-50 border border-green-200',
      'error': 'bg-red-50 border border-red-200',
      'warning': 'bg-yellow-50 border border-yellow-200',
      'info': 'bg-blue-50 border border-blue-200'
    }[toast.type] || 'bg-white border border-gray-200';
    
    return `${baseClasses} ${typeClasses}`;
  }
}

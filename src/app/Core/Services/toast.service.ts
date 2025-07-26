import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastId = 0;
  toasts$ = new BehaviorSubject<Toast[]>([]);

  constructor() {}

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    const toast: Toast = {
      id: this.toastId++,
      type,
      message,
      duration
    };

    this.toasts.push(toast);
    this.toasts$.next([...this.toasts]);

    if (duration > 0) {
      setTimeout(() => this.removeToast(toast.id), duration);
    }
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.toasts$.next([...this.toasts]);
  }

  clearAll(): void {
    this.toasts = [];
    this.toasts$.next([]);
  }
}

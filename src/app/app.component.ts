import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from './Core/Services/cart.service';
import { Observable, map } from 'rxjs';
import { ToastComponent } from './shared/toast/toast.component';
import { ThemeToggleComponent } from './shared/theme-toggle/theme-toggle.component';
import { ThemeService } from './Core/Services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ToastComponent,
    ThemeToggleComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Luxuria';
  cartItemCount$: Observable<number>;

  constructor(
    private cartService: CartService, 
    private themeService: ThemeService
  ) {
    this.cartItemCount$ = this.cartService.cartCount$;
    
    // Initialize theme service
    this.themeService.setTheme(this.themeService.theme());
  }

  ngOnInit(): void {}
}

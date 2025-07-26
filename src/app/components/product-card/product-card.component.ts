import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../Core/models/product.model';
import { CartService } from '../../Core/Services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  reviewCount: number = 0;
  rating: number = 0;
  stars: { full: number; half: boolean; empty: number } = { full: 0, half: false, empty: 0 };
  limitedTitle: string = '';
  @Input() showActions: boolean = true;
  @Output() quickView = new EventEmitter<Product>();
  
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.initializeCardData();
  }

  private initializeCardData(): void {
    // Generate a random review count between 10 and 110
    this.reviewCount = Math.floor(Math.random() * 100) + 10;
    
    // Generate a random rating between 3.5 and 5
    this.rating = Math.floor(Math.random() * 15) / 10 + 3.5;
    
    // Calculate stars based on rating
    const full = Math.floor(this.rating);
    const half = this.rating % 1 >= 0.5;
    this.stars = {
      full,
      half,
      empty: 5 - full - (half ? 1 : 0)
    };
    
    // Limit title to 8 words
    const words = this.product.title.split(' ');
    this.limitedTitle = words.length > 8 
      ? words.slice(0, 8).join(' ') + '...' 
      : this.product.title;
  }
  
  /**
   * Adds the current product to the shopping cart
   * @param event The click event to prevent default behavior
   */
  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.cartService.addToCart(this.product, 1);
    
    // Simple alert for now - we can enhance this with a toast notification later
    alert(`${this.product.title} added to cart`);
  }

  openQuickView(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.quickView.emit(this.product);
  }  
}

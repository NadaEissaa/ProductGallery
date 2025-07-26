import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { API_CONFIG } from '../config/api.config';
import { ToastService } from './toast.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = `${API_CONFIG.BASE_URL}/carts`;
  private cartItems: CartItem[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  private cartTotal = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCount.asObservable();
  cartTotal$ = this.cartTotal.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {
    this.loadCart();
  }

  private loadCart(): void {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
        this.updateCartState();
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      this.cartItems = [];
    }
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      this.toastService.show(`Updated quantity of ${product.title} to ${existingItem.quantity}`, 'success');
    } else {
      this.cartItems.push({ product, quantity });
      this.toastService.show(`Added ${product.title} to cart`, 'success');
    }
    
    this.updateCartState();
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      this.cartItems = this.cartItems.filter(i => i.product.id !== productId);
      this.toastService.show(`Removed ${item.product.title} from cart`, 'info');
      this.updateCartState();
      this.saveCart();
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCartState();
      this.saveCart();
    }
  }

  clearCart(): void {
    if (this.cartItems.length > 0) {
      this.cartItems = [];
      this.toastService.show('Cart cleared', 'info');
      this.updateCartState();
      this.saveCart();
    }
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  private updateCartState(): void {
    // Update cart count
    const count = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    this.cartCount.next(count);
    
    // Update cart total
    const total = this.cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    this.cartTotal.next(parseFloat(total.toFixed(2)));
  }

  private saveCart(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  // API Methods (for when you want to sync with the backend)
  private getCartFromApi(): Observable<any> {
    // In a real app, you would fetch the user's cart from the API
    return this.http.get(`${this.apiUrl}/user/1`);
  }

  private saveCartToApi(): Observable<any> {
    // In a real app, you would save the cart to the API
    const userId = 1; // Get from auth service
    const cartData = {
      userId,
      date: new Date().toISOString(),
      products: this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    return this.http.post(this.apiUrl, cartData);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../Core/Services/product.service';
import { CartService } from '../../Core/Services/cart.service';
import { Product } from '../../Core/models/product.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../shared/error-state/error-state.component';

interface ProductDetails extends Product {
  description: string;
  category: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterLink, 
    LoadingSpinnerComponent, 
    ErrorStateComponent
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: ProductDetails | null = null;
  loading = true;
  error = false;

  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      alert(`${this.product.title} added to cart!`);
    }
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityChange(): void {
    this.quantity = Math.max(1, this.quantity);
  }

  loadProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = false;
    
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data as ProductDetails;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}

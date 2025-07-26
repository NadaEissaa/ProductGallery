import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../Core/Services/product.service';
import { Product } from '../../Core/models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../shared/error-state/error-state.component';
import { ToastService } from '../../Core/Services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-gallery',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    FormsModule,
    LoadingSpinnerComponent,
    ErrorStateComponent
  ],
  templateUrl: './products-gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsGalleryComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  sortOption = '';
  loading = false;
  error = false;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = false;
    this.cdr.markForCheck();
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = true;
        this.loading = false;
        this.cdr.markForCheck();
        this.loading = false;
      }
    });
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onSort(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    // Start with all products
    let filtered = [...this.products];
    
    // Apply search filter if query exists
    if (this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    this.filteredProducts = this.applySorting(filtered);
    this.cdr.markForCheck();
  }

  private applySorting(products: Product[]): Product[] {
    const sorted = [...products];
    
    if (!this.sortOption) {
      return sorted;
    }
    
    switch (this.sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }

  onQuickView(product: Product): void {
    // For now, we'll just navigate to the product details page
    // In a real app, you might want to open a modal or drawer with the product details
    this.router.navigate(['/products', product.id]);
    this.toastService.show(`Viewing ${product.title}`, 'info', 2000);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${API_CONFIG.BASE_URL}/products`;
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(products => this.productsSubject.next(products)),
      catchError(error => {
        console.error('Error fetching products:', error);
        throw error;
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(query: string): void {
    const currentProducts = this.productsSubject.value;
    const filteredProducts = currentProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    this.productsSubject.next(filteredProducts);
  }

  sortProducts(criteria: string): void {
    const currentProducts = [...this.productsSubject.value];
    
    switch (criteria) {
      case 'price-asc':
        currentProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        currentProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        currentProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    this.productsSubject.next(currentProducts);
  }
}

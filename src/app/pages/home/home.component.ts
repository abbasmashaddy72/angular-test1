import { Component, HostListener } from '@angular/core';
import { ProductService } from '../../api/product.api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  products: any[] = [];
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 12;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;

    this.productService.getProducts(this.itemsPerPage, skip).subscribe(
      (response: any) => {
        if ('products' in response) {
          if (Array.isArray(response.products)) {
            this.products.push(...response.products);
            this.isLoading = false;
            this.currentPage++;
          } else {
            console.log(
              'Error: Response does not contain an array of products'
            );
          }
        } else {
          console.log('Error Fetching the API Data');
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.isLoading = false;
      }
    );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.isLoading
    ) {
      this.loadProducts();
    }
  }
}

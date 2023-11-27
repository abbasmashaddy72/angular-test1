import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalService } from 'src/app/services/modal.service';
import { ProductService } from '../../api/product.api';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  editedProduct: any;

  constructor(
    private authenticationService: AuthenticationService,
    private productService: ProductService,
    public modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.productsList();
  }

  productsList() {
    var request = {
      seqno: 0,
      UserId: this.authenticationService.getToken().usersUserid,
      ClientId: this.authenticationService.getToken().usersClientId,
    };
    this.productService.getProducts(request).subscribe(
      (response: any) => {
        if (response['status'] == '200') {
          this.products = response['objresult'];
        } else {
          alert('failure');
          console.log('Error Fetching the API Data');
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  openEditModal(product: any) {
    this.editedProduct = { ...product };
    this.modalService.openModal('edit-modal-product');
  }
}

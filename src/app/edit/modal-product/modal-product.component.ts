import { Component, Input, OnInit } from '@angular/core'
import { ProductService } from 'src/app/api/product.api'
import { ModalService } from 'src/app/modal-service.service'
import { AuthenticationService } from 'src/app/services/authentication.service'

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss']
})
export class ModalProductComponent implements OnInit {
  @Input() editedProduct: any
  productData: any

  constructor (
    private authenticationService: AuthenticationService,
    private productService: ProductService,
    public modalService: ModalService
  ) {}

  ngOnInit (): void {
    this.productById()
  }

  productById () {
    var request = {
      seqno: this.editedProduct,
      UserId: this.authenticationService.getToken().usersUserid + 1,
      ClientId: this.authenticationService.getToken().usersClientId
    }
    this.productService.getProductById(request).subscribe(
      (response: any) => {
        if (response['status'] == '200') {
          this.productData = response['objresult']
        } else {
          alert('failure')
          console.log('Error Fetching the API Data')
        }
      },
      error => {
        console.error('API Error:', error)
      }
    )
  }

  saveProduct () {
    alert('Saved')
    this.modalService.closeModal()
  }
}

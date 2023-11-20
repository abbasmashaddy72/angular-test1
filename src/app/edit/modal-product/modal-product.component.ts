import { Component, Input, OnInit } from '@angular/core'
import { NotifierService } from 'angular-notifier'
import { ProductService } from 'src/app/api/product.api'
import { AuthenticationService } from 'src/app/services/authentication.service'
import { ModalService } from 'src/app/services/modal.service'

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss']
})
export class ModalProductComponent implements OnInit {
  @Input() editedProduct: any
  productData: any
  private readonly notifier: NotifierService

  constructor (
    private authenticationService: AuthenticationService,
    private productService: ProductService,
    public modalService: ModalService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService
  }

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
          if (response['objresult'] == null) {
            this.notifier.notify('error', 'No Data to Edit')
            this.modalService.closeModal()
          } else {
            this.productData = response['objresult']
          }
        } else {
          alert('failure')
          console.log('Error Fetching the API Data')
          this.modalService.closeModal()
        }
      },
      error => {
        console.error('API Error:', error)
        this.modalService.closeModal()
      }
    )
  }

  saveProduct () {
    alert('Saved')
    this.modalService.closeModal()
  }
}

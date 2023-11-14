import { Component, Input } from '@angular/core'
import { ModalService } from 'src/app/modal-service.service'

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss']
})
export class ModalProductComponent {
  constructor (public modalService: ModalService) {}
  @Input() editedProduct: any

  saveProduct () {
    console.log('Saved')
    return true
  }
}

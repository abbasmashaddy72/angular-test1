import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Constants } from './../../config/constants'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  dtOptions: DataTables.Settings = {
    columns: [
      {
        title: 'ID',
        data: 'name'
      },
      {
        title: 'First name',
        data: 'code'
      },
      {
        title: 'Last name',
        data: 'createdOn'
      }
    ]
  }
  obj: any = []

  constructor (private http: HttpClient) {}

  getProducts (cls: object) {
    const header = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
    // .set('Authorization', '428c3dfe-2f99-421c-9676-753e24bb38d1')

    return this.http.post(
      Constants.SAYDAK_API_ENDPOINT + 'v1/Admin/_getProductList',
      cls,
      { headers: header }
    )
  }

  productsList () {
    var request = { seqno: 0, UserId: '3', ClientId: 1 }
    this.getProducts(request).subscribe((result: any) => {
      if (result['status'] == '200') {
        this.obj = result['objresult']

        console.log(this.obj)
        this.dtOptions.ajax = this.obj
      } else {
        alert('failure')
      }
    })
  }
  ngOnInit (): void {
    this.productsList()
  }
}

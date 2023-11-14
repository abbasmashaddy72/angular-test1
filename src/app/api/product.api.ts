import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Constants } from '../config/constants'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor (private httpClient: HttpClient) {}

  getProducts (cls: object) {
    const header = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')

    return this.httpClient.post(
      Constants.SAYDAK_API_ENDPOINT +
        Constants.API_VERSION +
        '/Admin/_getProductList',
      cls,
      { headers: header }
    )
  }
}

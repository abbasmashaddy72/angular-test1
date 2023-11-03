import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  getProducts(limit: number, skip: number) {
    const apiURL =
      Constants.API_ENDPOINT + `products/?limit=${limit}&skip=${skip}`;

    return this.httpClient.get(apiURL);
  }
}

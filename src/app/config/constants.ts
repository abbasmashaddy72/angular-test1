import { Injectable } from '@angular/core'
@Injectable()
export class Constants {
  public static API_ENDPOINT: string = 'https://dummyjson.com/'
  public static SAYDAK_API_ENDPOINT: string = 'https://api.saydak.com/'
  public static SAYDAK_S3_ENDPOINT: string =
    'https://saydak-s3-store01.s3.me-central-1.amazonaws.com/'
  public static siteTitle: string = 'Test App'
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from '../models/item';
import { Observable } from 'rxjs/internal/Observable';
import { empty } from 'rxjs/internal/observable/empty';
import { CurrencyDenomination } from '../models/currency-denomination';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private url = 'http://localhost:8080/vending';
  private headers = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

  constructor(private http: HttpClient) { }
  
  public retrieveItems(): Observable<Array<Item>> {
    return this.http.get<Array<Item>>(this.url + '/items');
  }

  public retrieveDenoms(): Observable<Array<Number>> {
    return this.http.get<Array<Number>>(this.url + '/currency/denominator');
  }


  public retrieveItem(itemId: number): Observable<Item> {
    if (!itemId) {
      return empty();
    }
    return this.http.get<Item>(this.url + '/' + itemId);
  }

  public purchaseItem(items: Array<Item>, credit: number): Observable<Array<Number>> {
    console.log("Items bought: " + items.length)
    if (!items && !credit) {
      return empty();
    }
    const itemsStr = JSON.stringify(items);
    return this.http.post<Array<Number>>(this.url + '/purchase/' + credit, itemsStr, this.headers);
  }
}

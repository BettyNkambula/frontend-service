import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ItemService } from '../../services/item.service';
import { Item } from 'src/app/models/item';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;

  private itemsSubscription: Subscription;
  private denomsSubscription: Subscription;
  private purchaseSubscription: Subscription;

  private items: Array<Item>;
  private denoms: Array<Number>;
  private change: Array<Number>;
  private itemsBought: Array<Item> = [];

  public itemsDataSource: MatTableDataSource<Item>;
  public columnsToDisplay = [ 'menu', 'product', 'price', 'id'];

  public credit: number;
  public height: number;
  displayElement = false;

  constructor(private itemService: ItemService) {
    this.credit = 0;
    this.height = window.innerHeight - 260;
   }

  ngOnInit() {
    this.retrieveItemList();
    this.retrieveAvailableDenomsList();
  }

  ngOnDestroy(): void {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }

    if (this.denomsSubscription) {
      this.denomsSubscription.unsubscribe();
    }
    if (this.purchaseSubscription) {
      this.purchaseSubscription.unsubscribe();
    }
  }

  private retrieveItemList(): void {
    this.itemsSubscription = this.itemService.retrieveItems()
    .subscribe((response: Array<Item>) => {
        this.items = response;
        this.itemsDataSource = new MatTableDataSource<Item>(this.items);
        // this.itemsDataSource.sort = this.sort;
    });
  }

  private retrieveAvailableDenomsList(): void {
    this.denomsSubscription = this.itemService.retrieveDenoms()
    .subscribe((response: Array<Number>) => {
        this.denoms = response;
    });
  }

  public addItem(item: Item): void {
    this.itemsBought.push(item);
  }

  public getCount(denom: Number): Number {
    return this.denoms.filter(i => i === denom).length;
  }

  onChange(value) {   
    console.log("On change" + value)
    console.log("Items before" + this.items.length)
    this.items=this.items.filter(x=>x.id!=value)
    this.itemsDataSource = new MatTableDataSource<Item>(this.items);
    console.log("Items after change" + this.items.length)
  }

  public getCountChange(denom: Number): Number {
    console.log("Chage value" + denom)
    return this.change.filter(i => i === denom).length;
  }

  public purchase(): void {
    this.purchaseSubscription = this.itemService.purchaseItem(this.itemsBought, this.credit)
    .subscribe((response: Array<Number>) => {
      if (response) {
        console.log('purchase => ' + JSON.stringify(response));
        this.change = response;
        this.retrieveItemList();
        this.retrieveAvailableDenomsList();
        this.displayElement= true;
        this.credit = 0;
        this.itemsBought = [];
        this.change = [];
      }
    });
  }

  public insertCoin(value): void {
    this.credit += value;
  }
}

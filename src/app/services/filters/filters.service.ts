import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  filterData:any = [];
  product_filter_flag:boolean=false;
  filter_page_display_data:any =[];
  public isFilterApplied: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // used in productlist and filters page to reload product list when filter is applied


  constructor() { }
}

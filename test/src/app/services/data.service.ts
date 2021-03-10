import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public items: any[];

  constructor() {
    this.items=[
      {title:"Apple", pic:"assets/apple.jfif", page:"applee"},
      {title:"Delima", pic:"assets/del.jfif"},
      {title:"Juice Jiebee", pic:"assets/satu.jpg"},
      {title:"Strawberry", pic:"assets/ss.jfif"},
      {title:"Tropicana Twister", pic:"assets/twis.jfif"},

    ]
   }

   filterItems(searchTerm){
     return this.items.filter(item=>{
       return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
     });
   }
}

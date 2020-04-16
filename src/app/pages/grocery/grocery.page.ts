import { GroceriesService } from './../../services/groceries/groceries.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-grocery',
  templateUrl: './grocery.page.html',
  styleUrls: ['./grocery.page.scss'],
})
export class GroceryPage implements OnInit {

  grocery : any = {};

  constructor(
    private _groceries : GroceriesService,
    private _activeRoute : ActivatedRoute,
    private _nav  : NavController
  ) { }

  ngOnInit() {

    this._groceries.getGroceryById(this._activeRoute.snapshot.paramMap.get('id')).subscribe( grocery => {
      if(grocery.payload.data()) {
        this.grocery = grocery.payload.data();
        this.grocery['id'] = grocery.payload.id;
        if(this.grocery.status != 'done') {
          this.grocery.items.forEach(item => {
            item['inCart'] = false;
          });
        }
      }
    })

  }

  updateGrocery() {
    this.grocery.status = 'done';
 
    this._groceries.updateGrocery(this.grocery);
    this._nav.navigateRoot('groceries');
  }

  async deleteGrocery() {
    await this._groceries.deleteGrocery(this.grocery);
    this._nav.navigateRoot('groceries');
  }
}

import { GroceryComponent } from './../../components/grocery/grocery.component';
import { GroceriesService } from './../../services/groceries/groceries.service';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-groceries',
  templateUrl: './groceries.page.html',
  styleUrls: ['./groceries.page.scss'],
})
export class GroceriesPage implements OnInit {

  groceries : any = [];

  stats = [
    { name: 'In-progress', value: 'in-progress' },
    { name: 'Done', value: 'done'},
    { name: 'Canceled', value: 'canceled'},
  ]

  constructor(
    public _nav : NavController,
    private _groceries  : GroceriesService,
    private _modal  : ModalController
  ) { }

  ngOnInit() {
    this._groceries.getGroceries().subscribe( groceries => {
      if(!groceries.length) {
        this.groceries = [];
        return;
      }
      this.groceries = groceries.map( grocery => {
        return {
          id: grocery.payload.doc.id,
          assignedTo: grocery.payload.doc.data()['assignedTo'],
          date: grocery.payload.doc.data()['date'],
          items: grocery.payload.doc.data()['items'],
          status: grocery.payload.doc.data()['status'],
        }
      })

      console.log(this.groceries)
    })

  }
  async addGrocery() {
    const modal = await this._modal.create({
      component: GroceryComponent,
      componentProps: { grocery: {} }
    })
    modal.present();
  }

  async editGrocery(grocery) {
    const modal = await this._modal.create({
      component: GroceryComponent,
      componentProps: { grocery: grocery }
    })
    modal.present();
  }

  updateGrocery(grocery) {
    this._groceries.updateGrocery(grocery);
  }

}

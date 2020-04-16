
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ItemsService } from './../../services/items/items.service';
import { ItemComponent } from 'src/app/components/item/item.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  items : any = [];

  stats = [
    { name: 'Enabled',  value: false },
    { name: 'Disabled', value: true }
  ]

  constructor(
    public _nav  : NavController,
    private _modal : ModalController,
    private _items  : ItemsService,
  ) { }

  ngOnInit() {
    this._items.getItems().subscribe( items => {
      if(!items.length) {
        this.items = [];
        return;
      }
      this.items = items.map( item => {
        console.log(item.payload.doc.data())
        return {
          id: item.payload.doc.id,
          name: item.payload.doc.data()['name'],
          description: item.payload.doc.data()['description'],
          disabled: item.payload.doc.data()['disabled'],
          file: item.payload.doc.data()['file'],
        }
      })

      console.log(this.items)
    })

  }

  async addItem() {
    const modal = await this._modal.create({
      component: ItemComponent,
      componentProps: { item: {} }
    })
    modal.present();
  }

  async editItem(item) {
    const modal = await this._modal.create({
      component: ItemComponent,
      componentProps: { item: item }
    })
    modal.present();
  }

  async updateItem(item) {
    this._items.updateItem(item);
  }

}

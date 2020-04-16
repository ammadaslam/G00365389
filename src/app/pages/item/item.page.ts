import { FilesService } from './../../services/files/files.service';
import { NavController } from '@ionic/angular';
import { ItemsService } from './../../services/items/items.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  item : any = {};

  constructor(
    private _activeRoute : ActivatedRoute,
    private _items  : ItemsService,
    private _files  : FilesService,
    private _nav    : NavController
  ) { }

  ngOnInit() {
    this._items.getItemById(this._activeRoute.snapshot.paramMap.get('id')).subscribe( item => {
      if(item.payload.data()) {
        this.item = item.payload.data();
        this.item['id'] = item.payload.id;
      }

    })
  }

  async deleteItem() {
    if(Object.entries(this.item.file).length) {
      await this._files.deleteFile(this.item.file);
    }
    await this._items.deleteItem(this.item);
    this._nav.navigateRoot('items');
  }
}

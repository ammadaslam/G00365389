import { GroceriesService } from './../../services/groceries/groceries.service';
import { ItemsService } from './../../services/items/items.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-grocery',
  templateUrl: './grocery.component.html',
  styleUrls: ['./grocery.component.scss'],
})
export class GroceryComponent implements OnInit {

  grocery : any;

  form : FormGroup;

  items : any = [];

  selected : any = [];

  constructor(
    private _builder : FormBuilder,
    private _items   : ItemsService,
    private _groceries : GroceriesService,
    private _modal   : ModalController
  ) { }

  async ngOnInit() {
    this.form = this._builder.group({
      id: new FormControl('', Validators.compose([])),
      assignedTo: new FormControl('', Validators.compose([Validators.required])),
      date: new FormControl('', Validators.compose([Validators.required])),
      items: new FormControl('', Validators.compose([Validators.required])),
      status: new FormControl('', Validators.compose([]))
    })
    await this._items.getItems().subscribe( items => {
      if(!items.length) {
        this.items = [];
        return;
      }
      this.items = items.map( item => {
        return {
          id: item.payload.doc.id,
          name: item.payload.doc.data()['name'],
          description: item.payload.doc.data()['description'],
          disabled: item.payload.doc.data()['disabled'],
          file: item.payload.doc.data()['file'],
          selected: Object.entries(this.grocery).length ? this.isSelected(item.payload.doc.id) : false
          //if grocery is not empty object then exccute isSelected else set false
        }
      })

      console.log(this.items)
    })
    console.log(this.grocery)
    if(Object.entries(this.grocery).length) { //if object pass patch value of form...
      this.form.patchValue(this.grocery);
      this.selected = this.grocery.items;
    }
  }

  isSelected(id) {
    const item = this.grocery.items.find(item => item.id == id);
    console.log( item, this.grocery.items)
    if(item) {
      return true;
    }
    return false;
  }

  async onSubmit() {

    if(!this.form.get('items').value.length) {
      console.log('add items to grocery...')
      return;
    }

    if(this.form.get('id').value) {
      await this._groceries.updateGrocery(this.form.getRawValue());
    } else {

      await this._groceries.addGrocery(this.form.getRawValue());
    }

    this.reset();
    this.closeModal();
  }

  reset() {

    this.form.reset();
    this.selected = [];
    this.items.forEach(item => {
      item.selected = false;
    });
  }

  checkboxChanged(item) {
    if(item.selected) {
      this.selected.push(item);
    } else {
      const index = this.selected.find(itm => itm.id == item.id);
      this.selected.splice(index, 1);
    }
    this.form.get('items').setValue(this.selected);
    console.log(this.form.getRawValue())
  }

  closeModal() {
    this._modal.dismiss();
  }
}

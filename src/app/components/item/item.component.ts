import { UuidService } from './../../services/uuid/uuid.service';
import { ItemsService } from './../../services/items/items.service';
import { FilesService } from './../../services/files/files.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  form : FormGroup

  item : any;

  file_url : any;
  blob : any;
  base64 : string;
  imageResponse : any = [];

  percentage : any;

  constructor(
    private _builder : FormBuilder,
    private _uuid : UuidService,
    private _afStorage : AngularFireStorage,
    private _files : FilesService,
    private _items : ItemsService,
    private _webView : WebView,
    public _sanitizer : DomSanitizer,
    private _modal  : ModalController
  ) { }

  ngOnInit() {

    this.form = this._builder.group({
      id:     new FormControl('', Validators.compose([])),
      name:   new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl('', Validators.compose([Validators.required])),
      file:   new FormControl({}, Validators.compose([])),
      disabled: new FormControl(false, Validators.compose([])),
    })

    if(Object.entries(this.item).length) { //if object pass patch value of form...
      this.form.patchValue(this.item);
      if(Object.entries(this.item.file).length) {
        this.file_url = this.item.file.file_url;
      }
    }

  }

  async onSubmit() {
    //generate unique name for file 
    const name = this._uuid.generateUUID();

    var file_url : any;

    if(this.form.get('id').value) {

      if(this.blob) { //new file attached
        //response url from fireStorage
        file_url = await this.upload(name);

        if(Object.entries(this.form.get('file').value).length) { //if already have a file
          await this._files.deleteFile(this.form.get('file').value);
        }

        const fileResponse = await this._files.addFile({ path: '', name: name, file_url: file_url });
        this.form.get('file').setValue({ file_id: fileResponse.id, path: '', name: name, file_url: file_url })
      }

      await this._items.updateItem(this.form.getRawValue());

    } else {
     
      if(this.blob) {
        //response url from fireStorage
        file_url = await this.upload(name);
        //store collection of file
        const fileResponse = await this._files.addFile({ path: '', name: name, file_url: file_url }); 
        //append file object as reference in order to delete/updare file
        this.form.get('file').setValue({ file_id: fileResponse.id, path: '', name: name, file_url: file_url })
      }
      await this._items.addItem(this.form.getRawValue());
    }

    this.reset();
    this.closeModal();
  }

  reset() {
    this.form.reset();
    this.form.get('disabled').setValue(false);
    this.form.get('file').setValue({});
    this.file_url = "";
    this.blob = "";
    this.percentage = 0;
  }

  async attachFile() {
    
    const file : any = await this._files.chooseFile();

    if(!file) {
      return;
    }

    this.blob = file.blob;

    this.file_url = this._webView.convertFileSrc(file.file_path);
  
  }

  async upload(name) {
    const upload = this._afStorage.upload(`${name}`, this.blob);

    upload.percentageChanges().subscribe(percentage => {
      this.percentage = percentage;
    })

    return await upload.then( async result => {
      return result.ref.getDownloadURL().then( file_url => {

        return file_url;
        
      })
    })
  }

  closeModal() {
    this._modal.dismiss();
  }
}

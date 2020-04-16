import { FilePath } from '@ionic-native/file-path/ngx';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private _afStore   : AngularFirestore,
    private _afStorage : AngularFireStorage,
    private _fileChooser : FileChooser,
    private _file     : File,
    private _filePath : FilePath,
    private _alert    : AlertController
  ) { }

  chooseFile() {
    return this._fileChooser.open()
    .then(url => {
      return this._filePath.resolveNativePath(url).then( async nativeUrl => {
        //to get exact path of the file...
        let dirPathSegments = nativeUrl.split('/');
        let fileName = dirPathSegments[dirPathSegments.length-1];
            dirPathSegments.pop();
        let dirPath = dirPathSegments.join('/');
      
        const blob = await this._file.readAsArrayBuffer(dirPath, fileName).then(buffer => {
          //blob is option when uploading to fireStorage
          const blob = new Blob([buffer], { type: 'image/jpeg'});

          return blob;
        })
        return { file_path: nativeUrl, blob: blob };
      }).catch( async e => {
        console.log(e)
      })
    })
    .catch( async e => {
      console.log(e)
    });
  }

  async addFile(payload) {
    return await this._afStore.collection('files')
      .add(payload).then( result => {
        return result;
      })
  }

  async deleteFile(payload) {
    await this._afStorage.ref(payload.name).delete();
    return await this._afStore.collection('files').doc(payload.file_id).delete();
  }
}

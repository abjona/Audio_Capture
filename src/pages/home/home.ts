import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, } from '@ionic-native/media-capture';
import { File } from '@ionic-native/file/ngx';
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';

import { MediaObject, Media } from '@ionic-native/media';
const MEDIA_FILES_KEY = 'mediaFiles';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  recording: boolean = false;
  filePath: string;
  fileName: string;
  mediaFiles = [];
  imagelist: any[];
  constructor(public navCtrl: NavController,
    public platform: Platform,
    private mediaCapture: MediaCapture,
    private storage: Storage,
    private media: Media
    ) {
  }

  ionViewDidLoad() {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      this.mediaFiles = JSON.parse(res) || [];
    })
  }

  record() {
    this.mediaCapture.captureAudio({duration : 30000 , limit: 30000}).then(res => {
      this.storeMediaFiles(res);
    }, (err: CaptureError) => console.error(err));
  }

  image(){
    this.mediaCapture.captureImage().then((image : MediaFile[])=>{
      this.imagelist.concat(image)

    })
  }

  play(myFile) {
      const audioFile: MediaObject = this.media.create(myFile.localURL);
      audioFile.play();
   
  }


  storeMediaFiles(files) {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      if (res) {
        let arr = JSON.parse(res);
        arr = arr.concat(files);
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
      } else {
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
      }
      this.mediaFiles = this.mediaFiles.concat(files);
    })
  }

}

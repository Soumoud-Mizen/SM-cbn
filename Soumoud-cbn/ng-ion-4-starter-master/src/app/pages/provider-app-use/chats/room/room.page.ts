import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Service } from '../../../../services/service';
import { NavController } from '@ionic/angular';

import * as firebase from 'firebase/app';
import 'firebase/database';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss']
})
export class RoomPage {
  userID;
  userData: any;

  @ViewChild('content', { static: true }) content: any;

  data = { type: '', nickname: '', message: '' };
  chats = [];
  roomkey: string;
  nickname: string;
  offStatus: boolean = false;

  constructor(
    public route: ActivatedRoute,
    public Service: Service,
    public navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    this.route.params.subscribe(
      (params: Params) => {
        this.userID = decodeURIComponent(params['id']);

        this.Service.getUserProfile().subscribe(
          userProfile => {
            this.userData = userProfile;

            firebase
              .database()
              .ref(
                'chatrooms/' +
                  this.userData.providerName +
                  '-' +
                  this.userID +
                  '/chats'
              )
              .on('value', resp => {
                this.chats = [];
                console.log('resp' , resp);
                
                this.chats = snapshotToArray(resp);
              });
          },
          err => {
            console.log('err : userProfile', err);
          }
        );
      },
      err => {
        console.log('err : Params', err);
      }
    );
  }

  sendMessage() {
    if (this.data.message === '' || this.data.message === null) {
      return;
    }
    let newData = firebase
      .database()
      .ref('chatrooms/' + this.userData.providerName + '-' + this.userID + '/chats')
      .push();
    newData.set({
      type: 'message',
      user: this.userData.nom_de_famille + ' ' + this.userData.prenom,
      message: this.data.message,
      sendDate: Date()
    });
    this.data.message = '';
  }
}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

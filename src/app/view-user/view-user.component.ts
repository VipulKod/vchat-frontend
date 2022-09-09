import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

import { CommonService } from '../services/common.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit {
  userData: any;
  imageSrc: any;
  constructor(
    private AS: AppService,
    private SS: SocketService,
    private CS: CommonService
  ) {}

  ngOnInit(): void {
    this.getSelectedUser();
    console.log(this.userData);
  }

  getSelectedUser() {
    this.CS.showLoading();
    this.AS.selectedUser$.subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        this.userData = data;
        this.imageSrc = this.userData?.profilePic;

        console.log(data);
      } else {
        this.CS.removeLoading();
      }
    });
  }
}

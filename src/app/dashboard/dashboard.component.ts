import { Component, Input, OnInit, ViewChild } from '@angular/core';

import * as $ from 'jquery';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { SocketService } from '../services/socket.service';
import { AppService } from '../services/app.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  selectedUser: any;
  allOnlineUsers: any = [];
  userData: any;
  onlineUsers = [
    {
      name: 'John Doe',
      img: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp',
      time: 'Just now',
    },
    {
      name: 'Danny Smith',
      img: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-1.webp',
      time: 'Just now',
    },
    {
      name: 'Alex Steward',
      img: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-2.webp',
      time: 'Just now',
    },
    {
      name: 'Ashley Olsen',
      img: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-3.webp',
      time: 'Just now',
    },
    {
      name: 'Kate Moss',
      img: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-4.webp',
      time: 'Just now',
    },
    {
      name: 'Lara Croft',
      img: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp',
      time: 'Just now',
    },
    {
      name: 'Brad Pitt',
      img: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp',
      time: 'Just now',
    },
    {
      name: 'Lara Croft',
      img: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp',
      time: 'Just now',
    },
    {
      name: 'Brad Pitt',
      img: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp',
      time: 'Just now',
    },
  ];

  constructor(
    private SS: SocketService,
    private AS: AppService,
    private router: Router,
    private CS: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllOnlineUsers();

    this.userData = sessionStorage.getItem('user-info');
    this.userData = JSON.parse(this.userData);

    this.getNotification();
  }

  getAllOnlineUsers() {
    this.SS.getUsers().subscribe((data) => {
      data.length && this.extractUserId(data);
    });
  }

  extractUserId(data: any) {
    const userIdArr: any = [];
    data?.forEach((user: any) => {
      userIdArr.push(user?.userId);
    });

    if (userIdArr?.length > 0) {
      const payload = {
        usersOnline: userIdArr,
      };
      this.AS.getAllOnlineUsers(payload).subscribe((data: any) => {
        this.allOnlineUsers = data?.users;

        this.allOnlineUsers.forEach((user: any) => {
          if (!user['msgCount']) {
            user['msgCount'] = 0;
          }
        });
      });
    }
  }

  userSelected(user: any) {
    this.selectedUser = user;

    this.allOnlineUsers.forEach((data: any) => {
      if (data._id === user._id) {
        user.msgCount = 0;
      }
    });
    this.AS.selectUser(user);
  }

  toggle() {
    $('#offcanvasTop').show();
  }

  navigate() {
    this.router.navigate(['profile']);
  }

  logout() {
    sessionStorage.clear();
    this.AS.logout();
    this.SS.logout();
    this.router.navigate(['login']);
  }

  viewProfile() {
    this.router.navigate(['dashboard/view']);
    //For deselecting user
  }

  //Method for notification
  getNotification() {
    this.SS.getMessage().subscribe((res) => {
      this.allOnlineUsers.forEach((data: any) => {
        if (data._id === res.senderId) {
          data['msgCount'] = data['msgCount'] + 1;
        }
      });

      console.log(this.allOnlineUsers);
    });
  }

  public sidebarShow: boolean = false;
  toggleSidebar() {
    console.log(this.sidebarShow);
    this.sidebarShow = !this.sidebarShow;
  }
}

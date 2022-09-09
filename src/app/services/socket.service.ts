import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public users$: BehaviorSubject<any> = new BehaviorSubject('');
  public message$: BehaviorSubject<any> = new BehaviorSubject({});
  socket: any;
  //to prevent getting same message multiple times using hax :)
  msgDetails: any;

  constructor(private readonly http: HttpClient) {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      upgrade: false,
    });
  }
  public readonly setUsers = (userId: string) => {
    this.socket.emit('addUser', userId);
  };

  public readonly getUsers = () => {
    this.socket.on('getUsers', (users: any) => {
      this.users$.next(users);
      console.log(users);
    });

    return this.users$.asObservable();
  };

  public readonly sendMessageEvent = (
    senderId: any,
    receiverId: any,
    text: any
  ) => {
    console.log('Sent message');
    this.socket.emit('sendMessage', { senderId, receiverId, text });
  };

  public readonly getMessage = () => {
    //to prevent getting same message multiple times using hax :)
    this.socket.on('getMessage', (message: any) => {
      if (
        !(this.msgDetails?.text === message?.text) ||
        !(this.msgDetails?.senderId === message?.senderId)
      ) {
        this.msgDetails = message;
        this.message$.next(message);
        console.log(message);
      }
    });

    return this.message$.asObservable();
  };

  logout() {
    this.message$.next({});
    this.users$.next('');
  }
}

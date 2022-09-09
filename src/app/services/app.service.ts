import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public selectedUser$: BehaviorSubject<any> = new BehaviorSubject({});

  readonly apiUrlInitials = 'http://localhost:8000/api/v1';
  constructor(private http: HttpClient) {}

  registerUser(payload: any) {
    return this.http.post(`${this.apiUrlInitials}/auth/register`, payload);
  }

  loginUser(payload: any) {
    return this.http.post(`${this.apiUrlInitials}/auth/login`, payload);
  }

  createOrFindChat(payload: any) {
    return this.http.post(`${this.apiUrlInitials}/chat`, payload);
  }

  getConversations(conversationId: any) {
    return this.http.post(`${this.apiUrlInitials}/message/getConversation`, {
      conversationId,
    });
  }

  saveMessage(conversationId: any, sender: any, text: any) {
    return this.http.post(`${this.apiUrlInitials}/message/sendMessages`, {
      conversationId,
      sender,
      text,
    });
  }

  getAllOnlineUsers(payload: any) {
    return this.http.post(`${this.apiUrlInitials}/user/onlineUsers`, payload);
  }

  uploadImage(payload: any) {
    return this.http.post(`${this.apiUrlInitials}/user/image`, payload);
  }

  selectUser(data: any) {
    this.selectedUser$.next(data);
  }

  updateUser(payload: any) {
    return this.http.post(`${this.apiUrlInitials}/user/update`, payload);
  }

  logout() {
    this.selectedUser$.next({});
  }
}

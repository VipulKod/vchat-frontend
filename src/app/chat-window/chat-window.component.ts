import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AppService } from '../services/app.service';
import { CommonService } from '../services/common.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent implements OnInit {
  userImg: any;
  selectedUserImg: any;
  message: any = '';
  userData: any;
  chatId: any;
  incomingMessage: any;
  conversation: any;
  isNoChat: boolean = true;
  selectedUser: any;

  totalUsers: any;
  @ViewChild('chatScroll', { static: false })
  private myScrollContainer!: ElementRef;
  receiverId: any;
  constructor(
    private AS: AppService,
    private SS: SocketService,
    private CS: CommonService
  ) {}

  ngOnInit(): void {
    this.CS.showLoading();
    this.getSelectedUser();

    this.SS.getMessage().subscribe((res) => {
      this.receiverId && this.createOrFindChat(this.receiverId);
    });

    this.userData = sessionStorage.getItem('user-info');
    this.userData = JSON.parse(this.userData);

    this.userImg = this.userData.profilePic;

    this.SS.getUsers().subscribe((data) => {
      this.totalUsers = data.length;
    });
  }

  scrollToBottom(): void {
    try {
      console.log(this.myScrollContainer);
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight + 40;
    } catch (err) {}
  }

  sendMessage() {
    const msg = this.message;
    this.message = '';
    this.userData = sessionStorage.getItem('user-info');
    this.userData = JSON.parse(this.userData);
    this.SS.sendMessageEvent(this.userData?._id, this.receiverId, msg);
    this.AS.saveMessage(this.chatId, this.userData?._id, msg).subscribe(
      (data) => {
        this.createOrFindChat(this.receiverId);
        this.scrollToBottom();
      }
    );
  }

  createOrFindChat(receiverId: any) {
    this.receiverId = receiverId;
    this.userData = sessionStorage.getItem('user-info');
    this.userData = JSON.parse(this.userData);

    this.AS.createOrFindChat({
      senderId: this.userData?._id,
      receiverId: receiverId,
    }).subscribe((res: any) => {
      this.chatId = res?.data[0]?._id;
      this.AS.getConversations(this.chatId).subscribe((res: any) => {
        if (res.data.length > 0) {
          this.isNoChat = false;
          this.prepareConversationData(res?.data);
          setTimeout(() => this.scrollToBottom(), 500);
        } else {
          this.isNoChat = true;
        }
        this.CS.removeLoading();
      });
    });
  }

  addItem(user: any) {}

  showChat: any = [];
  prepareConversationData(data: any) {
    this.showChat = [];
    data.forEach((chat: any) => {
      this.showChat.push({
        sender: chat?.sender,
        time: chat?.createdAt,
        text: chat?.text,
      });
    });

    return this.showChat;
  }

  getSelectedUser() {
    this.AS.selectedUser$.subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        this.selectedUser = data;
        this.createOrFindChat(this.selectedUser?._id);
        this.selectedUserImg = this.selectedUser?.profilePic;
      } else {
        this.CS.removeLoading();
      }
    });
  }

  detectKeyPress(event: any) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }
}

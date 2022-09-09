import { Component, OnInit } from '@angular/core';
import { CommonService } from './services/common.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'chat-app';
  showLoading: boolean = false;

  constructor(private CS: CommonService){

  }

  ngOnInit(): void {
    this.CS.load$.subscribe((data:boolean) => {
      this.showLoading=data;
    })
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public load$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() {}

  showLoading() {
    this.load$.next(true);
  }

  removeLoading() {
    this.load$.next(false);
  }

  errorHandler(error:any) {
    console.log(error);
  }
}

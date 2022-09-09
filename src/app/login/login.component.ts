import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';

import { CommonService } from '../services/common.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errorMsg: string = '';
  constructor(
    private AS: AppService,
    private SS: SocketService,
    private router: Router,
    private CS: CommonService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  loginForm: FormGroup;

  ngOnInit(): void {}

  loginUser() {
    this.CS.showLoading();
    this.AS.loginUser({
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    }).subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleError.bind(this),
    });
  }

  handleUpdateResponse(res: any) {
    if (res) {
      this.SS.setUsers(res?.data?.user?._id);

      sessionStorage.setItem('user-info', JSON.stringify(res.data.user));
      sessionStorage.setItem('token', JSON.stringify(res.data.accessToken));
      this.router.navigate(['dashboard']);
      this.CS.removeLoading();
    }
  }

  handleError(err: any) {
    if (err.error.status === 0) {
      err.error.data
        ? (this.errorMsg = err?.error?.data[0]?.msg)
        : (this.errorMsg = err?.error?.message);
    }
    this.CS.removeLoading();
  }

  navigate() {
    this.router.navigate(['register']);
  }

  closeError() {
    this.errorMsg = '';
  }
}

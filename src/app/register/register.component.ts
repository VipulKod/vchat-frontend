import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  errorMsg: string = '';
  constructor(
    private AS: AppService,
    private router: Router,
    private CS: CommonService
  ) {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  registerForm: FormGroup;

  registerUser() {
    !this.registerForm.valid && this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      let payload = {
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
      };

      this.AS.registerUser(payload).subscribe({
        next: this.handleUpdateResponse.bind(this),
        error: this.handleError.bind(this),
      });
    }
  }

  handleUpdateResponse(data: any) {
    console.log(data);
    this.navigate();
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
    this.router.navigate(['login']);
  }

  closeError() {
    this.errorMsg = '';
  }
}

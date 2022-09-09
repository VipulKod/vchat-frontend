import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { AppService } from '../services/app.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  title = 'cloudsSorage';
  selectedFile: any;
  fb: any;
  downloadURL: Observable<string> = new Observable<any>();
  imageSrc: any;
  userData: any;
  constructor(private storage: AngularFireStorage, private AS: AppService) {}
  ngOnInit() {
    this.userData = sessionStorage.getItem('user-info');
    this.userData = JSON.parse(this.userData);

    this.imageSrc = this.userData?.profilePic;
    this.userBio = this.userData?.bio;
  }

  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);

      reader.readAsDataURL(file);
    }

    this.onFileSelected(event);
  }

  onFileSelected(event: any) {
    var n = Date.now();
    const file = event.target.files[0];

    const filePath = `UserImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`UserImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url) => {
            if (url) {
              this.fb = url;
              this.uploadImgUrl(url);
            }
          });
        })
      )
      .subscribe((url) => {
        if (url) {
          console.log(url);
        }
      });
  }

  uploadImgUrl(url: any) {
    if (url) {
      this.AS.uploadImage({
        _id: this.userData._id,
        imageUrl: url,
      }).subscribe((data: any) => {
        console.log(data);
        sessionStorage.setItem('profilePic', url);
      });
    }
  }

  userBio: string = '';
  updateUser() {
    this.AS.updateUser({
      _id: this.userData._id,
      bio: this.userBio,
    }).subscribe((data: any) => {
      console.log('User updated successfully!');
    });
  }
}

import { imageConfig } from './../../../utils/config';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

import { readAndCompressImage } from 'browser-image-resizer';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  picture: string = 'https://i.pinimg.com/originals/2f/9d/95/2f9d9562eb2252ae132b4bf8258aa18a.jpg';
  uploadPercent: number = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm){
    const {email, password, username, country, bio, name} = f.form.value;
    this.auth.signUp(email, password)
    .then((res) => {
      console.log(res)
      const {uid} = res.user
      this.db.object(`/users/${uid}`).set({
        id: uid,
        name: name,
        email: email,
        instaUserName: username,
        country: country,
        bio: bio,
        picture: this.picture
      })
    })
    .then(() => {
      this.router.navigateByUrl('/');
      this.toastr.success('Sing up success');
    })
    .catch((err) => {
      this.toastr.error("Signup failed");
    })
  }

  async uploadFile(event){
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file,imageConfig);
    const filepath = file.name;
    const fileRef = this.storage.ref(filepath);
    const task = this.storage.upload(filepath, resizedImage);
    task.percentageChanges().subscribe((percetage) => {
      this.uploadPercent = percetage;
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.picture = url;
          this.toastr.success('image upload success');
        })
      })
    ).subscribe();
  }

}

import { AuthService } from './../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(nf: NgForm){
    const {email, password} = nf.form.value;
    this.auth.signUp(email, password)
    .then((res) => {
      this.router.navigateByUrl('/');
      this.toastr.success('Signup success');
    })
    .catch((err) => {
      console.log(err.message);
      this.toastr.error('signup failed');
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared-modules/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.formInit();
  }
  formInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern('^([a-zA-Z0-9][.-]?)+@([a-zA-Z0-9]+[.-]?)*[a-zA-Z0-9][.][a-zA-Z]{2,3}$'), Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    })
  }

  getErrorMessage(controlName: string, alias: string) {
    const control = this.loginForm.controls[controlName];

    if (control.errors) {
      if (control.errors.required) {
        return alias + ' is required';
      }
      if (control.errors.minlength) {
        return alias + ' should have at least ' + control.errors.minlength.requiredLength + ' characters';
      }
      if (control.errors.pattern) {
        return 'Invalid ' + alias.toLowerCase();
      }
      if (control.errors.maxlength) {
        return alias + ' should not have more than ' + control.errors.maxlength.requiredLength + ' characters';
      }
      if (control.errors.min) {
        return alias + ' should be greater than ' + control.errors.min.min;
      }
      if (control.errors.max) {
        return alias + ' can not be greater than ' + control.errors.max.max;
      }
    }
  }
  login() {
    let postData = this.loginForm.value
    if (this.loginForm.valid) {
      this.apiService.login(postData).subscribe(response => {
        localStorage.setItem('user', JSON.stringify(response))
        if (response['role'] == 'student') {
          this.router.navigate(['shome'])
        } else if (response['role'] == 'labmember') {
          this.router.navigate(['labmember'])
        } else if(response['role'] == 'testlableader') {
          this.router.navigate(['labsquad'])
        }
      }, error => {
        console.log(error);
      })
    } else {
      this.snackBar.open("Please enter valid login details", '', {
        duration: 2000,
      });
    }

  }
}

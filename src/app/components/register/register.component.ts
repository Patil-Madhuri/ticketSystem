import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared-modules/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
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
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('^([a-zA-Z0-9][.-]?)+@([a-zA-Z0-9]+[.-]?)*[a-zA-Z0-9][.][a-zA-Z]{2,3}$'), Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      role: ['', Validators.required]
    })
  }

  getErrorMessage(controlName: string, alias: string) {
    const control = this.registerForm.controls[controlName];

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
  register() {
    if (this.registerForm.valid) {
      this.apiService.register(this.registerForm.value).subscribe(response => {
        this.router.navigate(['login'])
      })
    } else {
      this.snackBar.open("Please enter valid signup details", '', {
        duration: 2000,
      });
    }

  }
}

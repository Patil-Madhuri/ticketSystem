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
      email: ['', Validators.compose([Validators.required])],
      // email: ['', Validators.compose([Validators.pattern('^[A-Za-z0-9._%+-]+@fanshaweonline.ca$'), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])],
      role: ['student', Validators.required]
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
        this.snackBar.open("Your account created successfully", '', {
          duration: 2000,
        });
        this.router.navigate(['login'])
      }, error => {
        console.log("error", error);
        if (error.status == 500) {
          this.snackBar.open("Please enter valid signup details", '', {
            duration: 2000,
          });
        } else if(error.status == 422){
          this.snackBar.open("Email already exist, Try with different email", '', {
            duration: 2000,
          });
        }
      })
    } else {
      this.snackBar.open("Please enter valid signup details", '', {
        duration: 2000,
      });
    }

  }
}

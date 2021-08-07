import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { ApiService } from 'src/app/shared-modules/api.service';

@Component({
  selector: 'app-raiseTicket',
  templateUrl: './raiseTicket.component.html',
  styleUrls: ['./raiseTicket.component.scss']
})
export class RaiseTicket implements OnInit {
  masterFormGroup: FormGroup
  isEdit = false;
  timeSlots:any = []
  issue_Cat: any = []
  userId:any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RaiseTicket>, private fb: FormBuilder,
    private apiService: ApiService, private snackBar: MatSnackBar) {
    // let x = {
    //   slotInterval: 5,
    //   openTime: '12:00',
    //   closeTime: '11:59'
    // };

    // let startTime = moment(x.openTime, "HH:mm");
    // let endTime = moment(x.closeTime, "HH:mm").add(1, 'days');
    // let allTimes = [];
    // while (startTime < endTime) {
    //   allTimes.push(startTime.format("HH:mm"));
    //   startTime.add(x.slotInterval, 'minutes');
    // }
    // this.timeSlots = allTimes
    // console.log(allTimes);
    this.userId = JSON.parse(localStorage.getItem('user'))
  }

  ngOnInit(): void {
    this.formInit();
    this.getCategories()
    this.getTimeslot();
  }

  formInit() {
    this.masterFormGroup = this.fb.group({
      student_id: [this.userId.user_id],
      name: ['', Validators.required],
      course: ['', Validators.required],
      issue_title: ['', Validators.required],
      issue_category: ['', Validators.required],
      issue_description: ['', Validators.required],
      date: ['', Validators.required],
      timeslot: ['', Validators.required],
    })
  }
  closeForm(data) {
    this.dialogRef.close({ data: data });
  }
  getCategories() {
    this.apiService.getCategory().subscribe(res => {
      this.issue_Cat = res
    })
  }
  getTimeslot() {
    this.apiService.getTimeSlots().subscribe(res => {
      this.timeSlots = res
    })
  }
  addItem() {
    console.log(this.masterFormGroup.value);
    this.masterFormGroup.value.date = moment(this.masterFormGroup.value.date).format('YYYY-MM-DD')
    if (this.masterFormGroup.valid) {
      this.apiService.raiseTicket(this.masterFormGroup.value).subscribe(response => {
        this.snackBar.open("Ticket raised successfully", '', {
          duration: 2000,
        });
        this.closeForm(true)
      })
    } else {
      this.snackBar.open("Enter all neccessary details", '', {
        duration: 2000,
      });
    }
  }

}

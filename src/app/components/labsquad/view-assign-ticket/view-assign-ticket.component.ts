import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared-modules/api.service';

@Component({
  selector: 'app-view-assign-ticket',
  templateUrl: './view-assign-ticket.component.html',
  styleUrls: ['./view-assign-ticket.component.scss']
})
export class ViewAssignTicketComponent implements OnInit {
  ticketDetails: any
  assignTo: any
  supportMember: any = []
  userId:any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewAssignTicketComponent>,
    private apiService: ApiService, private snackBar: MatSnackBar
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user'))
    // this.getTicketByID();
    this.getLabMember();
  }
  // getTicketByID() {
  //   let postData = {
  //     ticket_id: this.data.id
  //   }
  //   this.apiService.getTicketById(postData).subscribe(res => {
  //     this.ticketDetails = res[0];
  //   })
  // }
  closeForm(data) {
    this.dialogRef.close({ data: data });
  }
  getLabMember() {
    let postdata = {
      "user_type": "labmember"
    }
    this.apiService.getLabmember(postdata).subscribe(response => {
      this.supportMember = response;
    })
  }
  assignTicket() {
    console.log(this.assignTo);
    let postData = {
      "ticket_id": this.data.id,
      "labmem_id": this.assignTo,
      "timeslot": this.data.timeslot[0].id
    }
    this.apiService.assignTicketToLabMember(postData).subscribe(respone => {
      this.snackBar.open("Ticket assigned successfully", '', {
        duration: 2000,
      });
      this.assignTo = {}
      this.closeForm(true);
    })
  }
  setAssignTo(event) {
    console.log(event);
    this.assignTo = event.value
  }
}

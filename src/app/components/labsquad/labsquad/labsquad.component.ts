import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared-modules/api.service';
import { ViewAssignTicketComponent } from '../../labmember/view-assign-ticket/view-assign-ticket.component';
import { Ticket } from '../../student/home/home.component';

@Component({
  selector: 'app-labsquad',
  templateUrl: './labsquad.component.html',
  styleUrls: ['./labsquad.component.scss']
})
export class LabsquadComponent implements OnInit {
  currentDate = new Date();
  createdjsonArray: any = []
  pendingjsonArray:any = []
  inprogressjsonArray:any = []
  closedjsonArray: any = []
  userId: any
  displayedColumns: string[] = ['srno', 'date', 'summary', 'assignto'];
  createddataSource = new MatTableDataSource<Ticket>(this.createdjsonArray);
  pendingdataSource = new MatTableDataSource<Ticket>(this.pendingjsonArray);
  inprogressdataSource = new MatTableDataSource<Ticket>(this.inprogressjsonArray);
  closeddataSource = new MatTableDataSource<Ticket>(this.closedjsonArray);
  ticketStatus: any = []
  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private http: HttpClient,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user'))
    this.getTicketStatus()
    this.getCreatedTickets();
    this.getPendingTickets();
    this.getInprogressTickets();
    this.getClosedTickets();
  }

  viewAssignTicket(data) {
    const dialog = this.dialog.open(ViewAssignTicketComponent, {
      width: '40%',
      data: data ? data : null,
    });
    dialog.afterClosed().subscribe(res => {
      console.log("res", res);
    })
  }

  getCreatedTickets() {
    let postData = {
      "labmem_id": this.userId.user_id,
      "status": 1
    }
    this.apiService.getTicketsByLabMember(postData).subscribe(response => {
      this.createdjsonArray = response;
      this.createddataSource = new MatTableDataSource<Ticket>(this.createdjsonArray);
    })
  }
  getPendingTickets() {
    let postData = {
      "labmem_id": this.userId.user_id,
      "status": 2
    }
    this.apiService.getTicketsByLabMember(postData).subscribe(response => {
      this.pendingjsonArray = response;
      this.pendingdataSource = new MatTableDataSource<Ticket>(this.pendingjsonArray);
    })
  }
  getInprogressTickets() {
    let postData = {
      "labmem_id": this.userId.user_id,
      "status": 3
    }
    this.apiService.getTicketsByLabMember(postData).subscribe(response => {
      this.inprogressjsonArray = response;
      this.inprogressdataSource = new MatTableDataSource<Ticket>(this.inprogressjsonArray);
    })
  }
  getClosedTickets() {
    let postData = {
      "labmem_id": this.userId.user_id,
      "status": 4
    }
    this.apiService.getTicketsByLabMember(postData).subscribe(response => {
      this.closedjsonArray = response;
      this.closeddataSource = new MatTableDataSource<Ticket>(this.closedjsonArray);
    })
  }
  // filterTicket(status) {
  //   let postdata = {
  //     status: status.value
  //   }
  //   this.apiService.getAllStatus(postdata).subscribe(res => {
  //     this.createdjsonArray = res;
  //     this.createddataSource = new MatTableDataSource<Ticket>(this.createdjsonArray);
  //   })
  // }
  showStatus = []
  getTicketStatus() {
    this.apiService.getTicketStatus().subscribe(res => {
      this.ticketStatus = res
      for (let index = 0; index < this.ticketStatus.length; index++) {
        const element = res[index];
        if (element.title != 'created') {
          this.showStatus.push(element)
        }
      }
    })
  }
  changeStatus(status, ticket) {
    console.log(ticket, status);
    let postdata = {
      "ticket_id": ticket.id,
      "status": status.value
    }
    this.apiService.assignStatus(postdata).subscribe(res => {
      this.snackBar.open("Status changed successfully", '', {
        duration: 2000,
      });
      this.getCreatedTickets();
      this.getPendingTickets();
      this.getInprogressTickets();
      this.getClosedTickets();
    })
  }
  redirectTo() {
    this.router.navigate(['/login'])
  }
}

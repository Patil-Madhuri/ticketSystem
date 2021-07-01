import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared-modules/api.service';
import { ViewAssignTicketComponent } from '../../labsquad/view-assign-ticket/view-assign-ticket.component';
import { Ticket } from '../../student/home/home.component';

@Component({
  selector: 'app-labmember',
  templateUrl: './labmember.component.html',
  styleUrls: ['./labmember.component.scss']
})
export class LabmemberComponent implements OnInit {
  currentDate = new Date();
  createdjsonArray: any = []
  pendingjsonArray: any = []
  inprogressjsonArray: any = []
  closedjsonArray: any = []
  slicedcreatedjsonArray: any = []
  slicedpendingjsonArray: any = []
  slicedinprogressjsonArray: any = []
  slicedclosedjsonArray: any = []
  userId: any
  @ViewChild(MatPaginator) createdPaginator: MatPaginator;
  @ViewChild(MatPaginator) pendingPaginator: MatPaginator;
  @ViewChild(MatPaginator) inprogressPaginator: MatPaginator;
  @ViewChild(MatPaginator) closedPaginator: MatPaginator;

  displayedColumns: string[] = ['srno', 'date', 'summary', 'assignto'];
  createddataSource = new MatTableDataSource<Ticket>(this.createdjsonArray);
  pendingdataSource = new MatTableDataSource<Ticket>(this.pendingjsonArray);
  inprogressdataSource = new MatTableDataSource<Ticket>(this.inprogressjsonArray);
  closeddataSource = new MatTableDataSource<Ticket>(this.closedjsonArray);

  createdCount = 0;
  pendingCount = 0;
  inprogressCount = 0;
  closedCount = 0;
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
    setTimeout(() => {
      this.createddataSource.paginator = this.createdPaginator;
      this.pendingdataSource.paginator = this.pendingPaginator;
      this.inprogressdataSource.paginator = this.inprogressPaginator;
      this.closeddataSource.paginator = this.closedPaginator;
    })
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
      console.log(response);
      this.createdjsonArray = response['data'];
      this.slicedcreatedjsonArray = this.createdjsonArray?.slice(0, 5)
      this.createddataSource = new MatTableDataSource<Ticket>(this.slicedcreatedjsonArray);
      this.createdCount = response['count'];
      if (response['message']) {
        this.createdCount = 0;
        this.createdjsonArray = []
      }
    })
  }
  getPendingTickets() {
    let postData = {
      "labmem_id": this.userId.user_id,
      "status": 2
    }
    this.apiService.getTicketsByLabMember(postData).subscribe(response => {
      this.pendingjsonArray = response['data'];
      this.slicedpendingjsonArray = this.pendingjsonArray?.slice(0, 5)
      this.pendingdataSource = new MatTableDataSource<Ticket>(this.slicedpendingjsonArray);
      this.pendingCount = response['count'];
      if (response['message']) {
        this.pendingCount = 0;
        this.pendingjsonArray = []
      }
    })
  }
  getInprogressTickets() {
    let postData = {
      "labmem_id": this.userId.user_id,
      "status": 3
    }
    this.apiService.getTicketsByLabMember(postData).subscribe(response => {
      this.inprogressjsonArray = response['data'];
      this.slicedinprogressjsonArray = this.inprogressjsonArray?.slice(0, 5)
      this.inprogressdataSource = new MatTableDataSource<Ticket>(this.slicedinprogressjsonArray);
      this.inprogressCount = response['count'];
      if (response['message']) {
        this.inprogressCount = 0;
        this.inprogressjsonArray = []
      }
    })
  }
  getClosedTickets() {
    let postData = {
      "labmem_id": this.userId.user_id,
      "status": 4
    }
    this.apiService.getTicketsByLabMember(postData).subscribe(response => {
      this.closedjsonArray = response['data'];
      this.slicedcreatedjsonArray = this.closedjsonArray?.slice(0, 5)
      this.closeddataSource = new MatTableDataSource<Ticket>(this.slicedcreatedjsonArray);
      this.closedCount = response['count'];
      if (response['message']) {
        this.closedCount = 0;
        this.closedjsonArray = []
      }
    })
  }
  applyFilterOn = ""
  applyFilter(event: Event) {
    switch (this.applyFilterOn) {
      case 'created':
        const filterValue = (event.target as HTMLInputElement).value;
        this.createddataSource.filter = filterValue.trim().toLowerCase();
        if (this.createddataSource.paginator) {
          this.createddataSource.paginator.firstPage()
        }
        break;
      case 'pending':
        const filterValue1 = (event.target as HTMLInputElement).value;
        this.pendingdataSource.filter = filterValue1.trim().toLowerCase();
        if (this.pendingdataSource.paginator) {
          this.pendingdataSource.paginator.firstPage()
        }
        break;
      case 'inprogress':
        const filterValue2 = (event.target as HTMLInputElement).value;
        this.inprogressdataSource.filter = filterValue2.trim().toLowerCase();
        if (this.inprogressdataSource.paginator) {
          this.inprogressdataSource.paginator.firstPage()
        }
        break;
      case 'closed':
        const filterValue3 = (event.target as HTMLInputElement).value;
        this.closeddataSource.filter = filterValue3.trim().toLowerCase();
        if (this.closeddataSource.paginator) {
          this.closeddataSource.paginator.firstPage()
        }
        break;
      default:
        break;
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    switch (tabChangeEvent.index) {
      case 0:
        this.applyFilterOn = 'created'
        break;
      case 1:
        this.applyFilterOn = 'pending';
        break;
      case 2:
        this.applyFilterOn = 'inprogress'
        break;
      case 3:
        this.applyFilterOn = 'closed'
        break;
      default:
        break;
    }
  }
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
  pageChanged(value, event) {
    console.log(event);
    switch (value) {
      case 'created':
        this.slicedcreatedjsonArray = this.createdjsonArray.slice(this.slicedcreatedjsonArray.length, this.slicedcreatedjsonArray.length + 5)
        this.createddataSource = new MatTableDataSource<Ticket>(this.slicedcreatedjsonArray);
        break;
      case 'pending':
        this.slicedpendingjsonArray = this.pendingjsonArray.slice(this.slicedpendingjsonArray.length, this.slicedpendingjsonArray.length + 5)
        this.pendingdataSource = new MatTableDataSource<Ticket>(this.slicedpendingjsonArray);
        break;

      case 'inprogress':
        this.slicedinprogressjsonArray = this.inprogressjsonArray.slice(this.slicedinprogressjsonArray.length, this.slicedinprogressjsonArray.length + 5)
        this.inprogressdataSource = new MatTableDataSource<Ticket>(this.slicedinprogressjsonArray);
        break;
      case 'closed':
        this.slicedclosedjsonArray = this.inprogressjsonArray.slice(this.slicedclosedjsonArray.length, this.slicedclosedjsonArray.length + 5)
        this.closeddataSource = new MatTableDataSource<Ticket>(this.slicedclosedjsonArray);
        break;

      default:
        break;
    }
  }
}

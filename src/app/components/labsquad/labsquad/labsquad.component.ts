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
  jsonArray: any = []
  userId: any
  displayedColumns: string[] = ['srno', 'date', 'summary', 'assignto'];
  dataSource = new MatTableDataSource<Ticket>(this.jsonArray);
  ticketStatus: any = []
  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private http: HttpClient,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user'))
    this.getTicketStatus()
    this.getTickets();
  }

  // viewAssignTicket(data) {
  //   const dialog = this.dialog.open(ViewAssignTicketComponent, {
  //     width: '40%',
  //     data: data ? data : null,
  //   });
  //   dialog.afterClosed().subscribe(res => {
  //     console.log("res", res);
  //     this.getTickets()
  //   })
  // }

  getTickets() {
    this.apiService.getalltickets().subscribe(response => {
      this.jsonArray = response;
      this.dataSource = new MatTableDataSource<Ticket>(this.jsonArray);
    })
  }
  filterTicket(status) {
    let postdata = {
      status: status.value
    }
    this.apiService.getAllStatus(postdata).subscribe(res => {
      this.jsonArray = res;
      this.dataSource = new MatTableDataSource<Ticket>(this.jsonArray);
    })
  } 
  getTicketStatus() {
    this.apiService.getTicketStatus().subscribe(res => {
      this.ticketStatus = res
    })
  }
  changeStatus(status, ticket) {
    console.log(ticket, status);
    let postdata = {
      "ticket_id": ticket.id,
      "status": status.value
    }
    this.apiService.assignStatus(postdata).subscribe(res=> {
      this.snackBar.open("Status changed successfully", '', {
        duration: 2000,
      });
    })
  }
  redirectTo() {
    this.router.navigate(['/login'])
  }
}

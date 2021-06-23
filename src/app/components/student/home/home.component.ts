import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared-modules/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RaiseTicket } from './raiseTicket/raiseTicket.component';
import { MatTableDataSource } from '@angular/material/table';
import { ViewAssignTicketComponent } from '../../labmember/view-assign-ticket/view-assign-ticket.component';
export interface Ticket {
  summary: string;
  raisedBy: string;
  date: any
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentDate = new Date();
  isAdmin
  userName = ""
  jsonArray:any = []
  userId: any;
  displayedColumns: string[] = ['srno', 'date', 'summary','view'];
  dataSource = new MatTableDataSource<Ticket>(this.jsonArray);
  constructor(private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user'));
    this.getAllTickets();
  }
  RaiseTicket(data?) {
    const dialog = this.dialog.open(RaiseTicket, {
      width: '40%',
      data: data ? data : null,
    });
    dialog.afterClosed().subscribe(res => {
      console.log("res", res);
    })
  }
  getAllTickets() {
    this.apiService.getalltickets().subscribe(response => {
      this.jsonArray = response;
      this.dataSource = new MatTableDataSource<Ticket>(this.jsonArray);
    })
  }
  viewAssignTicket(data) {
    const dialog = this.dialog.open(ViewAssignTicketComponent, {
      width: '40%',
      data: data ? data : null,
    });
    dialog.afterClosed().subscribe(res => {
      console.log("res", res);
      this.getAllTickets()
    })
  }
  redirectTo(url) {
    this.router.navigate([url])
  }

}

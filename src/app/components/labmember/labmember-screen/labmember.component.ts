import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared-modules/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewAssignTicketComponent } from '../view-assign-ticket/view-assign-ticket.component';

export interface Ticket {
  summary: string;
  raisedBy: string;
  date: any
}
@Component({
  selector: 'app-labmember',
  templateUrl: './labmember.component.html',
  styleUrls: ['./labmember.component.scss']
})


export class LabMemberComponent implements OnInit {
  currentDate = new Date();
  jsonArray: any = []
  userId:any
  displayedColumns: string[] = ['srno', 'date', 'summary', 'assignto'];
  dataSource = new MatTableDataSource<Ticket>(this.jsonArray);

  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private http: HttpClient,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user'))
    this.getTickets();
  }

  viewAssignTicket(data) {
    const dialog = this.dialog.open(ViewAssignTicketComponent, {
      width: '40%',
      data: data ? data : null,
    });
    dialog.afterClosed().subscribe(res => {
      console.log("res", res);
      this.getTickets()
    })
  }

  getTickets() {
    this.apiService.getalltickets().subscribe(response => {
      this.jsonArray = response;
      this.dataSource = new MatTableDataSource<Ticket>(this.jsonArray);
    })
  }

  redirectTo() {
    this.router.navigate(['/login'])
  }
}

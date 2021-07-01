import { Component, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared-modules/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RaiseTicket } from './raiseTicket/raiseTicket.component';
import { MatTableDataSource } from '@angular/material/table';
import { ViewAssignTicketComponent } from '../../labsquad/view-assign-ticket/view-assign-ticket.component';
import { MatPaginator } from '@angular/material/paginator';
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
  jsonArray: any = []
  slicedArray: any = []
  userId: any;
  displayedColumns: string[] = ['srno', 'date', 'summary', 'view'];
  dataSource = new MatTableDataSource<Ticket>(this.jsonArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user'));
    this.getAllTickets();
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    })
  }
  ngOnChanges(changes: SimpleChange) {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    })
  }
  RaiseTicket(data?) {
    const dialog = this.dialog.open(RaiseTicket, {
      width: '40%',
      data: data ? data : null,
    });
    dialog.afterClosed().subscribe(res => {
      console.log("res", res);
      this.getAllTickets()
    })
  }
  getAllTickets() {
    let postData = {
      student_id: this.userId.user_id
    }
    this.apiService.getTicketByStudentId(postData).subscribe(response => {
      this.jsonArray = response;
      this.slicedArray = this.jsonArray.slice(0, 5)
      this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray);
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
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
  pageChanged(event) {
    console.log(event);
    console.log(this.slicedArray);
    this.slicedArray = this.jsonArray.slice(this.slicedArray.length, this.slicedArray.length + 5)
    this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray);
  }
}

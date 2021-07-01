import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewAssignTicketComponent } from '../view-assign-ticket/view-assign-ticket.component';
import { ApiService } from 'src/app/shared-modules/api.service';
import { MatSort } from '@angular/material/sort';

export interface Ticket {
  summary: string;
  raisedBy: string;
  date: any
}

@Component({
  selector: 'app-lab-squad',
  templateUrl: './lab-squad.component.html',
  styleUrls: ['./lab-squad.component.scss']
})
export class LabSquadComponent implements OnInit {
  currentDate = new Date();
  jsonArray: any = []
  slicedArray: any = []
  userId: any
  displayedColumns: string[] = ['srno', 'date', 'summary', 'assignto'];
  dataSource = new MatTableDataSource<Ticket>(this.jsonArray);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private http: HttpClient,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user'))
    this.getTickets();
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

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
      this.getTickets()
    })
  }

  getTickets() {
    this.apiService.getalltickets().subscribe(response => {
      this.jsonArray = response;
      this.slicedArray = this.jsonArray.slice(0, 5)
      this.dataSource = new MatTableDataSource<Ticket>(this.jsonArray);
    })
  }

  redirectTo() {
    this.router.navigate(['/login'])
  }

  pageChanged(event) {
    console.log(event);
    console.log(this.slicedArray);
    this.slicedArray = this.jsonArray.slice(this.slicedArray.length, this.slicedArray.length + 5)
    this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray);
  }
}

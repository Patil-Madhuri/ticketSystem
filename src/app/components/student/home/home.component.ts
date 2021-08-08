import { Component, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared-modules/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RaiseTicket } from './raiseTicket/raiseTicket.component';
import { MatTableDataSource } from '@angular/material/table';
import { ViewAssignTicketComponent } from '../../labsquad/view-assign-ticket/view-assign-ticket.component';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2'
import { MatSort, Sort } from '@angular/material/sort';

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
  @ViewChild(MatSort) sort: MatSort;

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
      this.dataSource.sort = this.sort;
    })
  }
  ngOnChanges(changes: SimpleChange) {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
      this.slicedArray = this.jsonArray?.slice(0, 5)
      this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray);
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource = new MatTableDataSource<Ticket>(this.jsonArray.filter(el => el.issue_title.includes(filterValue.trim().toLowerCase())));

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage()
    // }
  }
  cancelTicket(object) {
    console.log(object);

    Swal.fire({
      text: 'Are you sure you want to cancel this ticket ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        let postdata = {
          ticket_id: object.id
        }
        this.apiService.cancelTicket(postdata).subscribe(res => {
          this.snackBar.open("Ticket cancelled successfully", '', {
            duration: 2000,
          });
          this.getAllTickets()
        })
      }
    })
  }
  viewAssignTicket(data) {
    data.isViewFromStudent = true;
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
    if (event.previousPageIndex > event.pageIndex) {
      this.slicedArray = this.jsonArray?.slice(0, 5)
      this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray);
    } else {
      this.slicedArray = this.jsonArray.slice(this.slicedArray.length, this.slicedArray.length + 5)
      this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray);
    }

  }
  sortData(sort: Sort) {
    const data = this.jsonArray.slice();
    if (!sort.active || sort.direction === '') {
      this.jsonArray = data;
      return;
    }

    this.jsonArray = data.sort((a, b) => {
      switch (sort.active) {
        case 'srno':
          if (sort.direction == 'asc') {
            this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray.sort(function (a, b) {
              if (a.ticket_id === b.ticket_id) {
                return 0;
              }
              if (typeof a.ticket_id === typeof b.ticket_id) {
                return a.ticket_id < b.ticket_id ? -1 : 1;
              }
              return typeof a.ticket_id < typeof b.ticket_id ? -1 : 1;
            }));
          } else {
            this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray.sort(function (a, b) {
              if (a.ticket_id === b.ticket_id) {
                return 0;
              }
              if (typeof a.ticket_id === typeof b.ticket_id) {
                return a.ticket_id > b.ticket_id ? -1 : 1;
              }
              return typeof a.ticket_id > typeof b.ticket_id ? -1 : 1;
            }));
          }
          break;
        case 'date':
          if (sort.direction == 'asc') {
            this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray.sort(function (a, b) {
              return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);
            }));
          } else {
            this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray.sort(function (a, b) {
              return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0);
            }));
          }
          break;
        case 'summary':
          if (sort.direction == 'asc') {
            this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray.sort((one, two) => (one.issue_title < two.issue_title ? -1 : 1)));
          } else {
            this.dataSource = new MatTableDataSource<Ticket>(this.slicedArray.sort((one, two) => (one.issue_title > two.issue_title ? -1 : 1)));
          }
          break;
      }
    });
  }

}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared-modules/api.service';
import Swal from 'sweetalert2';
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
  @ViewChild('createdSort') public createdSort: MatSort;
  @ViewChild('pendingSort') public pendingSort: MatSort;
  @ViewChild('inprogressSort') public inprogressSort: MatSort;
  @ViewChild('closedsort') public closedsort: MatSort;
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
    this.applyFilterOn = 'created'

    setTimeout(() => {
      this.createddataSource.paginator = this.createdPaginator;
      this.createddataSource.sort = this.createdSort;
      this.pendingdataSource.paginator = this.pendingPaginator;
      this.pendingdataSource.sort = this.pendingSort;
      this.inprogressdataSource.paginator = this.inprogressPaginator;
      this.inprogressdataSource.sort = this.inprogressSort;
      this.closeddataSource.paginator = this.closedPaginator;
      this.closeddataSource.sort = this.closedsort;
    })
  }

  viewAssignTicket(data) {
    const dialog = this.dialog.open(ViewAssignTicketComponent, {
      width: '40%',
      data: data ? data : null,
    });
    dialog.afterClosed().subscribe(res => {
      this.getCreatedTickets();
    })
  }

  getCreatedTickets() {
    let postData = {
      "labmem_id": this.userId.user_id,
      "status": 1
    }
    this.apiService.getTicketsByLabMember(postData).subscribe(response => {
      this.createdjsonArray = response['data'];
      this.slicedcreatedjsonArray = this.createdjsonArray?.slice(0, 5)
      this.createddataSource = new MatTableDataSource<Ticket>(this.slicedcreatedjsonArray);
      this.createdCount = response['counts'];
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
      this.pendingCount = response['counts'];
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
      this.inprogressCount = response['counts'];
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
      this.slicedclosedjsonArray = this.closedjsonArray?.slice(0, 5)
      this.closeddataSource = new MatTableDataSource<Ticket>(this.slicedclosedjsonArray);
      this.closedCount = response['counts'];
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
        // this.createddataSource.filter = filterValue.trim().toLowerCase();
        // if (this.createddataSource.paginator) {
        //   this.createddataSource.paginator.firstPage()
        // }
        this.createddataSource = new MatTableDataSource<Ticket>(this.createdjsonArray.filter(el => el.issue_title.includes(filterValue.trim().toLowerCase())));

        break;
      case 'pending':
        const filterValue1 = (event.target as HTMLInputElement).value;
        // this.pendingdataSource.filter = filterValue1.trim().toLowerCase();
        // if (this.pendingdataSource.paginator) {
        //   this.pendingdataSource.paginator.firstPage()
        // }
        this.pendingdataSource = new MatTableDataSource<Ticket>(this.pendingjsonArray.filter(el => el.issue_title.includes(filterValue.trim().toLowerCase())));
        break;
      case 'inprogress':
        const filterValue2 = (event.target as HTMLInputElement).value;
        // this.inprogressdataSource.filter = filterValue2.trim().toLowerCase();
        // if (this.inprogressdataSource.paginator) {
        //   this.inprogressdataSource.paginator.firstPage()
        // }
        this.inprogressdataSource = new MatTableDataSource<Ticket>(this.inprogressjsonArray.filter(el => el.issue_title.includes(filterValue.trim().toLowerCase())));
        break;
      case 'closed':
        const filterValue3 = (event.target as HTMLInputElement).value;
        // this.closeddataSource.filter = filterValue3.trim().toLowerCase();
        // if (this.closeddataSource.paginator) {
        //   this.closeddataSource.paginator.firstPage()
        // }
        this.closeddataSource = new MatTableDataSource<Ticket>(this.closedjsonArray.filter(el => el.issue_title.includes(filterValue.trim().toLowerCase())));
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
    if (status.value == 4) {
      Swal.fire({
        text: 'Are you sure you want to close this ticket ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, close it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          this.apiService.assignStatus(postdata).subscribe(res => {
            this.snackBar.open("Status changed successfully", '', {
              duration: 2000,
            });

          })
          this.getCreatedTickets();
          this.getPendingTickets();
          this.getInprogressTickets();
          this.getClosedTickets();
        }

      })

    } else {
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

  sortDataCreated(sort: Sort) {
    const data = this.createdjsonArray.slice();
    if (!sort.active || sort.direction === '') {
      this.createdjsonArray = data;
      return;
    }

    this.createdjsonArray = data.sort((a, b) => {
      switch (sort.active) {
        case 'date':
          if (sort.direction == 'asc') {
            this.createddataSource = new MatTableDataSource<Ticket>(this.slicedcreatedjsonArray.sort(function (a, b) {
              return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);
            }));
          } else {
            this.createddataSource = new MatTableDataSource<Ticket>(this.slicedcreatedjsonArray.sort(function (a, b) {
              return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0);
            }));
          }
          break;
        case 'summary':
          if (sort.direction == 'asc') {
            this.createddataSource = new MatTableDataSource<Ticket>(this.slicedcreatedjsonArray.sort((one, two) => (one.issue_title < two.issue_title ? -1 : 1)));
          } else {
            this.createddataSource = new MatTableDataSource<Ticket>(this.slicedcreatedjsonArray.sort((one, two) => (one.issue_title > two.issue_title ? -1 : 1)));
          }
          break;
      }
    });
  }
  sortDataPending(sort: Sort) {
    const data = this.slicedpendingjsonArray.slice();
    if (!sort.active || sort.direction === '') {
      this.slicedpendingjsonArray = data;
      return;
    }

    this.slicedpendingjsonArray = data.sort((a, b) => {
      switch (sort.active) {
        case 'srno':
          if (sort.direction == 'asc') {
            this.pendingdataSource = new MatTableDataSource<Ticket>(this.slicedpendingjsonArray.sort(function (a, b) {
              if (a.ticket_id === b.ticket_id) {
                return 0;
              }
              if (typeof a.ticket_id === typeof b.ticket_id) {
                return a.ticket_id < b.ticket_id ? -1 : 1;
              }
              return typeof a.ticket_id < typeof b.ticket_id ? -1 : 1;
            }));
          } else {
            this.pendingdataSource = new MatTableDataSource<Ticket>(this.slicedpendingjsonArray.sort(function (a, b) {
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
            this.pendingdataSource = new MatTableDataSource<Ticket>(this.slicedpendingjsonArray.sort(function (a, b) {
              return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);
            }));
          } else {
            this.pendingdataSource = new MatTableDataSource<Ticket>(this.slicedpendingjsonArray.sort(function (a, b) {
              return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0);
            }));
          }
          break;
        case 'summary':
          if (sort.direction == 'asc') {
            this.pendingdataSource = new MatTableDataSource<Ticket>(this.slicedpendingjsonArray.sort((one, two) => (one.issue_title < two.issue_title ? -1 : 1)));
          } else {
            this.pendingdataSource = new MatTableDataSource<Ticket>(this.slicedpendingjsonArray.sort((one, two) => (one.issue_title > two.issue_title ? -1 : 1)));
          }
          break;
      }
    });
  }
  sortDataInProgress(sort: Sort) {
    const data = this.slicedinprogressjsonArray.slice();
    if (!sort.active || sort.direction === '') {
      this.slicedinprogressjsonArray = data;
      return;
    }

    this.slicedinprogressjsonArray = data.sort((a, b) => {
      switch (sort.active) {
        case 'srno':
          if (sort.direction == 'asc') {
            this.inprogressdataSource = new MatTableDataSource<Ticket>(this.slicedinprogressjsonArray.sort(function (a, b) {
              if (a.ticket_id === b.ticket_id) {
                return 0;
              }
              if (typeof a.ticket_id === typeof b.ticket_id) {
                return a.ticket_id < b.ticket_id ? -1 : 1;
              }
              return typeof a.ticket_id < typeof b.ticket_id ? -1 : 1;
            }));
          } else {
            this.inprogressdataSource = new MatTableDataSource<Ticket>(this.slicedinprogressjsonArray.sort(function (a, b) {
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
            this.inprogressdataSource = new MatTableDataSource<Ticket>(this.slicedinprogressjsonArray.sort(function (a, b) {
              return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);
            }));
          } else {
            this.inprogressdataSource = new MatTableDataSource<Ticket>(this.slicedinprogressjsonArray.sort(function (a, b) {
              return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0);
            }));
          }
          break;
        case 'summary':
          if (sort.direction == 'asc') {
            this.inprogressdataSource = new MatTableDataSource<Ticket>(this.slicedinprogressjsonArray.sort((one, two) => (one.issue_title < two.issue_title ? -1 : 1)));
          } else {
            this.inprogressdataSource = new MatTableDataSource<Ticket>(this.slicedinprogressjsonArray.sort((one, two) => (one.issue_title > two.issue_title ? -1 : 1)));
          }
          break;
      }
    });
  }
  sortDataClosed(sort: Sort) {
    const data = this.slicedclosedjsonArray.slice();
    if (!sort.active || sort.direction === '') {
      this.slicedclosedjsonArray = data;
      return;
    }

    this.slicedclosedjsonArray = data.sort((a, b) => {
      switch (sort.active) {
        case 'srno':
          if (sort.direction == 'asc') {
            this.closeddataSource = new MatTableDataSource<Ticket>(this.slicedclosedjsonArray.sort(function (a, b) {
              if (a.ticket_id === b.ticket_id) {
                return 0;
              }
              if (typeof a.ticket_id === typeof b.ticket_id) {
                return a.ticket_id < b.ticket_id ? -1 : 1;
              }
              return typeof a.ticket_id < typeof b.ticket_id ? -1 : 1;
            }));
          } else {
            this.closeddataSource = new MatTableDataSource<Ticket>(this.slicedclosedjsonArray.sort(function (a, b) {
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
            this.closeddataSource = new MatTableDataSource<Ticket>(this.slicedclosedjsonArray.sort(function (a, b) {
              return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);
            }));
          } else {
            this.closeddataSource = new MatTableDataSource<Ticket>(this.slicedclosedjsonArray.sort(function (a, b) {
              return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0);
            }));
          }
          break;
        case 'summary':
          if (sort.direction == 'asc') {
            this.closeddataSource = new MatTableDataSource<Ticket>(this.slicedclosedjsonArray.sort((one, two) => (one.issue_title < two.issue_title ? -1 : 1)));
          } else {
            this.closeddataSource = new MatTableDataSource<Ticket>(this.slicedclosedjsonArray.sort((one, two) => (one.issue_title > two.issue_title ? -1 : 1)));
          }
          break;
      }
    });
  }
}

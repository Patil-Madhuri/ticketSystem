import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared-modules/api.service';
import { ViewAssignTicketComponent } from '../../labsquad/view-assign-ticket/view-assign-ticket.component';
import { Ticket } from '../../student/home/home.component';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  currentDate = new Date();
  jsonArray: any = []
  slicedArray: any = []
  userId: any
  supportMember: any = [];
  displayedColumns: string[] = ['assignto'];
  dataSource = new MatTableDataSource<Ticket>(this.supportMember);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private http: HttpClient,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user'))
    this.getLabMember();
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })
  }
  getLabMember() {
    let postdata = {
      "user_type": "labmember"
    }
    this.apiService.getLabmember(postdata).subscribe(response => {
      this.supportMember = response;
      this.slicedArray = this.supportMember.slice(0, 5)
      this.dataSource = new MatTableDataSource<Ticket>(this.supportMember);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  makeLeader(data) {
    let postdata = {
      users_id: data.id,
      role: 'lableader'
    }
    this.apiService.makeLeader(postdata).subscribe(res => {
      this.snackBar.open("Marked as leader successfully", '', {
        duration: 2000,
      });
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

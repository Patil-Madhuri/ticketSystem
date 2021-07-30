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
  member: any
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear()
  pieChartColor: any = [
    {
      backgroundColor: ['rgba(30, 169, 224, 0.8)',
        'rgba(255,165,0,0.9)',
        'rgba(139, 136, 136, 0.9)',
        'rgba(255, 161, 181, 0.9)'
      ]
    }
  ]
  pieChartLabels = []
  pieChartData = []
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = false;
  public barChartData = [
    {
      data: [], label: 'Tickets', barThickness: 30,
      barPercentage: 0.9
    }
  ];

  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private http: HttpClient,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user'))
    this.getLabMember();
    this.getAnyalyics()
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })
  }
  getAnyalyics() {
    let postdata = {
      month: this.selectedMonth,
      year: this.selectedYear
    }
    this.apiService.getAnyalyics(postdata).subscribe(response => {
      this.pieChartLabels = response['pie_chart'].label;
      this.pieChartData = response['pie_chart'].data
      this.barChartLabels = response['pie_chart'].label;
      this.barChartData[0].data = response['pie_chart'].data
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

  makeLeader() {
    let postdata = {
      users_id: this.member,
      role: 'lableader'
    }
    this.apiService.makeLeader(postdata).subscribe(res => {
      this.snackBar.open("Marked as leader successfully", '', {
        duration: 2000,
      });
      this.member = "";
      this.getLabMember();
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

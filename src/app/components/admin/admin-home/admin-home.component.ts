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
import { RemoveLeaderMemberComponent } from '../remove-leader-member/remove-leader-member.component';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';

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
  students: any = [];
  displayedColumns: string[] = ['assignto'];
  dataSource = new MatTableDataSource<Ticket>(this.supportMember);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  member: any
  student: any
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
  totalnumber = 0
  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private http: HttpClient,
    private dialog: MatDialog) { }
  analyticsArray: any = []
  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user'))
    this.getLabMember();
    this.getAnyalyics()
    this.getallassigntickets()
    this.getStudents()
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })
  }
  getallassigntickets() {
    this.apiService.allassigntickets().subscribe(response => {
      this.analyticsArray = response
    })
  }
  exportData() {
    const headerNames = ['Student name', 'Ticket Id', 'Ticket Status', 'Date', 'Timeslot'];
    const headers = ['name', 'ticket_id', 'status', 'date', 'timeslot'];

    this.exportAsExcelFile(this.analyticsArray, 'analyticsReport', headers,
      headerNames);
  }
  exportAsExcelFile(json: any[], excelFileName: string, headers: any[], headerNames: any[]): void {
    const sheetData = [[], [], [], [], []];
    sheetData.push(headerNames);
    json.forEach((val) => {
      const data = [];
      headers.forEach(header => {
        data.push(val[header]);
      });
      sheetData.push(data);
    });
    const length = sheetData.length;
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet['A1'] = { t: 's', v: 'Analytics Report' };

    worksheet['A3'] = { t: 's', v: 'Date: ' + moment(new Date()).format('DD/MM/YYYY') };

    worksheet['!merges'] = [{ s: { c: 0, r: 0 }, e: { c: headers.length + 4, r: 0 } },
    { s: { c: 0, r: 1 }, e: { c: headers.length + 4, r: 1 } },
    { s: { c: 0, r: 2 }, e: { c: headers.length + 4, r: 2 } },
    { s: { c: 0, r: 3 }, e: { c: headers.length + 4, r: 3 } }];


    worksheet['!ref'] = XLSX.utils.encode_range({
      s: { c: 0, r: 0 },
      e: { c: headerNames.length, r: 1 + length + 3 }
    });

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';

    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_' + moment(new Date()).format('DD/MM/YYYY') + EXCEL_EXTENSION);
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
      for (let index = 0; index < response['pie_chart'].data.length; index++) {
        const element = response['pie_chart'].data[index];
        this.totalnumber += element
      }
    })
  }
  getLabMember() {
    let postdata = {
      "user_type": "labmember"
    }
    this.apiService.getLabmember(postdata).subscribe(response => {
      this.supportMember = response;
    })
  }
  getStudents() {
    let postdata = {
      "user_type": "student"
    }
    this.apiService.getLabmember(postdata).subscribe(response => {
      this.students = response;
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

  makeMember() {
    let postdata = {
      users_id: this.student,
      role: 'labmember'
    }
    this.apiService.makeLeader(postdata).subscribe(res => {
      this.snackBar.open("Marked as member successfully", '', {
        duration: 2000,
      });
      this.student = "";
      this.getStudents();
      this.getLabMember()
    })
  }

  removeLeaderMember(value) {
    let data = {
      list: [],
      value: value
    }
    if (value == 'member') {
      data.list = this.students;
    } else {
      data.list = this.supportMember
    }
    const dialog = this.dialog.open(RemoveLeaderMemberComponent, {
      width: '40%',
      data: data,
    });
    dialog.afterClosed().subscribe(res => {
      console.log("res", res);
      this.getLabMember();
      this.getStudents()
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

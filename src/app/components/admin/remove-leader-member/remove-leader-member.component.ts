import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared-modules/api.service';

@Component({
  selector: 'app-remove-leader-member',
  templateUrl: './remove-leader-member.component.html',
  styleUrls: ['./remove-leader-member.component.scss']
})
export class RemoveLeaderMemberComponent implements OnInit {
  selectedId: any
  supportMember: any = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RemoveLeaderMemberComponent>,
    private apiService: ApiService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    if (this.data.value == 'member') {
      this.getLabMember()
    } else {
      this.getLabLeader();
    }
  }

  removeMember() {
    let postdata = {
      users_id: this.selectedId,
      role: this.data.value == 'member' ? 'student' : 'labmember'
    }
    this.apiService.makeLeader(postdata).subscribe(res => {
      this.snackBar.open("Removed successfully", '', {
        duration: 2000,
      });
      this.selectedId = "";
      this.dialogRef.close();
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
  getLabLeader() {
    let postdata = {
      "user_type": "lableader"
    }
    this.apiService.getLabmember(postdata).subscribe(response => {
      this.supportMember = response;
    })
  }
}

import { NgModule } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
    imports: [
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatIconModule,
        MatDividerModule,
        MatDialogModule,
        MatSnackBarModule,
        MatRadioModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatTableModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    exports: [
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatIconModule,
        MatDialogModule,
        MatDividerModule,
        MatSnackBarModule,
        MatRadioModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatTableModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})

export class AppMaterial {

}

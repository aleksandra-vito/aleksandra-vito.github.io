import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Form, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobDescription } from 'src/app/models/jobdescr.model';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  @Input() job?: JobDescription;

  butonDialog = "Create";
  titullDialog = "Add values";

  createJobOffer: FormGroup;

  today = new Date().toJSON().split('T')[0];
  dataBirthDate = new DatePipe('en-US');
  valueDate = this.dataBirthDate.transform(this.today, 'yyyy-MM-dd');
  creator: string = '';
  currentJob: JobDescription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewComponent>,
    public _matDialog: MatDialog,
    private auth: AuthService,
    private snackBar: MatSnackBar,

  ) {
  }

  get title() {
    return this.createJobOffer.get('title')!;
  }

  get description() {
    return this.createJobOffer.get('description')!;
  }

  get company() {
    return this.createJobOffer.get('company')!;
  }

  get yearExp() {
    return this.createJobOffer.get('yearExp')!;
  }

  get place() {
    return this.createJobOffer.get('place')!;
  }

  ngOnInit(): void {

    let creatorJob = JSON.parse(localStorage.getItem('user'))
    this.creator = creatorJob.firstName + ' ' + creatorJob.lastName;

    this.createJobOffer = new FormGroup({
      idCreator: new FormControl(this.auth.currentUserId),
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(40)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(256)
      ]),
      company: new FormControl('', [
        Validators.required,
      ]),
      yearExp: new FormControl('', [
        Validators.required
      ]),
      place: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15)
      ]),
      creator: new FormControl(this.creator),
      favorite: new FormControl(false)
    });
    this.currentJob = this.createJobOffer.value;

    if (this.data.creator !== '')
      // this.createForm(this.data)

    if (this.data.data !== '')
      this.createForm(this.data.data)
  }

  ngOnChanges(): void {
    // this.message = '';
    this.currentJob = { ...this.job };
  }

  createForm(data) {

    this.butonDialog = "Modify";
    this.titullDialog = "Edit job offer";
    let dataBirthDate = new DatePipe('en-US');
    //let valueDate = dataBirthDate.transform(data.clientList.BirthDate, 'yyyy-MM-dd');
    this.createJobOffer.setValue({
      idCreator: data.idCreator,
      title: data.title,
      description: data.description,
      company: data.company,
      yearExp: data.yearExp,
      place: data.place,
      creator: data.creator,
      favorite: data.favorite,
    })

  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    // console.log(this.createJobOffer.value, ' ehe ')
  }

  saveJob(): void {
    this.auth.create(this.createJobOffer.value).then(() => {
      this.snackBar.open('Created new job successfully!', 'OK',
        { duration: 2000 });
      this.close();
      // this.submitted = true;
    }).catch(_error => {
      // this.error = _error
      this.snackBar.open('Error.', 'OK',
        { duration: 2000 });
      // this.router.navigate(['/register'])
    });
  }

  updateJob(): void {
    const data = {
      title: this.createJobOffer.get('title').value,
      description: this.createJobOffer.get('description').value,
      company: this.createJobOffer.get('company').value,
      yearExp: this.createJobOffer.get('yearExp').value,
      place: this.createJobOffer.get('place').value
    };
    if (this.data.key) {
      this.auth.update(this.data.key, data)
        .then(() => {
          this.snackBar.open('Edited new job successfully!', 'OK',
            { duration: 2000 });
          this.close();
        })
        .catch(err => console.log(err));
    }
  }
}

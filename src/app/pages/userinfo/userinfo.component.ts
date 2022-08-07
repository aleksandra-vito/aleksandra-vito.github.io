import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewComponent } from 'src/app/dialog/new/new.component';
import { MatDialog } from '@angular/material/dialog';
import { JobDescription } from 'src/app/models/jobdescr.model';
import { DatePipe } from '@angular/common';
import { isNumeric } from 'rxjs/internal-compatibility'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {

  displayedColumns: string[] = ['title', 'description', 'yearExp', 'place', 'options'];
  jobs: JobDescription[];
  dataSource: MatTableDataSource<any>

  showButton: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    yearExp: new FormControl(''),
    place: new FormControl('')
  });
  creator: string;
  title: any;
  description: any;
  yearExp: any;
  place: any;

  sortDir: string = 'default'
  type: any = '';

  constructor(
    public authservice: AuthService,
    private router: Router,
    public _matDialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.retrieveJobs();
    // this.getCreator();
    // if (this.type === 'jobseeker') this.showButton = false;
    // console.log(this.authservice.currentUser, ' currentUser ')
    // console.log(this.getCreator(), ' type ')

  }


  retrieveJobs(): void {
    this.authservice.getAllJobs().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      // console.log(data);
      this.jobs = data;
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  openNew(client) {
    this._matDialog.open(NewComponent, {
      panelClass: 'custom-dialog-container5',
      disableClose: true,
      autoFocus: false,
      width: '550px',
      data: {
        data: '',
      }
    }).afterClosed().subscribe(res => {
    })
  }

  getCreator(): string {
    if ((this.authservice.authState.user.uid !== null)) {
      this.authservice.getUser(this.authservice.authState.user.uid).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )).subscribe(data => {
          data.forEach((value) => {
            if (value.Id === this.authservice.currentUserId) {
              // console.log(`${value.data['firstName']} ` + `${value.data['lastName']}`)
              this.type = value.data['type'];
            }
          }
          )
        });
      return this.type
    }
  }

  // applyFilter() {
  //   const tt = this.searchForm.get('title').value;
  //   const ds = this.searchForm.get('description').value;
  //   const ye = this.searchForm.get('yearExp').value;
  //   const pl = this.searchForm.get('place').value;

  //   this.title = tt === null ? '' : tt;
  //   this.description = ds === null ? '' : ds;
  //   this.yearExp = ye === null ? '' : ye
  //   this.place = pl === null ? '' : pl;

  //   // create string of our searching values and split if by '$'
  //   const filterValue = this.title + '$' + this.description + '$' + this.yearExp + '$' + this.place;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  // Apply a search to the datatable
  applyFilter(column: string, filterValue: string): any {
    this.clear(column)
    //search all the table
    if (column == 'all') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      // Pass the search column to search into
      this.dataSource.filterPredicate = this.customSearch(column);

      // Pass the user filter
      this.dataSource.filter = filterValue
    }


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clear(column) {
    var array = ['title', 'description', 'yearExp', 'place'];
    array.forEach((element, index) => {
      //nqs po bejme refresh
      if (column == '') {
        this[element] = ''
      }
      else {
        if (element == column) {
          array.splice(index, 0); //heqim elementin qe mos te behet clear
        }
        else
          this[element] = ''
      }
    });

    //kjo duhet default
    //change sort
    this.sortDir = 'default'
    this.sort.direction = '';
  }


  customSearch(column: string): any {
    let search = this.dataSource.filterPredicate = (data: any, filter: any): boolean => {

      if (data[column] == null) {
        return
      }

      if (filter === "") return

      /**
       * General serach for all other fields
       * This search is case insensitive 
      **/

      else if (isNumeric(filter)) {
        filter = filter
        return data[column].toString().trim().toLowerCase().indexOf(filter) !== -1
      }
      else {
        filter = filter.trim().toLowerCase()

        if (column === 'creationDate') {
          var datePipe = new DatePipe("en-US")
          return datePipe.transform(data[column], 'dd/MM/yyyy HH:mm:ss').indexOf(filter) !== -1
        }

        return data[column].toString().trim().toLowerCase().indexOf(filter) !== -1
      }
    }
    return search
  }

  handleSortChange(colId, type): void {
    this.sort.active = colId;
    if (this.sort.direction === 'asc')
      this.sort.direction = 'desc'
    else
      this.sort.direction = 'asc'
    let sortState = {
      active: colId,
      direction: type
    }
    this.sort.sortChange.emit(sortState);
    this.dataSource.sort = this.sort;
  }

  editJob(data) {
    this._matDialog.open(NewComponent, {
      panelClass: 'custom-dialog-container5',
      disableClose: true,
      autoFocus: false,
      width: '550px',
      data: {
        data: data,
        key: data.key
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        // this.snackBar.open('The job was edited successfully!', 'OK',
        //   { duration: 2000 });
      }
    })
  }

  deleteJob(data): void {
    if (data.key) {
      this.authservice.delete(data.key)
        .then(() => {
          this.snackBar.open('The job was deleted successfully!', 'OK',
            { duration: 2000 });
        })
        .catch(err => {
          this.snackBar.open('The job was deleted unsuccessfully!', 'OK',
            { duration: 2000 });
        });
    }
  }
}

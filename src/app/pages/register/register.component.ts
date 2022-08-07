import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email = "";
  password = "";
  // message = '';
  errorMessage = ''; // validation error handle
  error: { name: string, message: string } = { name: '', message: '' }; // for firbase error handle

  // new
  public loading = false;
  public submitted = false;
  public registrationError = false;
  public registrationSuccess = false;
  public message;
  public registrationForm: FormGroup;
  cities: any;
  appearRow: boolean;

  constructor(
    private authservice: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,

  ) {
    this.appearRow = false;
  }

  ngOnInit(): void {
    this.registrationForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userEmail: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        sex: ['', Validators.required],
        birthDay: ['', Validators.required],
        type: ['', Validators.required],
        jobPosition: ['', ''],
        yearExp: ['', ''],
        description: ['', '']
      }
    )
  }

  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  register2() {
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      this.authservice.registerWithEmail(this.email, this.password)
        .then(() => {
          this.message = "you are register with data on firbase"
          //this.router.navigate(['/userinfo'])
        }).catch(_error => {
          this.error = _error
          this.router.navigate(['/register'])
        })
    }
  }

  validateForm(email, password) {
    if (email.lenght === 0) {
      this.errorMessage = "please enter email id";
      return false;
    }

    if (password.lenght === 0) {
      this.errorMessage = "please enter password";
      return false;
    }

    if (password.lenght < 6) {
      this.errorMessage = "password should be at least 6 char";
      return false;
    }

    this.errorMessage = '';
    return true;

  }

  onSelected(value) {
    if (value === 'jobseeker') this.appearRow = true;
    else {
      this.registrationForm.get('jobPosition').setValue('');
      this.registrationForm.get('yearExp').setValue('');
      this.registrationForm.get('description').setValue('');
      this.appearRow = false;
    }
  }

  register() {
    this.submitted = true;
    this.registrationError = false;
    this.registrationSuccess = false;
    if (this.registrationForm.invalid) {
      return;
    }
    this.loading = true;
    localStorage.setItem('user', JSON.stringify(this.registrationForm.value))
    this.email = this.registrationForm.get('userEmail').value;
    this.password = this.registrationForm.get('password').value;
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      this.authservice.registerWithEmail(this.email, this.password)
        .then(() => {
          this.message = "you are register with data on firbase"
          this.snackBar.open('Successfully registered. Use your new credentials to sign in.', 'OK',
            { duration: 2000 });
          this.router.navigate(['/login'])
        }).catch(_error => {
          this.error = _error
          this.snackBar.open('Error. You are not registered.', 'OK',
            { duration: 2000 });
          this.router.navigate(['/register'])
        })
    }
  }

}
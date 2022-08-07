import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = "";
  password = "";
  errorMessage = ''; // validation error handle
  error: { name: string, message: string } = { name: '', message: '' }; // for firbase error handle

  // new
  public overlayDisplay = false;
  public loginError = false;

  public loginForm: FormGroup;

  constructor(
    private authservice: AuthService,
    private router: Router) {
    this.loginForm = new FormBuilder().group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  clearErrorMessage() {
    this.errorMessage = '';
    this.error = { name: '', message: '' };
  }

  login() {
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      this.authservice.loginWithEmail(this.email, this.password)
        .then(() => {
          this.router.navigate(['/userinfo'])
        }).catch(_error => {
          this.error = _error
          this.router.navigate(['/login'])
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

  onSubmit(): void {

    // if form is not valid do nothing
    if (this.loginForm.invalid) {
      return;
    }

    // set loading
    this.overlayDisplay = true;
    this.loginError = false;

    this.authservice.loginWithEmail(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
      .then(
        (data) => {
          // console.log(this.authservice.authState.user.uid, ' te dhene ')
          this.overlayDisplay = false;
          this.router.navigate(['/userinfo'])
        },
        (error) => {
          this.overlayDisplay = false;
          this.loginError = true;
          this.router.navigate(['/login'])
        }
      )
  }

}

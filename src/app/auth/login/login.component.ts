import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    //private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get getAllformControls() {
    return this.loginForm.controls;
  }

  checkLoginCredentials(): void {
    this.isSubmitted = true;

    if (this.loginForm?.invalid) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    if (this.loginForm?.valid) {
      this.errorMessage = '';
      console.log(this.loginForm.value);

      this.authService.loginVerify(this.loginForm.value).subscribe(
        (response) => {
          console.log(response);
          if (response == null) {
            this.errorMessage = "Invalid user name and password";
          }

          localStorage.setItem("USER_NAME", response.uName);
          localStorage.setItem("ACCESS_ROLE", response.roleId.toString());
          localStorage.setItem("JWT_TOKEN", response.token);

          if (response.roleId == 1) {
            console.log("Admin Login");
            this.router.navigate(['auth/admin']);
          } else if (response.roleId == 2) {
            console.log("Manager Login");
            this.router.navigate(['auth/manager']);
          } else if (response.roleId == 5) {
            console.log("Doctor Login");
            this.router.navigate(['auth/doctor']);
          } else if (response.roleId == 3) {
            console.log("Pharmacist Login");
            this.router.navigate(['auth/pharmacist']);
          } else if (response.roleId == 4) {
            console.log("Lab Technician Login");
            this.router.navigate(['auth/lab']);
          } else {
            this.errorMessage = "Sorry! Invalid credentials Not allowed";
          }
        },
        (error) => {
          console.log(error);
          this.errorMessage = "Sorry! Invalid Credentials";
        }
      );
    }
  }
}

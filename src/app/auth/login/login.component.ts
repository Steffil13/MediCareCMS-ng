import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //Declare variables
  loginForm!: FormGroup; //'!'assertion property expects all class properties to be initialized
  isSubmitted: boolean = false;
  errorMessage: string ='';

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    //Create Reactive Form
    this.loginForm = this.formBuilder.group(
      {
        userName: ['',[Validators.required]],
        password: ['',[Validators.required]]
      }
    );
  }
  //get all controls of loginform for validation
  get getAllformControls(){
    return this.loginForm.controls;
  }

  //Login functionality

  //Based on roleid redirect to the respective dashboard

  checkLoginCredentials(): void{
    // setting IsSubmitted
    this.isSubmitted =true;

    //check form is invalid
    if(this.loginForm?.invalid){
      this.errorMessage = 'Please enter username and password';
      return;
    }
    //check form is valid the proceed
    if(this.loginForm?.valid){
      this.errorMessage = '';
      console.log(this.loginForm.value);

      //call rest api to check username and password
      this.authService.loginVerify(this.loginForm.value).subscribe(
        (response) => {
          console.log(response);
          //based on role redirect
          if(response == null){
            this.errorMessage = "Invalid user name and password";
          }
          //redirect to role based 
          if(response.roleId == 1){
            console.log("Admin Login");

            //Local Stoorage
          localStorage.setItem("USER_NAME",response.uName);
          localStorage.setItem("ACCESS_ROLE", response.roleId.toString());
          localStorage.setItem("JWT_TOKEN",response.token);
            this.router.navigate(['auth/admin']);
          }
          else if (response.roleId == 2){
            console.log("Manager Login");

            //Local Storage
          localStorage.setItem("USER_NAME",response.uName);
          localStorage.setItem("ACCESS_ROLE", response.roleId.toString());
          localStorage.setItem("JWT_TOKEN",response.token);
            this.router.navigate(['auth/manager']);
            
          }
          else{
            this.errorMessage = "Sorry! Invalid credentials Not allowed"
          }
          
        },
        (error) =>{
          console.log(error);
          this.errorMessage = "Sorry! Invalid Credentials";
          
        }

      );
      
    }

  }
}

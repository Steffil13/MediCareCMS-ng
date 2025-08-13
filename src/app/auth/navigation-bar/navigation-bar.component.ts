import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  loginName?: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loginName = localStorage.getItem("USER_NAME")?.toString();
  }
  //Call LogOut
  logout(): void {
    this.authService.logoutWithClearKeyValues();
    
  }
}



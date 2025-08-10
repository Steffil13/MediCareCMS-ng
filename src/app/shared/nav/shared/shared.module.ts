import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from 'src/app/auth/navigation-bar/navigation-bar.component';



@NgModule({
  declarations: [
    NavigationBarComponent 
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavigationBarComponent  // Export your component(s) so other modules can use them
  ]
})
export class SharedModule { }

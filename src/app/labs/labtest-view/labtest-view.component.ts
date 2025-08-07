import { Component, OnInit } from '@angular/core';
import { Labtest } from '../../shared/model/AssignedLabTest';
import { LabtestService } from 'src/app/shared/Service/AssignedLabTest.service';


@Component({
  selector: 'app-labtest-view',
  templateUrl: './labtest-view.component.html',
  styleUrls: ['./labtest-view.component.scss']
})
export class LabtestViewComponent implements OnInit {
  labTests: Labtest[] = [];

  constructor(private labtestService: LabtestService) { }

  ngOnInit(): void {
    this.labtestService.getAllPrescribedLabTests().subscribe({
      next: (data) => {
        console.log('Lab tests:', data);
        this.labTests = data;
      },
      error: (err) => {
        console.error('Error fetching lab tests:', err);
      }
    });
  }
}

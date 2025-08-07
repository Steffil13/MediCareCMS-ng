import { Component, OnInit } from '@angular/core';
import { Labtest } from '../../shared/model/labtech/AssignedLabTest';
import { LabTechnicianService } from '../../shared/service/LabTechnician.service';

@Component({
  selector: 'app-labtest-view',
  templateUrl: './labtest-view.component.html',
  styleUrls: ['./labtest-view.component.scss']
})
export class LabtestViewComponent implements OnInit {
  labTests: Labtest[] = [];

  constructor(private labtestService: LabTechnicianService) { }

  ngOnInit(): void {
    this.labtestService.getAllPrescribedLabTests().subscribe({
      next: (data: Labtest[]) => {
        console.log('Lab tests:', data);
        this.labTests = data;
      },
      error: (err: any) => {
        console.error('Error fetching lab tests:', err);
      }
    });
  }
}

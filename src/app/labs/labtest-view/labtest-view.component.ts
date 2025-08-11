import { Component, OnInit } from '@angular/core';
import { Labtest } from '../../shared/model/labtech/AssignedLabTest';
import { Router } from '@angular/router';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';

@Component({
  selector: 'app-labtest-view',
  templateUrl: './labtest-view.component.html',
  styleUrls: ['./labtest-view.component.scss']
})
export class LabtestViewComponent implements OnInit {
  labTests: Labtest[] = [];
  page : number=1;
  pageSize : number = 4;
  

  constructor(private labtestService: LabTechnicianService, private router: Router) { }

  ngOnInit(): void {
  this.labtestService.getAllPrescribedLabTests().subscribe({
    next: (data: Labtest[]) => {
      console.log('Lab tests:', data);
      this.labTests = data.filter(test => !test.isCompleted); 
    },
    error: (err: any) => {
      console.error('Error fetching lab tests:', err);
    }
    });
  }
  assignLabTest(labTest: any) {
    console.log('Assigning lab test:', labTest  );
    console.log('Lab test ID:', labTest.plabTestId  );
    
    
    this.router.navigate(['/update-test-result', labTest.plabTestId]);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // <-- import Router
import { PharmacistService } from 'src/app/shared/service/pharmacist.service';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit {
  searchPatientId: string = '';
  allHistories: any[] = [];
  filteredHistories: any[] = [];
  paginatedHistories: any[] = [];
  loading = false;
  error = '';

  // Pagination properties
  currentPage = 1;
  pageSize = 10;  // number of records per page
  totalPages = 0;
  pages: number[] = [];

  constructor(
    private pharmacistService: PharmacistService,
    private router: Router  // <-- inject Router
  ) {}

  ngOnInit() {
    this.loadAllHistories();
  }

  loadAllHistories() {
    this.loading = true;
    this.pharmacistService.getAllPatientHistories().subscribe({
      next: (data) => {
        console.log('Patient histories:', data);
        this.allHistories = data;
        this.filteredHistories = data;
        this.currentPage = 1;
        this.calculatePagination();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load patient histories.';
        this.loading = false;
      }
    });
  }

  searchHistory() {
    const id = Number(this.searchPatientId);
    if (!id || isNaN(id) || id <= 0) {
      this.filteredHistories = this.allHistories;
      this.error = '';
      this.currentPage = 1;
      this.calculatePagination();
      return;
    }

    this.filteredHistories = this.allHistories.filter(h => h.patientId === id);

    if (this.filteredHistories.length === 0) {
      this.error = 'No history found for this patient.';
    } else {
      this.error = '';
    }

    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredHistories.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedHistories();
  }

  updatePaginatedHistories() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedHistories = this.filteredHistories.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedHistories();
  }

  goBack() {
    this.router.navigate(['/pharmacistdashboard']);  // Adjust this path if your dashboard route is different
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/shared/model/admin/department';
import { User } from 'src/app/shared/model/admin/user.model';
import { AdminService } from 'src/app/shared/Service/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {

  role: string = '';
  users: User[] = [];
  departments: Department[] = [];

  showDepartments: boolean = false;
  showAddDepartmentForm: boolean = false;

  newDepartment: Department = {
    departmentId: 0,       // Backend will assign real IDs
    departmentName: '',
    doctorFee: 0
  };

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    // React to role changes from route parameters
    this.route.params.subscribe(params => {
      const roleParam = params['role'] || '';
      if (roleParam !== this.role) {
        this.role = roleParam;
        this.showDepartments = false;
        this.showAddDepartmentForm = false;
        this.loadUsers();

        if (this.role === 'Doctor') {
          this.loadDepartments();
        } else {
          this.departments = [];
        }
      }
    });
  }

  /**
   * Load users filtered by the current role.
   */
  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: data => {
        console.log("data:", data);
        
        this.users = this.role ? data.filter(user => user.roleName === this.role) : data;
        console.log("users:", this.users);
        
      },
      error: err => {
        console.error('Error loading users:', err);
        alert('Failed to load users.');
      }
    });
  }

  /**
   * Load departments (only for Doctor role).
   */
  loadDepartments(): void {
    this.adminService.getDepartments().subscribe({
      next: data => {
        this.departments = data;
      },
      error: err => {
        console.error('Error loading departments:', err);
        alert('Failed to load departments.');
      }
    });
  }

  /**
   * Toggle department list visibility.
   */
  toggleDepartments(): void {
    this.showDepartments = !this.showDepartments;
    if (!this.showDepartments) {
      this.showAddDepartmentForm = false;
    }
  }

  /**
   * Show the add department form.
   */
  addDepartmentForm(): void {
    this.showAddDepartmentForm = true;
    this.newDepartment = {
      departmentId: 0,
      departmentName: '',
      doctorFee: 0
    };
  }

  /**
   * Save the new department after validation.
   */
  saveDepartment(): void {
    if (!this.newDepartment.departmentName.trim()) {
      alert('Please enter a valid department name.');
      return;
    }
    if (this.newDepartment.doctorFee <= 0) {
      alert('Please enter a valid doctor fee greater than zero.');
      return;
    }

    this.adminService.addDepartment(this.newDepartment).subscribe({
      next: createdDepartment => {
        this.departments.push(createdDepartment);
        this.showAddDepartmentForm = false;
      },
      error: err => {
        console.error('Error adding department:', err);
        alert('Failed to add department. Please try again.');
      }
    });
  }

  /**
   * Cancel adding department.
   */
  cancelAddDepartment(): void {
    this.showAddDepartmentForm = false;
  }

  /**
   * Delete a department after confirmation.
   */
  deleteDepartment(id: number): void {
    if (!confirm('Are you sure you want to delete this department?')) {
      return;
    }
    this.adminService.deleteDepartment(id).subscribe({
      next: () => {
        this.departments = this.departments.filter(dept => dept.departmentId !== id);
      },
      error: err => {
        console.error('Error deleting department:', err);
        alert('Failed to delete department. Please try again.');
      }
    });
  }

  /**
   * Handle add staff for roles other than Doctor.
   * This can be navigation or modal opening.
   */
  addStaff(role: string): void {
    // Example: Navigate to a dedicated add page
    this.router.navigate(['/admin/add', role]);
  }

  /**
   * Handle add doctor button click.
   */
  addDoctor(): void {
    // Example: Navigate to add doctor page
    this.router.navigate(['/admin/add', 'Doctor']);
  }

  /**
   * Deactivate a user and reload the user list.
   */
  deactivateUser(id: number): void {
    this.adminService.deactivateStaff(id).subscribe({
      next: () => this.loadUsers(),
      error: err => {
        console.error('Error deactivating user:', err);
        alert('Failed to deactivate user. Please try again.');
      }
    });
  }
  getDepartmentNameById(departmentId: number | null | undefined): string | null {
  if (!departmentId) {
    return null;
  }
  const dept = this.departments.find(d => d.departmentId === departmentId);
  return dept ? dept.departmentName : null;
}


  goBack(): void {
    // Use Location service to go back in browser history
    this.location.back();

    // Or alternatively, navigate explicitly to dashboard route
    // this.router.navigate(['/admin/dashboard']);
  }
  // To track per-user password visibility status
passwordVisibility: { [userId: number]: boolean } = {};

/**
 * Toggle the password visibility for a specific user
 */
togglePasswordVisibility(userId: number): void {
  this.passwordVisibility[userId] = !this.passwordVisibility[userId];
}
}

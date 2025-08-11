import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/shared/model/admin/department';
import { User } from 'src/app/shared/model/admin/user.model';
import { AdminService } from 'src/app/shared/service/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {

  role: string = '';
  users: User[] = [];
  filteredUsers: User[] = [];   // ✅ filtered list for search
  searchTerm: string = '';      // ✅ search input binding
  departments: Department[] = [];

  showDepartments: boolean = false;
  showAddDepartmentForm: boolean = false;

  newDepartment: Department = {
    departmentId: 0,  // Backend will assign real IDs
    departmentName: '',
    doctorFee: 0
  };

  // Track per-user password visibility status
  passwordVisibility: { [userId: number]: boolean } = {};

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
   * Initialize filteredUsers for search feature.
   */
  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: data => {
        console.log("data:", data);
        const list = this.role ? data.filter(user => user.roleName === this.role) : data;
        this.users = list;
        this.filteredUsers = list; // ✅ initialize search list
        console.log("users:", this.users);
      },
      error: err => {
        console.error('Error loading users:', err);
        alert('Failed to load users.');
      }
    });
  }

  /**
   * Search filter function
   */
  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      (u.firstName && u.firstName.toLowerCase().includes(term)) ||
      (u.lastName && u.lastName.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.roleName && u.roleName.toLowerCase().includes(term))
    );
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

  toggleDepartments(): void {
    this.showDepartments = !this.showDepartments;
    if (!this.showDepartments) {
      this.showAddDepartmentForm = false;
    }
  }

  addDepartmentForm(): void {
    this.showAddDepartmentForm = true;
    this.newDepartment = {
      departmentId: 0,
      departmentName: '',
      doctorFee: 0
    };
  }

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

  cancelAddDepartment(): void {
    this.showAddDepartmentForm = false;
  }

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

  addStaff(role: string): void {
    this.router.navigate(['/admin/add', role]);
  }

  addDoctor(): void {
    this.router.navigate(['/admin/add', 'Doctor']);
  }

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
    this.location.back();
  }

  togglePasswordVisibility(userId: number): void {
    this.passwordVisibility[userId] = !this.passwordVisibility[userId];
  }

  editStaff(userId: number) {
    this.router.navigate(['/admin/edit', this.role, userId]);
  }

  softDeleteStaff(userId: number) {
    if (confirm('Are you sure you want to deactivate this staff?')) {
      this.adminService.deactivateStaff(userId).subscribe({
        next: () => {
          alert('Staff deactivated successfully.');
          this.loadUsers();
        },
        error: err => {
          console.error('Failed to deactivate staff', err);
          alert('Failed to deactivate staff. Please try again.');
        }
      });
    }
  }
}

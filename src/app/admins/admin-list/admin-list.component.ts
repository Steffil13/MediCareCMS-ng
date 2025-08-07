import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Department } from 'src/app/shared/model/admin/department';
import { User } from 'src/app/shared/model/admin/user.model';
import { AdminService } from 'src/app/shared/Service/admin.service';

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
    departmentId: 0,
    departmentName: '',
    doctorFee: 0
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // Optional: initialize with a default role or empty state
    // For example, selectRole('Receptionist');
  }

  // Called when user clicks on any role button
  selectRole(selectedRole: string) {
    this.role = selectedRole;
    this.showDepartments = false;
    this.showAddDepartmentForm = false;
    this.loadUsers();

    if (this.role === 'Doctor') {
      this.loadDepartments();
    } else {
      this.departments = [];
    }
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe(data => {
      this.users = this.role ? data.filter(user => user.roleName === this.role) : data;
    });
  }

  loadDepartments() {
    this.adminService.getDepartments().subscribe(data => {
      this.departments = data;
    });
  }

  toggleDepartments() {
    this.showDepartments = !this.showDepartments;
    if (!this.showDepartments) {
      this.showAddDepartmentForm = false;
    }
  }

  addDepartmentForm() {
    this.showAddDepartmentForm = true;
    this.newDepartment = { departmentId: 0, departmentName: '', doctorFee: 0 };
  }

  saveDepartment() {
    if (!this.newDepartment.departmentName.trim() || this.newDepartment.doctorFee <= 0) {
      alert('Please enter valid department name and fee.');
      return;
    }

    this.adminService.addDepartment(this.newDepartment).subscribe(
      data => {
        this.departments.push(data);
        this.showAddDepartmentForm = false;
      },
      error => {
        console.error('Error adding department', error);
      }
    );
  }

  cancelAddDepartment() {
    this.showAddDepartmentForm = false;
  }

  deleteDepartment(id: number) {
    if (!confirm('Are you sure to delete this department?')) return;
    this.adminService.deleteDepartment(id).subscribe(() => {
      this.departments = this.departments.filter(dept => dept.departmentId !== id);
    });
  }

  addDoctor() {
    // Implement your add doctor logic (navigate or open modal)
    alert('Add Doctor clicked - implement functionality');
  }

  deactivateUser(id: number) {
    this.adminService.deactivateStaff(id).subscribe(() => {
      this.loadUsers();
    });
  }
}

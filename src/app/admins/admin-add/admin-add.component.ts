import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/shared/Service/admin.service';
import { Department } from 'src/app/shared/model/admin/department';

@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  styleUrls: ['./admin-add.component.scss']
})
export class AdminAddComponent implements OnInit {
  role: string = '';
  userForm: FormGroup;
  submitting: boolean = false;
  departments: Department[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.userForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.role = params['role'];
      this.buildFormForRole(this.role);

      if (this.role === 'Doctor') {
        this.loadDepartments();
      }
    });
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null; // Optional field, no validation if empty
    }
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return { invalidPhone: true };
    }
    return null;
  }

  buildFormForRole(role: string): void {
    const baseControls = {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, this.phoneValidator]],
      isActive: [true],
      gender: ['', Validators.required]
    };

    if (role === 'Doctor') {
      this.userForm = this.fb.group({
        ...baseControls,
        departmentId: [null, Validators.required],
        doctorFee: [null, [Validators.required, Validators.min(0)]]
      });

      // After form is built, subscribe to departmentId changes to update doctorFee
      this.userForm.get('departmentId')?.valueChanges.subscribe(deptId => {
        if (!this.departments.length) return;
        const selectedDept = this.departments.find(d => d.departmentId === +deptId);
        if (selectedDept) {
          this.userForm.patchValue({ doctorFee: selectedDept.doctorFee }, { emitEvent: false });
        } else {
          this.userForm.patchValue({ doctorFee: null }, { emitEvent: false });
        }
      });

    } else {
      this.userForm = this.fb.group(baseControls);
    }
  }

  loadDepartments(): void {
    this.adminService.getDepartments().subscribe({
      next: data => {
        this.departments = data;
        // Trigger manual update if department already selected
        const deptId = this.userForm.get('departmentId')?.value;
        if (deptId) {
          const selectedDept = this.departments.find(d => d.departmentId === +deptId);
          if (selectedDept) {
            this.userForm.patchValue({ doctorFee: selectedDept.doctorFee }, { emitEvent: false });
          }
        }
      },
      error: err => {
        console.error('Failed to load departments', err);
        alert('Failed to load departments');
      }
    });
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    // Backend generates username and password
    const userInput = {
      ...this.userForm.value,
      username: null,
      password: null,
      roleName: this.role
    };

    this.adminService.createStaff(userInput).subscribe({
      next: createdUser => {
        this.submitting = false;
        alert(
          `User added successfully!\nUsername: ${createdUser.username}\nPassword: ${
            createdUser.password ? createdUser.password : 'Sent to user email'
          }`
        );
        this.router.navigate(['/admin/list', this.role]);
      },
      error: err => {
        this.submitting = false;
        console.error('Error adding user:', err);
        alert('Failed to add user. Please try again.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/list', this.role]);
  }
}

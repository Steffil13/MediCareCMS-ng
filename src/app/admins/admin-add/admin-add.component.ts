import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators,
  AbstractControl, ValidationErrors
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/shared/Service/admin.service';
import { Department } from 'src/app/shared/model/admin/department';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  styleUrls: ['./admin-add.component.scss']
})
export class AdminAddComponent implements OnInit {
  role: string = '';
  userForm!: FormGroup;
  submitting: boolean = false;
  departments: Department[] = [];
  roles: { roleId: number; roleName: string }[] = [];
  selectedRoleId: number | null = null;
  existingContacts: string[] = []; // store existing numbers for local duplicate check

  // Blood group dropdown list
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private location: Location

  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.role = params['role'];
      this.buildFormForRole(this.role);

      // Load existing contacts once
      this.adminService.getAllStaff().subscribe({
        next: staffList => {
          this.existingContacts = staffList.map(s => (s.contact || '').trim());
          console.log('Existing contacts loaded:', this.existingContacts);
        },
        error: err => {
          console.error('Failed to load staff list', err);
        }
      });

      // Fetch roles & match
      this.adminService.getRoles().subscribe({
        next: data => {
          this.roles = data;
          const matchedRole = this.roles.find(
            r => r.roleName.toLowerCase() === this.role.toLowerCase()
          );
          this.selectedRoleId = matchedRole ? matchedRole.roleId : null;

          if (!this.selectedRoleId) {
            alert(`Role ID not found for '${this.role}'. Please check Roles table.`);
          }
        },
        error: err => {
          console.error('Failed to load roles', err);
          alert('Failed to load roles from server.');
        }
      });

      if (this.role === 'Doctor') {
        this.loadDepartments();
      }
    });
  }

  /** ======= LOCAL Duplicate Contact Validator (No API) ======= **/
  contactExistsLocalValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const entered = control.value.trim();
    const isDuplicate = this.existingContacts.includes(entered);
    return isDuplicate ? { contactExists: true } : null;
  };

  /** ======= Sync Validators ======= **/
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const digitsOnly = control.value.replace(/\D/g, '');
    return digitsOnly.length === 10 ? null : { invalidPhone: true };
  }

  addressValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return { required: true };
    const validPattern = /^[a-zA-Z0-9 ]+$/;
    if (control.value.length < 3) return { minlength: true };
    if (!validPattern.test(control.value)) return { invalidChars: true };
    return null;
  }

  dobValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return { required: true };
    const dob = new Date(control.value);
    const today = new Date();
    if (dob > today) return { futureDate: true };

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) return { tooYoung: true };
    if (age > 65) return { tooOld: true };
    return null;
  }

  /** ======= Build Form ======= **/
  buildFormForRole(role: string): void {
    const baseControls = {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: [
        '',
        [Validators.required, this.phoneValidator, this.contactExistsLocalValidator]
      ],
      addresss: ['', this.addressValidator], // match backend "Addresss"
      bloodGroup: ['', Validators.required],
      dob: ['', this.dobValidator], // match backend "Dob"
      isActive: [true],
      gender: ['', Validators.required]
    };

    if (role === 'Doctor') {
      this.userForm = this.fb.group({
        ...baseControls,
        departmentId: [null, Validators.required],
        doctorFee: [null, [Validators.required, Validators.min(0)]]
      });

      // Auto-fill doctorFee on department change
      this.userForm.get('departmentId')?.valueChanges.subscribe(deptId => {
        if (!this.departments.length) return;
        const selectedDept = this.departments.find(d => d.departmentId === +deptId);
        this.userForm.patchValue(
          { doctorFee: selectedDept ? selectedDept.doctorFee : null },
          { emitEvent: false }
        );
      });
    } else {
      this.userForm = this.fb.group(baseControls);
    }
  }

  /** ======= Load Departments ======= **/
  loadDepartments(): void {
    this.adminService.getDepartments().subscribe({
      next: data => {
        console.log('Departments loaded:', data);
        this.departments = data;
      },
      error: err => {
        console.error('Failed to load departments', err);
        alert('Failed to load departments from server.');
      }
    });
  }

  get f() {
    return this.userForm.controls;
  }

  /** ======= Submit ======= **/
  onSubmit(): void {
    const invalidControls = Object.keys(this.userForm.controls)
      .filter(c => this.userForm.get(c)?.invalid);
    console.log('Invalid Controls:', invalidControls);

    if (!this.selectedRoleId) {
      alert(`Invalid role: '${this.role}'. Please ensure it exists in Roles table.`);
      return;
    }

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }

    this.submitting = true;

    const userInput = {
      ...this.userForm.value,
      username: null,
      password: null,
      roleId: this.selectedRoleId,
      departmentId: this.userForm.value.departmentId
        ? Number(this.userForm.value.departmentId)
        : null
    };

    console.log('Submitting Payload:', userInput);

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
  goBack(): void {
    // Use Location service to go back in browser history
    this.location.back();

    // Or alternatively, navigate explicitly to dashboard route
    // this.router.navigate(['/admin/dashboard']);
  }
}

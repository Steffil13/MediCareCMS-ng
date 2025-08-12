import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/shared/service/admin.service';
import { Department } from 'src/app/shared/model/admin/department';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss']
})
export class AdminEditComponent implements OnInit {
  role = '';
  userId!: number;
  userForm!: FormGroup;
  submitting = false;
  departments: Department[] = [];
  roles: { roleId: number; roleName: string }[] = [];
  selectedRoleId: number | null = null;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private location: Location,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.role = params['role'];
      this.userId = +params['id'];

      this.buildFormForRole(this.role);

      // Load roles
      this.adminService.getRoles().subscribe({
        next: list => {
          this.roles = list;
          const match = list.find(r => r.roleName.toLowerCase() === this.role.toLowerCase());
          this.selectedRoleId = match ? match.roleId : null;
          if (!this.selectedRoleId) {
            this.toastr.error(`Role ID not found for '${this.role}'. Please check roles list.`, 'Error');
          }
        },
        error: err => {
          console.error(err);
          this.toastr.error('Failed to load roles from server.', 'Error');
        }
      });

      if (this.role === 'Doctor') {
        this.loadDepartments();
      }

      // Load user details
      if (this.userId) {
        this.adminService.getUserById(this.userId).subscribe({
          next: user => {
            this.userForm.patchValue(user);
          },
          error: err => {
            console.error(err);
            this.toastr.error('Failed to load user details.', 'Error');
          }
        });
      }
    });
  }

  /** ===== Validators ===== **/
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
    if (dob > new Date()) return { futureDate: true };
    let age = new Date().getFullYear() - dob.getFullYear();
    const m = new Date().getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < dob.getDate())) age--;
    if (age < 18) return { tooYoung: true };
    if (age > 65) return { tooOld: true };
    return null;
  }

  /** ===== Build Form ===== **/
  buildFormForRole(role: string) {
    const base = {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, this.phoneValidator]],
      addresss: ['', this.addressValidator],
      bloodGroup: ['', Validators.required],
      dob: ['', this.dobValidator],
      isActive: [true],
      gender: ['', Validators.required]
    };

    if (role === 'Doctor') {
      this.userForm = this.fb.group({
        ...base,
        departmentId: [null, Validators.required],
        doctorFee: [null]
      });

      this.userForm.get('departmentId')?.valueChanges.subscribe(deptId => {
        const dept = this.departments.find(d => d.departmentId === +deptId);
        this.userForm.patchValue({ doctorFee: dept ? dept.doctorFee : null }, { emitEvent: false });
      });
    } else {
      this.userForm = this.fb.group(base);
    }
  }

  loadDepartments() {
    this.adminService.getDepartments().subscribe({
      next: depts => (this.departments = depts),
      error: err => {
        console.error(err);
        this.toastr.error('Failed to load departments.', 'Error');
      }
    });
  }

  get f() {
    return this.userForm.controls;
  }

  /** ===== Submit ===== **/
  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields correctly.', 'Warning');
      return;
    }

    const payload = {
      ...this.userForm.value,
      roleId: this.selectedRoleId,
      departmentId: this.role === 'Doctor' ? Number(this.userForm.value.departmentId) : null
    };

    this.submitting = true;
    this.adminService.updateStaff(this.userId, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.toastr.success('User updated successfully.', 'Success');
        this.router.navigate(['/admin/list', this.role]);
      },
      error: err => {
        this.submitting = false;
        console.error(err);
        this.toastr.error('Failed to update user.', 'Error');
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/list', this.role]);
  }

  goBack(): void {
    this.location.back();
  }
}

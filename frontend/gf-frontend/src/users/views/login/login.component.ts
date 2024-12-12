import { Component } from '@angular/core';
import { ButtonComponent } from '../../../app/common/components/button/button.component';
import {
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputGroupComponent } from '../../../app/common/components/input-group/input-group.component';
import { NavBarComponent } from '../../../app/common/components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    ButtonComponent,
    FormsModule,
    InputGroupComponent,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe(
      (response) => {
        if (response.status === 200) {
          console.log('Login successful. Redirecting to admin panel.');
          this.onSignIn();
        }
      },
      (error) => {
        if (error.status === 401) {
          this.loginMessage = 'Invalid email or password.';
        } else {
          this.loginMessage = 'Login failed. Please try again.';
        }
      },
    );
  }

  onSignIn(): void {
    this.router.navigateByUrl('/admin');
  }
}

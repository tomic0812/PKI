import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Utils } from '../utils';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  protected form: FormGroup

  protected prikaziPassword: boolean

  constructor(private formBuilder: FormBuilder, protected router: Router, protected utils: Utils) {

    this.prikaziPassword = false

    this.form = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]

    })

  }

  onSubmit() {

    if (!this.form.valid) {

      this.utils.showError('Niste uneli sve podatke!')

      return

    }

    try {

      UserService.login(this.form.value.email, this.form.value.password)

      const url = sessionStorage.getItem('ref') ?? '/'

      sessionStorage.removeItem('ref')
      this.router.navigateByUrl(url)

      if ((window as any).refreshUser) {

        (window as any).refreshUser()

      }

    } catch (e) {

      this.utils.showError('Neispravn email ili lozinka!')

    }

  }

  protected onOffPassword(){

    this.prikaziPassword = !this.prikaziPassword

  }

}

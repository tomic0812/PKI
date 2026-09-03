import { Component, HostListener, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TypeModel } from '../../models/type.model';
import { IgrackaService } from '../../services/igracka.service';
@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  protected form: FormGroup

  protected vrste = signal<TypeModel[]>([])
  protected selectedVrste: string[] = []

  protected prikaziPassword: boolean
  protected repeatPrikaziPassword: boolean

  constructor(private formBuilder: FormBuilder, protected router: Router){

    this.prikaziPassword = false
    this.repeatPrikaziPassword = false

    IgrackaService.getTyps()
      .then(rsp => {
          this.vrste.set(rsp.data)
      })

    this.form = this.formBuilder.group({

      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeat: ['', Validators.required],
      telefon: ['', Validators.required],
      adresa: ['', Validators.required],
      vrste: [this.selectedVrste, Validators.required]

    })

  }

  onSubmit(){

    if (!this.form.valid){

      return

    }

    if (this.form.value.password !== this.form.value.repeat){

      return

    }

    try{

      const formValue: any = this.form.value
      delete formValue.repeat

      UserService.signup(formValue)
      this.router.navigateByUrl('/login')

    } catch (e){

      return

    }

  }

  protected vrsteSelection(vrsta: string){

    const index = this.selectedVrste.indexOf(vrsta)

    if (index > -1){

      this.selectedVrste.splice(index, 1)

    }

    else{

      this.selectedVrste.push(vrsta)

    }

  }

  protected onOffPassword(){

    this.prikaziPassword = !this.prikaziPassword

  }

  protected repeatOnOffPassword(){

    this.repeatPrikaziPassword = !this.repeatPrikaziPassword

  }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from '../utils';
import { Cart } from '../cart/cart';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-pay',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './pay.html',
  styleUrl: './pay.css'
})
export class Pay {

  protected form: FormGroup

  constructor(protected router: Router, protected formBuilder: FormBuilder, protected utils: Utils) {

    const paymentMethod = sessionStorage.getItem(Cart.PAYMENTCARD_KEY)

    if (!paymentMethod) {

      this.router.navigateByUrl('/')

    }

    this.form = this.formBuilder.group({

      brojKartice: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      datumIsteka:['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]

    })

  }

  protected potvrdiPlacanje(){

    if (!this.form.valid){

      this.utils.showError('Popunite podatke ispravno!')

      return

    }

    const user = UserService.getActiveUser()

    if (user.korpa) {

      user.korpa.forEach(u => {

      u.status = 'pristiglo';

    })

    user.data = [...(user.data ?? []), ...user.korpa];

    UserService.updateUser(user)

    user.data.forEach(u => {

      UserService.updateReservationStatus(u.createdAt, 'pristiglo')

    })

    user.korpa = []

    UserService.updateUser(user)
    sessionStorage.removeItem(Cart.PAYMENTCARD_KEY)
    this.router.navigateByUrl('/istorija')

  }
}
  
  protected odustani(){

    this.utils.showConfirm('Da li ste sigurni da želite da odustanete?', () => {

      this.router.navigateByUrl('/cart')
      this.form.reset()

    }
    
    )

  }
  

}

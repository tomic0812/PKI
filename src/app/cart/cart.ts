import { Component, EventEmitter, signal } from '@angular/core';
import { RezervacijaModel } from '../../models/rezervacija.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../utils';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';
import { IgrackaModel } from '../../models/igracka.model';
import { IgrackaService } from '../../services/igracka.service';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

  protected igracke = signal<IgrackaModel[]>([])
  protected rezervacije = signal<RezervacijaModel[]>([])
  protected usloviKoriscenja = signal(false)

  public cartChange = new EventEmitter<void>()

  public static PAYMENTCARD_KEY = 'pki_pay_card'

  constructor(protected route: ActivatedRoute, protected router: Router, protected utils: Utils){

    this.route.params.subscribe((params: any) => {

      if (!localStorage.getItem(UserService.ACTIVE_KEY)){

        sessionStorage.setItem('ref', `/details/${params.permalink}/cart`)
        router.navigateByUrl('/login')
        return

      }

      this.utils.showLoading()
      
      const user = UserService.getActiveUser()
      const userKorpa = user.korpa ?? []

      this.rezervacije.set(userKorpa)

      const ids = userKorpa.map(r => r.toyId)

      if (ids.length === 0){
        
        Swal.close()
        
        setTimeout(() => {

          this.utils.showWarning('Korpa je prazna niste još ništa dodali u nju!', 'Nazad na početnu stranu', () => {

            router.navigateByUrl('/')

          })

        }, 100)

        return

      }

      IgrackaService.getToysByIds(ids)
        .then(rsp => {

          this.igracke.set(rsp.data)
          Swal.close()

        })

    })

  }

  protected getKolicina(toyId: number): number{

    const rezervacija = this.rezervacije().find(r => r.toyId === toyId)

    return rezervacija?.kolicina ?? 1

  }

  protected getUkupnaCena(): number{

    return this.rezervacije().reduce((suma, toy) => {

      const kolicina = this.getKolicina(toy.toyId)
      return suma + toy.cena * kolicina

    }, 0)

  }

  protected prihvatiUsloveKoriscenja(event: Event){

    this.usloviKoriscenja.set((event.target as HTMLInputElement).checked)
    
  }
  
  protected checkout(){

    if (!this.usloviKoriscenja()){

      this.utils.showError('Niste prihvatili uslove korišćenja!')
      return

    }

    const user = UserService.getActiveUser()
    const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement
    const paymentMethod = paymentMethodInput ? paymentMethodInput.value : null

    if (!paymentMethod){
      
      this.utils.showError("Morate da odaberete način plaćanja!")
      return

    }

    user.korpa = user.korpa ?? []

      if (paymentMethod === 'pouzece'){

        user.data = (user.data ?? []).concat(user.korpa)

        user.korpa.forEach(u => {
          
          UserService.updateReservationStatus(u.rezervacijaId, 'rezervisano')

        })

        user.korpa = []
        UserService.updateUser(user)
        this.router.navigateByUrl('/istorija')

      }

      if (paymentMethod === 'kartica'){

        sessionStorage.setItem(Cart.PAYMENTCARD_KEY, 'true')
        this.utils.showConfirm('Odabrali ste način plaćanja karticu. Bićete preusmereni na stranicu za plaćanje karticom.', () => {

          this.router.navigateByUrl('/pay')

        })

      }

  }

  protected azurirajKolicinu(toyId: number, novaKolicina: number){

    if (isNaN(novaKolicina) || novaKolicina < 1){

      this.utils.showError('Kolicina mora da bude barem 1!')
      return

    }

    try{

      const aktivanUser = UserService.getActiveUser()
      const rezervacija = aktivanUser.korpa.find(r => r.toyId === toyId)

      if (rezervacija){

        rezervacija.kolicina = novaKolicina
        UserService.updateUser(aktivanUser)
        this.rezervacije.set(aktivanUser.korpa)
        
      }

    } catch{



    }

  }

}


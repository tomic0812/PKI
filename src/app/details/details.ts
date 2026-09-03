import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../utils';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { Istorija } from '../istorija/istorija';
import { IgrackaModel } from '../../models/igracka.model';
import { IgrackaService } from '../../services/igracka.service';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {

  protected igracka = signal<IgrackaModel | null>(null)
  protected ocena = signal<number>(0)

  constructor(protected route: ActivatedRoute, protected router: Router, protected utils: Utils){

    this.route.params.subscribe((params: any) => {

      this.utils.showLoading()

      IgrackaService.getToyByPermalink(params['permalink'])
        .then(rsp => {
          this.igracka.set(rsp.data)
          this.ucitajOcenu()

          Swal.close()

        })

    })

  }

  protected ucitajOcenu(){

    const toy = this.igracka()

    if (!toy){

      return

    }
    
    try{

      const sveOcene: Record<string, number> = JSON.parse(localStorage.getItem(Istorija.OCENE_KEY) || '{}')
      const ocenaZaIgracku = sveOcene[toy.toyId]
      
      this.ocena.set(ocenaZaIgracku ?? 0)

    } catch{

      this.ocena.set(0)

    }

  }

  protected addToCart(){

    const toy = this.igracka()

    if (!toy){

      return

    }

    try{
      
      const aktivanUser = UserService.getActiveUser()

      if (!aktivanUser.korpa){

        aktivanUser.korpa = []

      }

      const rezervacija = aktivanUser.korpa.find(r => r.toyId === toy.toyId)

      if (rezervacija){

        rezervacija.kolicina++

        UserService.updateUser(aktivanUser)

      }
      
      else{

        UserService.createCart(toy.toyId, toy.name, toy.price)

        this.utils.showSuccess('Proizvod je dodat u korpu.')

      }

    } catch{

        this.utils.showWarning('Morate biti ulogovani da bi ste proizvod dodali u korpu.', 'U redu',() => {

        sessionStorage.setItem('ref', `/details/${toy.permalink}`)
        this.router.navigateByUrl('/login')
        
      })

    }

  }

}

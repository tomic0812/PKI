import { Component, signal } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { Router, RouterLink } from '@angular/router';
import { Utils } from '../utils';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { RezervacijaModel } from '../../models/rezervacija.model';
import { IgrackaModel } from '../../models/igracka.model';
import { IgrackaService } from '../../services/igracka.service';

@Component({
  selector: 'app-istorija',
  imports: [RouterLink],
  templateUrl: './istorija.html',
  styleUrl: './istorija.css'
})
export class Istorija {

  static OCENE_KEY = 'pki_ocene'

  protected user = signal<UserModel | null>(null)
  protected sve_igracke = signal<IgrackaModel[]>([])
  protected rezervacije = signal<RezervacijaModel[]>([])
  protected ocene = signal<Map<number, number>>(new Map())
  protected ocenaLista = [1, 2, 3, 4, 5]

  constructor(private router: Router, public utils: Utils){
    
    try{

      this.utils.showLoading()

      const aktivakUser = UserService.getActiveUser()

      this.user.set(aktivakUser)
      this.rezervacije.set(aktivakUser.data ?? [])

      if (this.rezervacije().length == 0){

        Swal.close()
        
        this.utils.showWarning('Još uvek niste obavili nijednu kupovinu.', 'Nazad na početnu stranu', () => {

          router.navigateByUrl('/')

          return

        })

      }

      else{

        this.ucitajOcene()

        IgrackaService.getToysByIds(this.user()!.data.map(u => u.toyId))
          .then(rsp => {

            this.sve_igracke.set(rsp.data)

          })

        Swal.close()

      }
      

    } catch{

      Swal.close()
      sessionStorage.setItem('ref', this.router.url)
      this.router.navigate(['/login'])

    }

  }

  protected getIgracka(igracka: RezervacijaModel){

    return this.sve_igracke().find(i => i.toyId === igracka.toyId)

  }

  protected pay(r: RezervacijaModel){

    UserService.updateReservationStatus(r.createdAt, 'pristiglo') 
    this.user.set(UserService.getActiveUser())

  }

  protected cancel(r: RezervacijaModel){

    this.utils.showConfirm('Da li ste sigurni da želite da otkažete rezervaciju?', () => {

      UserService.updateReservationStatus(r.createdAt, 'otkazano')
      this.user.set(UserService.getActiveUser())

    })

  }

  protected getOcena(toyId: number): number{

    return this.ocene().get(toyId) ?? 0

  }

  protected ucitajOcene(){

    let sve_ocene: Record<string, number> = {}

    try{

      sve_ocene = JSON.parse(localStorage.getItem(Istorija.OCENE_KEY) || '{}')

    }catch{

      sve_ocene = {}

    }

    const mapa = new Map<number, number>()

    for (const index in sve_ocene){

      mapa.set(+index, sve_ocene[index])

    }
    
    this.ocene.set(mapa)

  }

  protected oceni(toyId: number, ocena: number){

    UserService.updateUserRaiting(toyId, ocena)

    const mapa = new Map(this.ocene())
    
    mapa.set(toyId, ocena)
    
    this.ocene.set(mapa)

    const sve_ocene = JSON.parse(localStorage.getItem(Istorija.OCENE_KEY) || '{}')

    sve_ocene[toyId] = ocena

    localStorage.setItem(Istorija.OCENE_KEY, JSON.stringify(sve_ocene))

    this.utils.showSuccess(`Ocenili ste igračku sa ${ocena} <i class="fas fa-star" style="color: gold;"></i>.`)
    
    this.user.set(UserService.getActiveUser())

  }

}

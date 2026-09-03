import { Component, signal } from '@angular/core';
import { Utils } from '../utils';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Istorija } from '../istorija/istorija';
import { IgrackaModel } from '../../models/igracka.model';
import { IgrackaService } from '../../services/igracka.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  private static TYPE_KEY = 'pki_type'
  private static AGE_GROUP_KEY = 'pki_age_group_key'
  private static TARGET_KEY = 'pki_target'
  
  protected selectedType = this.loadValueFromLocalStorage(Home.TYPE_KEY)
  protected selectedAgeGroup = this.loadValueFromLocalStorage(Home.AGE_GROUP_KEY)
  protected selectedTarget = this.loadValueFromLocalStorage(Home.TARGET_KEY)

  protected sve_igracke = signal<IgrackaModel[]>([])
  protected igracke = signal<IgrackaModel[]>([])
  protected ocene = signal<Record<string, number>>({})

  constructor(protected utils: Utils){

    this.utils.showLoading()

    IgrackaService.getAllToys()
      .then(rsp => {
        this.sve_igracke.set(rsp.data)
        this.pretraga()
        this.ucitajOcene()
        Swal.close()

      })

  }
  
  protected getTypes(){

    const arr = this.sve_igracke().map(igracka => igracka.type.name)
    
    return [...new Set(arr)]

  }

  protected getUzrasti(){

    const arr = this.sve_igracke().map(igracka => igracka.ageGroup.name)
    
    return [...new Set(arr)]

  }
  
  protected getTargetGroups(){

    const arr = this.sve_igracke().map(igracka => igracka.targetGroup)
    
    return [...new Set(arr)]

  }

  protected pretraga(){

    localStorage.setItem(Home.TYPE_KEY, this.selectedType)
    localStorage.setItem(Home.AGE_GROUP_KEY, this.selectedAgeGroup)
    localStorage.setItem(Home.TARGET_KEY, this.selectedTarget)    

    this.igracke.set(this.sve_igracke()
      .filter(i => {

        if (this.selectedType != 'all'){

          return i.type.name == this.selectedType

        }

        return true

      })
      .filter(i => {

        if (this.selectedAgeGroup != 'all'){

          return i.ageGroup.name == this.selectedAgeGroup

        }

        return true

      })
      .filter(i => {

        if (this.selectedTarget != 'all'){

          return i.targetGroup == this.selectedTarget

        }

        return true

      })
    )

  }


  protected loadValueFromLocalStorage(key: string){

    if (!localStorage.getItem(key)){
      
      localStorage.setItem(key, 'all')

    }

    return localStorage.getItem(key)!

  }
  
  protected ucitajOcene(){

    try{

      const sveOcene = JSON.parse(localStorage.getItem(Istorija.OCENE_KEY) || '{}')

      this.ocene.set(sveOcene)

    } catch{

      this.ocene.set({})

    }

  }

}
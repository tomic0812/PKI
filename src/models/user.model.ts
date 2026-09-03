import { RezervacijaModel } from "./rezervacija.model"

export interface UserModel{
    
    ime: string
    prezime: string
    email: string
    password: string
    telefon: string
    adresa: string
    omiljeneVrsteIgracaka: string[]
    korpa: RezervacijaModel[]
    data: RezervacijaModel[]

}
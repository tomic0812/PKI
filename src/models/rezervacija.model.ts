export interface RezervacijaModel{
    
    rezervacijaId: string
    toyId: number
    userId: string
    kolicina: number
    cena: number
    createdAt: string
    updateAt: string | null
    status: 'rezervisano' | 'pristiglo' | 'otkazano'
    ocene:number[]

}
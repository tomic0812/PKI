import { AgeGroupModel } from "./age.group.model"
import { TypeModel } from "./type.model"

export interface IgrackaModel{

    toyId: number
    name: string
    permalink: string
    description: string
    targetGroup: 'svi' | 'decak' | 'devojcica'
    productionDate: string
    price: number
    imageUrl: string
    ageGroup: AgeGroupModel
    type: TypeModel
    ocena? : number
    
}
import { UserModel } from "../models/user.model";
import { v4 as uuidv4 } from 'uuid';


export class UserService {

    public static USERS_KEY = 'pki_users'
    public static ACTIVE_KEY = 'pki_active'

    static getUsers(): UserModel[] {

        if (!localStorage.getItem(UserService.USERS_KEY)) {

            localStorage.setItem(UserService.USERS_KEY, JSON.stringify([

                {
                    ime: 'Đorđe',
                    prezime: 'Tomić',
                    email: 'djordje.tomic@gmail.com',
                    password: 'Neka123!',
                    telefon: '123456789',
                    adresa: 'Neka Adresa 12/45',
                    omiljeneVrsteIgracaka: ['Slagalica', 'Društvena igra'],
                    data: []
                }


            ]))

        }

        return JSON.parse(localStorage.getItem(UserService.USERS_KEY)!)

    }

    static findUserByEmail(email: string) {

        const users: UserModel[] = this.getUsers()
        const user = users.find(u => u.email === email)

        if (!user) {

            throw new Error('USER_NOT_FOUND')

        }

        return user

    }

    static login(email: string, password: string) {

        const user = this.findUserByEmail(email)

        if (user.password !== password) {

            throw new Error('BAD_CREDENTIALS')

        }

        localStorage.setItem(UserService.ACTIVE_KEY, user.email)

    }

    static signup(user: UserModel) {

        const users: UserModel[] = this.getUsers()
        users.push(user)

        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))

    }

    static getActiveUser() {

        const active = localStorage.getItem(UserService.ACTIVE_KEY)

        if (!active) {

            throw new Error('NO_ACTIVE_USER')

        }

        return this.findUserByEmail(active)

    }

    static logout() {

        localStorage.removeItem(UserService.ACTIVE_KEY)

    }

    static updateUser(newUser: UserModel) {

        const aktivanUser = this.getActiveUser()

        const users = this.getUsers()

        users.forEach(u => {

            if (u.email === aktivanUser.email) {

                u.ime = newUser.ime
                u.prezime = newUser.prezime
                u.telefon = newUser.telefon
                u.adresa = newUser.adresa
                u.omiljeneVrsteIgracaka = newUser.omiljeneVrsteIgracaka
                u.korpa = newUser.korpa
                u.data = newUser.data

            }

        })

        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))

    }

    static updateUserRaiting(toyId: number, ocena: number) {

        const aktivanUser = this.getActiveUser()

        const users = this.getUsers()

        users.forEach(u => {

            if (u.email === aktivanUser.email) {

               u.data.forEach(r => {

                    if (r.toyId == toyId){

                        r.ocene.push(ocena)
                        r.updateAt = new Date().toISOString()

                    }

               })

            }

        })

        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))

    }

    static updateUserPassword(newUserPassword: string) {

        const aktivanUser = this.getActiveUser()

        const users = this.getUsers()

        users.forEach(u => {

            if (u.email === aktivanUser.email) {

                u.password = newUserPassword

            }

        })

        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))

    }

    static createReservation(id: number, name: string, price: number) {

        const aktivanUser = this.getActiveUser()
        const users = this.getUsers()

        users.forEach(u => {

            if (u.email === aktivanUser.email && u.data) {

                if (!u.data) {

                    u.data = [];

                }

                const postoji = u.korpa.find(k => k.toyId == id)

                if (postoji){

                    postoji.kolicina++

                }

                else{

                    u.data.push({
                        rezervacijaId: uuidv4(),
                        toyId: id,
                        userId: aktivanUser.email,
                        kolicina: 1,
                        cena: price,
                        createdAt: new Date().toISOString(),
                        updateAt: null,
                        status: "rezervisano",
                        ocene:[]
                    })

                }

            }

        })

        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))

    }

    static createCart(id: number, name: string, price: number) {

        const aktivanUser = this.getActiveUser()
        const users = this.getUsers()

        users.forEach(u => {

            if (u.email === aktivanUser.email) {

                if (!u.korpa) {

                    u.korpa = [];

                }

                u.korpa.push({
                    rezervacijaId:uuidv4(),
                    toyId: id,
                    userId: aktivanUser.email,
                    kolicina: 1,
                    cena: price,
                    createdAt: new Date().toISOString(),
                    updateAt: null,
                    status: "rezervisano",
                    ocene: []
                })

            }

        })

        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))

    }

    static updateReservationStatus(createdAt: string, newStatus: 'rezervisano' | 'pristiglo' | 'otkazano') {

        const aktivanUser = this.getActiveUser()
        const users = this.getUsers()

        users.forEach(u => {

            if (u.email === aktivanUser.email) {

                u.data.forEach(r => {

                    if (r.createdAt == createdAt) {

                        r.updateAt = new Date().toISOString()
                        r.status = newStatus

                    }

                })

            }

        })

        localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users))

    }

}
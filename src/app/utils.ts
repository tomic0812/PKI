import { Injectable, signal } from "@angular/core";
import Swal from "sweetalert2";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { UserModel } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})

export class Utils{

  public user = signal<UserModel | null>(null)

  constructor(protected router: Router){

    this.refreshUser()

  }

  public bootstrapClasses = {

    popup: 'card',
    cancelButton: 'btn btn-danger',
    denyButton: 'btn btn-secondary',
    confirmButton: 'btn btn-primary'

  }

  public formatDate(iso: string){

    return new Date(iso).toLocaleString('sr-RS', {

      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
      
    })

  }

  public getImage(id: number){

      return `https://toy.pequla.com/img/${id}.png`

  }

  public showLoading(){

    Swal.fire({

      title: 'Loading...',
      text: 'Molimo sačekajte.',
      customClass: this.bootstrapClasses,
      didOpen: () => {

        Swal.showLoading()

      }

    })
    
  }

  public showAlert(text: string){

    Swal.fire({

      icon: 'info',
      titleText: text,
      customClass: this.bootstrapClasses

    })

  }

  public showSuccess(text: string){

    Swal.fire({

      icon: 'success',
      title: text,
      customClass: this.bootstrapClasses

    })

  }

  public showError(message: string){

    Swal.fire({

      title: 'Greška',
      confirmButtonText: 'Close',
      text: message,
      icon: 'error',
      customClass: this.bootstrapClasses

    })

  }

  public showWarning(message: string, buttonText: string, callback: Function){

    Swal.fire({

      title: 'Upozorenje',
      confirmButtonText: buttonText,
      text: message,
      icon: 'warning',
      customClass: this.bootstrapClasses

    }).then(result => {

      if (result.isConfirmed){

        callback()

      }

    })

  }

  public showConfirm(message: string, callback:Function){

    Swal.fire({

      title: message,
      showCancelButton: true,
      confirmButtonText: 'DA',
      cancelButtonText: 'NE',
      icon: 'question',
      customClass: this.bootstrapClasses
      
    }).then(result => {

      if (result.isConfirmed){

        callback()

      }

    })

  }

  public refreshUser() {

    try {

      this.user.set(UserService.getActiveUser())

    } catch {

      this.user.set(null)

    }

  }

  public logoutNow() {

    this.showConfirm('Da li ste sigurni da želite da se odjavite?', () => {

      UserService.logout()
      this.user.set(null)
      this.router.navigateByUrl('/login')

    })

  }

}
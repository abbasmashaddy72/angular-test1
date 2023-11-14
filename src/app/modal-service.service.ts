// modal.service.ts
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isModalOpenSubject = new BehaviorSubject<boolean>(false)
  public isModalOpen$ = this.isModalOpenSubject.asObservable()

  constructor () {}

  openModal () {
    this.isModalOpenSubject.next(true)
  }

  closeModal () {
    this.isModalOpenSubject.next(false)
  }
}

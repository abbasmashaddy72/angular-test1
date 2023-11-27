import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isModalOpenSubject = new BehaviorSubject<boolean>(false);
  public isModalOpen$ = this.isModalOpenSubject.asObservable();
  public type: any;

  constructor() {}

  openModal(type: any) {
    this.type = type;
    this.isModalOpenSubject.next(true);
  }

  closeModal() {
    this.isModalOpenSubject.next(false);
  }
}

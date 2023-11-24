import { Component, Input, OnInit } from '@angular/core';
import { StorageComponent } from 'src/app/pages/storage/storage.component';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
})
export class FolderComponent implements OnInit {
  @Input() folderData: any;
  @Input() type: any;

  constructor(
    public modalService: ModalService,
    private storageComponent: StorageComponent
  ) {}

  ngOnInit(): void {}

  folderToMoveOrCopy(event: any, type: any) {
    if (type === 'copy') {
      this.storageComponent.moveOrCopyFile(event!, true);
    } else {
      this.storageComponent.moveOrCopyFile(event!, false);
    }
    this.modalService.closeModal();
  }
}

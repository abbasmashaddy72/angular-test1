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
  showSubFolders: boolean = false;
  folderHistory: any[] = [];
  selectedFolder: any;

  constructor(
    public modalService: ModalService,
    private storageComponent: StorageComponent
  ) {}

  ngOnInit(): void {}

  folderToMoveOrCopy(type: any) {
    console.log(this.selectedFolder);

    if (type === 'copy') {
      this.storageComponent.moveOrCopyFile(this.selectedFolder, true);
    } else {
      this.storageComponent.moveOrCopyFile(this.selectedFolder, false);
    }
    this.modalService.closeModal();
  }

  toggleSubFolders(folder: any): void {
    this.folderHistory.push({
      selectedFolder: this.selectedFolder,
      showSubFolders: this.showSubFolders,
    });

    this.showSubFolders = true;
    this.selectedFolder = folder;
  }

  previousFolder(): void {
    const previousFolderState = this.folderHistory.pop();

    if (previousFolderState) {
      this.showSubFolders = previousFolderState.showSubFolders;
      this.selectedFolder = previousFolderState.selectedFolder;
    } else {
      this.showSubFolders = false;
      this.selectedFolder = null; // or set it to the root folder or any default value
    }
  }
}

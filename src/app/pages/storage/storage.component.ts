import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { ContextMenuModel } from 'src/app/components/context-menu/context-menu.component';
import { ModalService } from 'src/app/services/modal.service';

export interface Folder {
  name: string;
  files: FileObjectBase[];
  subfolders: Folder[];
}

interface FileObjectBase {
  name: string;
  timestamp: Date;
  file_base64: string;
  type: string;
}

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
})
export class StorageComponent implements OnInit {
  private readonly fileUploadLimit = 1048576;
  private readonly localStorageKey = 'folderBasedImages';
  private fileToMoveOrCopy: FileObjectBase | null = null;
  private readonly notifier: NotifierService;
  newFolderName: string = '';
  folderData: Folder[] = [];
  selectedFolder: Folder | null = null;
  isDisplayContextMenu: boolean = false;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPositionX: number = 0;
  rightClickMenuPositionY: number = 0;
  clickEvent: string = 'copy';

  constructor(
    private sanitizer: DomSanitizer,
    public modalService: ModalService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    const storedData = localStorage.getItem(this.localStorageKey);

    if (storedData) {
      this.folderData = JSON.parse(storedData);
    } else {
      this.folderData = [
        {
          name: 'Root',
          files: [],
          subfolders: [],
        },
      ];
    }

    this.selectedFolder = this.folderData[0];
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }

  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`,
    };
  }

  private saveFolderData() {
    try {
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(this.folderData)
      );
    } catch (error) {
      console.error('Error saving folder data:', error);

      alert(
        'Failed to save folder data. Please try again or clear local storage.'
      );
      this.ngOnInit();
    }
  }

  selectFolder(folder: Folder) {
    this.selectedFolder = folder;
  }

  emptyField(field: any) {
    if (field === '') {
      this.notifier.notify('error', 'Field Should not be empty');
      return true;
    }
    return false;
  }

  addSubfolderToFolder() {
    if (this.emptyField(this.newFolderName)) {
      return;
    }
    if (!this.selectedFolder) {
      console.error('Selected folder not found or not specified');
      return;
    }

    const newSubfolder: Folder = {
      name: this.newFolderName,
      files: [],
      subfolders: [],
    };

    this.selectedFolder.subfolders.push(newSubfolder);
    this.saveFolderData();
    this.notifier.notify('success', 'Folder Created Successfully');
    this.newFolderName = '';
  }

  private getSelectedFolder(): Folder | null {
    return this.selectedFolder;
  }

  getFileExtension(fileName: string): string {
    const ext = fileName.split('.').pop();
    return ext ? ext.toLowerCase() : '';
  }

  addFile(fileObj: FileObjectBase, folder: Folder) {
    folder.files.push(fileObj);
    this.saveFolderData();
  }

  uploadChangeAction(event: any) {
    const uploadInput = event.target;
    const selectedFolder = this.getSelectedFolder();

    if (selectedFolder) {
      const files = uploadInput.files;

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          if (file.size <= this.fileUploadLimit) {
            const reader = new FileReader();

            reader.onloadend = () => {
              try {
                const base64String =
                  reader.result &&
                  reader.result.toString().replace(/^data:.+;base64,/, '');

                if (base64String) {
                  const fileObj: FileObjectBase = {
                    name: file.name,
                    timestamp: new Date(),
                    file_base64: base64String,
                    type: this.getFileExtension(file.name),
                  };

                  this.addFile(fileObj, selectedFolder);
                }
              } catch (error) {
                console.error('Error in uploadChangeAction:', error);
              }
            };

            reader.readAsDataURL(file);
          } else {
            alert('File too large');
          }
        }
      } else {
        console.error('No files selected');
      }

      uploadInput.value = '';
    } else {
      console.error('Selected folder not found or not specified');
    }
  }

  deleteFileAction(timestamp: Date) {
    if (this.selectedFolder) {
      this.selectedFolder.files = this.selectedFolder.files.filter(
        (file) => file.timestamp !== timestamp
      );
      this.notifier.notify('warning', 'File Delete Successfully');
      this.saveFolderData();
    }
  }

  getSafeImageSource(imageBase64: string): SafeResourceUrl {
    const imageUrl = `data:image/png;base64,${imageBase64}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }

  getSafeFileUrl(fileBase64: string): SafeResourceUrl {
    const fileUrl = `data:application/octet-stream;base64,${fileBase64}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  getSafeVideoUrl(fileBase64: string): SafeResourceUrl {
    const fileUrl = `data:video/mp4;base64,${fileBase64}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  getFileIconClass(fileType: string | null | undefined): string {
    switch (fileType) {
      case 'pdf':
        return 'fas fa-file-pdf';
      case 'doc':
        return 'fas fa-file-word';
      case 'mp4':
        return 'fas fa-file-video';
      default:
        return 'fas fa-file';
    }
  }

  setFileToMoveOrCopy(file: FileObjectBase) {
    this.fileToMoveOrCopy = file;
  }

  showContextMenu(event: any, file: FileObjectBase): void {
    this.isDisplayContextMenu = true;

    this.rightClickMenuItems = [
      {
        menuText: 'Move',
        menuEvent: 'Handle move',
      },
      {
        menuText: 'Copy',
        menuEvent: 'Handle copy',
      },
      {
        menuText: 'Delete',
        menuEvent: 'Handle Delete',
      },
    ];

    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;

    this.setFileToMoveOrCopy(file);
  }

  moveOrCopyFile(targetFolder: Folder, isCopy: boolean) {
    if (this.selectedFolder && this.fileToMoveOrCopy) {
      const fileToMoveOrCopy = isCopy
        ? { ...this.fileToMoveOrCopy, timestamp: new Date() }
        : this.fileToMoveOrCopy;

      targetFolder.files.push(fileToMoveOrCopy);

      if (!isCopy) {
        this.selectedFolder.files = this.selectedFolder.files.filter(
          (file) => file.timestamp !== this.fileToMoveOrCopy!.timestamp
        );
      }

      this.saveFolderData();

      this.fileToMoveOrCopy = null;
    }
  }

  handleMenuItemClick(event: any, file: FileObjectBase): void {
    switch (event.data) {
      case 'Handle move':
        this.clickEvent = 'move';
        this.modalService.openModal();
        break;
      case 'Handle copy':
        this.clickEvent = 'copy';
        this.modalService.openModal();
        break;
      case 'Handle Delete':
        this.deleteFileAction(file.timestamp);
        break;
    }
  }
}

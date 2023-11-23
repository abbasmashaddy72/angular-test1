import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContextMenuModel } from 'src/app/components/context-menu/context-menu.component';

export interface Folder {
  name: string;
  images: ImageObject[];
  files: FileObject[];
  subfolders: Folder[];
}

interface FileObjectBase {
  name: string;
  timestamp: Date;
  file_base64: string;
  type?: string | null;
}

interface ImageObject extends FileObjectBase {
  type: string;
}

interface FileObject extends FileObjectBase {
  type: string;
}

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
})
export class StorageComponent implements OnInit {
  private fileUploadLimit = 1048576;
  private fileToMoveOrCopy: FileObject | null = null;
  newFolderName: string = '';
  newRootFolderName: string = '';
  folderData: Folder[] = [];
  selectedFolder: Folder | null = null;
  isDisplayContextMenu: boolean = false;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPositionX: number = 0;
  rightClickMenuPositionY: number = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const storedData = localStorage.getItem(this.getLocalStorageKey());

    if (storedData) {
      this.folderData = JSON.parse(storedData);
    } else {
      this.folderData = [
        {
          name: 'Root',
          images: [],
          files: [],
          subfolders: [],
        },
      ];
    }

    this.selectedFolder = this.folderData[0];
  }

  selectFolder(folder: Folder) {
    this.selectedFolder = folder;
  }

  deleteImageAction(timestamp: Date) {
    if (this.selectedFolder) {
      this.selectedFolder.images = this.selectedFolder.images.filter(
        (image) => image.timestamp !== timestamp
      );
      this.saveFolderData();
    }
  }

  deleteFileAction(timestamp: Date) {
    if (this.selectedFolder) {
      this.selectedFolder.files = this.selectedFolder.files.filter(
        (file) => file.timestamp !== timestamp
      );
      this.saveFolderData();
    }
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
                  const fileObj: FileObject = {
                    name: file.name,
                    timestamp: new Date(),
                    file_base64: base64String,
                    type: this.getFileExtension(file.name), // Extract and save file extension
                  };

                  // Check the file type and add it to the appropriate array
                  if (file.type.startsWith('image')) {
                    this.addImage(fileObj, selectedFolder);
                  } else {
                    this.addFile(fileObj, selectedFolder);
                  }
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

        this.cdRef.detectChanges();
      } else {
        console.error('No files selected');
      }

      uploadInput.value = '';
    } else {
      console.error('Selected folder not found or not specified');
    }
  }

  getFileExtension(fileName: string): string {
    const ext = fileName.split('.').pop();
    return ext ? ext.toLowerCase() : '';
  }

  addFile(fileObj: FileObject, folder: Folder) {
    folder.files.push(fileObj);
    this.saveFolderData();
  }

  addSubfolderToFolder() {
    if (!this.selectedFolder) {
      console.error('Selected folder not found or not specified');
      return;
    }

    const newSubfolder: Folder = {
      name: this.newFolderName,
      images: [],
      files: [],
      subfolders: [],
    };

    this.selectedFolder.subfolders.push(newSubfolder);
    this.saveFolderData();
    this.newFolderName = '';
  }

  private getSelectedFolder(): Folder | null {
    return this.selectedFolder;
  }

  private getLocalStorageKey() {
    return 'folderBasedImages';
  }

  addRootFolder() {
    const newRootFolder: Folder = {
      name: this.newRootFolderName,
      images: [],
      files: [],
      subfolders: [],
    };

    this.folderData.push(newRootFolder);
    this.saveFolderData();
    this.newRootFolderName = '';
    this.selectFolder(newRootFolder);
  }

  addImage(imageObj: ImageObject, folder: Folder) {
    folder.images.push(imageObj);
    this.saveFolderData();
  }

  private saveFolderData() {
    localStorage.setItem(
      this.getLocalStorageKey(),
      JSON.stringify(this.folderData)
    );
  }

  getSafeImageSource(imageBase64: string): SafeResourceUrl {
    const imageUrl = `data:image/png;base64,${imageBase64}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }

  getSafeFileUrl(fileBase64: string): SafeResourceUrl {
    const fileUrl = `data:application/octet-stream;base64,${fileBase64}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  getFileIconClass(fileType: string): string {
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

  showContextMenu<T extends FileObject>(event: any, file: T) {
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
    ];

    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;

    console.log(file);
    this.setFileToMoveOrCopy(file);
  }

  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`,
    };
  }

  handleMenuItemClick(event: any) {
    switch (event.data) {
      case this.rightClickMenuItems[0].menuEvent:
        console.log('To handle move');
        this.moveOrCopyFile(this.selectedFolder!, false);
        break;
      case this.rightClickMenuItems[1].menuEvent:
        console.log('To handle copy');
        this.moveOrCopyFile(this.selectedFolder!, true);
        break;
    }
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }

  setFileToMoveOrCopy(file: FileObject) {
    this.fileToMoveOrCopy = file;
  }

  moveOrCopyFile(targetFolder: Folder, isCopy: boolean) {
    if (this.selectedFolder && this.fileToMoveOrCopy) {
      // If it's a copy, create a new file object to avoid reference issues
      const fileToMoveOrCopy = isCopy
        ? { ...this.fileToMoveOrCopy, timestamp: new Date() }
        : this.fileToMoveOrCopy;

      // Add the file to the target folder
      targetFolder.files.push(fileToMoveOrCopy);

      // Remove the file from the source folder if it's a move
      if (!isCopy) {
        this.selectedFolder.files = this.selectedFolder.files.filter(
          (file) => file.timestamp !== this.fileToMoveOrCopy!.timestamp
        );
      }

      // Save the changes
      this.saveFolderData();

      // Clear the fileToMoveOrCopy property
      this.fileToMoveOrCopy = null;
    }
  }
}

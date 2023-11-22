import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

export interface Folder {
  name: string
  images: ImageObject[]
  subfolders: Folder[]
}

interface ImageObject {
  name: string
  timestamp: Date
  file_base64: string
}

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {
  private fileUploadLimit = 1048576
  newFolderName: string = ''
  newRootFolderName: string = ''
  folderData: Folder[] = []
  selectedFolder: Folder | null = null

  constructor (
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit () {
    const storedData = localStorage.getItem(this.getLocalStorageKey())

    if (storedData) {
      this.folderData = JSON.parse(storedData)
    } else {
      this.folderData = [
        {
          name: 'Root',
          images: [],
          subfolders: []
        }
      ]
    }

    this.selectedFolder = this.folderData[0]
  }

  selectFolder (folder: Folder) {
    this.selectedFolder = folder
  }

  deleteImageAction (timestamp: Date) {
    if (this.selectedFolder) {
      this.selectedFolder.images = this.selectedFolder.images.filter(
        image => image.timestamp !== timestamp
      )
      this.saveFolderData()
    }
  }

  uploadChangeAction (event: any) {
    console.log(this.selectedFolder)
    console.log('uploadChangeAction triggered')

    const uploadInput = event.target
    const selectedFolder = this.getSelectedFolder()

    if (selectedFolder) {
      const file = uploadInput.files && uploadInput.files[0]

      if (file && file.size <= this.fileUploadLimit) {
        console.log('File selected:', file)
        const reader = new FileReader()

        reader.onloadend = () => {
          try {
            const base64String =
              reader.result &&
              reader.result.toString().replace('data:', '').replace(/^.+,/, '')
            console.log(reader.result)
            console.log(base64String)

            if (base64String) {
              const imageObj: ImageObject = {
                name: `image-${selectedFolder.images.length + 1}`,
                timestamp: new Date(),
                file_base64: base64String
              }

              console.log('Adding imageObj:', imageObj)

              this.addImage(imageObj, selectedFolder)

              this.cdRef.detectChanges()
            }
          } catch (error) {
            console.error('Error in uploadChangeAction:', error)
          }
        }

        reader.readAsDataURL(file)
      } else {
        alert('File too large')
      }

      uploadInput.value = ''
    } else {
      console.error('Selected folder not found or not specified')
    }
  }

  addSubfolderToFolder () {
    if (!this.selectedFolder) {
      console.error('Selected folder not found or not specified')
      return
    }

    const newSubfolder: Folder = {
      name: this.newFolderName,
      images: [],
      subfolders: []
    }

    this.selectedFolder.subfolders.push(newSubfolder)
    this.saveFolderData()
    this.newFolderName = ''
  }

  private getSelectedFolder (): Folder | null {
    return this.selectedFolder
  }

  private getLocalStorageKey () {
    return 'folderBasedImages'
  }

  addRootFolder () {
    const newRootFolder: Folder = {
      name: this.newRootFolderName,
      images: [],
      subfolders: []
    }

    this.folderData.push(newRootFolder)
    this.saveFolderData()
    this.newRootFolderName = ''
    this.selectFolder(newRootFolder)
  }

  addImage (imageObj: ImageObject, folder: Folder) {
    folder.images.push(imageObj)
    this.saveFolderData()
  }

  private saveFolderData () {
    localStorage.setItem(
      this.getLocalStorageKey(),
      JSON.stringify(this.folderData)
    )
  }

  private getImages (folder: Folder) {
    const localStorageData = localStorage.getItem(this.getLocalStorageKey())

    if (localStorageData !== null) {
      folder.images = JSON.parse(localStorageData) || []
    }

    for (const subfolder of folder.subfolders) {
      this.getImages(subfolder)
    }
  }

  getSafeImageSource (imageBase64: string): SafeResourceUrl {
    const imageUrl = `data:image/png;base64,${imageBase64}`
    return this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl)
  }
}

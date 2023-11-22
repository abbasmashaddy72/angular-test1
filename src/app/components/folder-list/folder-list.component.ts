import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Folder } from '../../pages/storage/storage.component'

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent {
  @Input() folders: Folder[] = []
  @Input() selectedFolder: Folder | null = null
  @Output() selectFolder = new EventEmitter<Folder>()

  onSelectFolder (folder: Folder): void {
    this.selectedFolder = folder
    this.selectFolder.emit(folder)
  }
}

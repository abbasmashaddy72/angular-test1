import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-file-viewer-modal',
  templateUrl: './file-viewer-modal.component.html',
  styleUrls: ['./file-viewer-modal.component.scss'],
})
export class FileViewerModalComponent {
  @Input() fileType: string = '';
  @Input() fileSrc: string = '';
  @Input() fileName: string = '';

  constructor(
    public modalService: ModalService,
    private sanitizer: DomSanitizer
  ) {}

  getSafeFileSrc(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.fileSrc);
  }
}

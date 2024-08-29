import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { FormlyField, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of, Subscription } from 'rxjs';
import { FileUploadService } from './file-upload.service';
import { SelectedFile } from '../file-input/selected-file';
import { FileApiService } from 'src/app/common/fileApiService';
import { FILE_TYPE_CONFIG, FileTypeConfig } from 'src/app/common/file-type-config';

@Component({
  selector: 'ngz-formly-material-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [FileUploadService]
})
export class FileUploadComponent implements OnInit, OnDestroy {

  @Input()
  index!: number;

  @Input()
  field?: FormlyFieldConfig;

  @Input()
  mainField?: any;

  @Input()
  uploadUrl?: string;

  @Input()
  passedForm?: any;

  @Input()
  paramName?: string;

  @Output()
  deleteFile = new EventEmitter<any>();

  progress = 0;
  
  fileId:string | undefined;

  uploadError?: string;

  file?: File;

  fileIcon = 'fileType:file';

  private progessSubscription?: Subscription;

  constructor(
    @Inject(FILE_TYPE_CONFIG) public readonly fileTypeConfig: FileTypeConfig,
    private fileApiService:FileApiService,
    private readonly uploadService: FileUploadService) { }

  ngOnInit() {
    this.fileIcon = this.uploadUrl ? 'fileType:fileUpload' : 'fileType:file';
    
    if (this.field?.formControl) {
      const selectedFile: SelectedFile = this.field.formControl.value;
      this.file = selectedFile?.file;
      const FormMode = this.passedForm?.controls?.FormMode?.value ?? "";
      //FormMode == "EDIT"
      if(selectedFile.fileID){
        this.fileId = selectedFile.fileID;
      }else{
      if (!this.field.formControl.valid || !this.uploadUrl || !this.file) {
        return;
      }

      this.field.formControl.setAsyncValidators(this.validateUpload.bind(this));

      setTimeout(() => this.field?.formControl?.updateValueAndValidity(), 0);

      const taskCode = this.passedForm?.controls?.TaskCode?.value ?? ""; 
      const FBFId = this.passedForm?.controls?.FBFId?.value ?? ""; //report Id
      const fieldId = this.mainField?.id ?? "";

      this.progessSubscription = this.uploadService.upload(taskCode,FBFId,fieldId, this.file, this.uploadUrl, this.paramName!)
        .subscribe(
          uploadState => {
            this.progress = uploadState.progress;
            if (this.progress === 100) {
              this.field!.formControl!.value!.filePath = uploadState?.filePath;
              this.field!.formControl!.value!.fileId = uploadState?.fileId;
              this.fileId = uploadState?.fileId ;
            }
          },
          error => {
            this.uploadError = error;
            this.field?.formControl?.updateValueAndValidity();
          },
          () => {
            this.field?.formControl?.updateValueAndValidity();
            if (this.progress === 100 && !this.uploadError) {
              this.fileIcon = 'fileType:file';
            }
          });
      }

    }
  }

  private validateUpload(): Observable<ValidationErrors | null> {
    if (this.uploadError) {
      return of({ uploadError: true });
    }

    if (this.progress === 100) {
      return of(null);
    }

    return of({ uploadInProgress: true });
  }

  ngOnDestroy() {
    this.cancelUpload();
  }

  removeFile() {
    this.cancelUpload();

    const FBFId = this.passedForm?.controls?.FBFId?.value ?? "";

    if(this.fileId){

      // this.fileApiService.deleteFBFsFileById(this.fileId ?? "", FBFId ?? "").subscribe({
      //   next:(response:any) =>{
      //     console.log('File deleted successfully:', response);
      //   },
      //   error:(error:any) =>{}
      // });
    }

    this.deleteFile.emit();
  }

  get showProgressBar(): boolean {
    return !!this.progessSubscription && !this.uploadError;
  }

  private cancelUpload() {
    if (this.progessSubscription) {
      this.progessSubscription.unsubscribe();
    }
  }

}

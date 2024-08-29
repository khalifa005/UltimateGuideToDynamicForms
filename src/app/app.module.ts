import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FILE_TYPE_CONFIG, FileTypeConfig } from './common/file-type-config';
import { MatNativeDateModule } from '@angular/material/core';
import { FormlyExtension, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { fieldMatchValidator, IpValidator, dateFutureValidator, timeFutureValidator, maxFiles, minFiles, totalFileSize, allowedFileExtensions, filenameForbiddenCharacters, maxFilenameLength, autocompleteValidator, typeValidationMessage, IpValidatorMessage, minLengthValidationMessage, maxLengthValidationMessage, minValidationMessage, maxValidationMessage, multipleOfValidationMessage, exclusiveMinimumValidationMessage, exclusiveMaximumValidationMessage, minItemsValidationMessage, maxItemsValidationMessage, constValidationMessage } from './common/helper-dynamic-form-validation';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FileTypeValidationMessages } from './common/file-type-validation-messages';
import { AutocompleteemTypeComponent } from './components/auto-complete/autocompleteem-type.component';
import { FileTypeComponent } from './components/file-type/file-type.component';
import { AutoCompleteExtension } from './common/helpers-function';
import { ArrayTypeComponent } from './components/extra/array.type';
import { MultiSchemaTypeComponent } from './components/extra/multischema.type';
import { NullTypeComponent } from './components/extra/null.type';
import { ObjectTypeComponent } from './components/extra/object.type';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CustomErrorMessageComponent } from './components/custom-error-message/custom-error-message.component';
import { FileUploadErrorMessagePipe } from './pipes/file-upload-error-message.pipe';
import { MatListModule } from '@angular/material/list';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileInputComponent } from './components/file-input/file-input.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NullTypeComponent,
    ArrayTypeComponent,
    ObjectTypeComponent,
    MultiSchemaTypeComponent,
    AutocompleteemTypeComponent,
    FileTypeComponent,
    CustomErrorMessageComponent,
    FileUploadErrorMessagePipe,
    FileInputComponent,
    FileTypeComponent,
    FileUploadComponent,
    FileSizePipe,
    // other components
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    FormlyModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    FormlyMatDatepickerModule,
    MatAutocompleteModule,
    FormlyMaterialModule,
    MatNativeDateModule,
    FormlyMatDatepickerModule,
     FormlyModule.forRoot({
        validators: [
          { name: 'fieldMatch', validation: fieldMatchValidator },
          { name: 'ip', validation: IpValidator },
          {
            name: 'date-future',
            validation: dateFutureValidator,
            options: { days: 2 },
          },
          {
            name: 'time-future',
            validation: timeFutureValidator,
            options: { days: 2 },
          },
          {
            name: 'max-files',
            validation: maxFiles,
            options: { maxFiles: 2 },
          },
          {
            name: 'min-files',
            validation: minFiles,
            options: { minFiles: 0 },
          },
          {
            name: 'total-file-size',
            validation: totalFileSize,
            options: { maxTotalFilesize: 2 },
          },
          {
            name: 'allowed-file-extensions',
            validation: allowedFileExtensions,
            options: { allowedFileExtensions: ['pdf', 'png'] },
          },
          {
            name: 'filename-forbidden-characters',
            validation: filenameForbiddenCharacters,
            options: { forbiddenCharacters: ['c', 'k'] },
          },
          {
            name: 'max-filename-length',
            validation: maxFilenameLength,
            options: { maxFilenameLength: 20 },
          },
          {
            name: 'autocomplete-validation',
            validation: autocompleteValidator
          },
        ],
        validationMessages: [
          ...new FileTypeValidationMessages('en-US').validationMessages,
          { name: 'type', message: typeValidationMessage },
          { name: 'ip', message: IpValidatorMessage },
          { name: 'minLength', message: minLengthValidationMessage },
          { name: 'maxLength', message: maxLengthValidationMessage },
          { name: 'min', message: minValidationMessage },
          { name: 'max', message: maxValidationMessage },
          { name: 'multipleOf', message: multipleOfValidationMessage },
          { name: 'exclusiveMinimum', message: exclusiveMinimumValidationMessage },
          { name: 'exclusiveMaximum', message: exclusiveMaximumValidationMessage },
          { name: 'minItems', message: minItemsValidationMessage },
          { name: 'maxItems', message: maxItemsValidationMessage },
          { name: 'uniqueItems', message: 'should NOT have duplicate items' },
          { name: 'const', message: constValidationMessage },
          { name: 'enum', message: `must be equal to one of the allowed values` },
        ],
        types: [
          { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
          { name: 'array', component: ArrayTypeComponent },
          { name: 'object', component: ObjectTypeComponent },
          { name: 'multischema', component: MultiSchemaTypeComponent },
          {
            name: 'autocompleteem',
            component: AutocompleteemTypeComponent,
            wrappers: ['form-field'],
          },
          { name: 'file',
            component: FileTypeComponent 
          },

        ],
        extensions:[
          {
            name: 'autoFilter',
            extension: new AutoCompleteExtension(),
            //this can do custom logic like caling api based on url
          }
        ]
      }),
  ],
  providers: [  { 
    //change custom formly buttons text file type
    provide: FILE_TYPE_CONFIG, 
    useValue: {
      dropzoneText: 'drag and drop files here or',
      browseFilesButtonText: 'browse files',
      removeFileTooltip: 'remove file'
    } as FileTypeConfig
  }],
  bootstrap: [AppComponent]
})
export class AppModule { 

  constructor(
    matIconRegistry: MatIconRegistry,
     sanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconInNamespace('fileType', 'fileDrop', sanitizer.bypassSecurityTrustResourceUrl('assets/svgs/file_copy-24px.svg'));
    matIconRegistry.addSvgIconInNamespace('fileType', 'file', sanitizer.bypassSecurityTrustResourceUrl('assets/svgs/cloud_done-24px.svg'));
    matIconRegistry.addSvgIconInNamespace('fileType', 'fileUpload', sanitizer.bypassSecurityTrustResourceUrl('assets/svgs/cloud_upload-24px.svg'));
    matIconRegistry.addSvgIconInNamespace('fileType', 'fileRemove', sanitizer.bypassSecurityTrustResourceUrl('assets/svgs/clear-24px.svg'));


  }
  
}


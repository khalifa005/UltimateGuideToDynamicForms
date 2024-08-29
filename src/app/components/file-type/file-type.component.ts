import { Component } from '@angular/core';
import { FieldArrayType, FieldArrayTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { SelectedFile } from '../file-input/selected-file';

@Component({
  selector: 'formly-material-file-type',
  templateUrl: './file-type.component.html',
  styleUrls: ['./file-type.component.scss']
})
export class FileTypeComponent extends FieldArrayType {

  onSelectFiles(files: SelectedFile[]) {
    this.field.formControl.markAsTouched();
    files.forEach(file => {
      this.add(this.formControl.length, file);
    });
    
  }

  onDeleteFile(index: number) {

    console.log("field.fieldGroup");
    console.log(this.field.fieldGroup);
    console.log(this.field);
    this.remove(index);
  }

}

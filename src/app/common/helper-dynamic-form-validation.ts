import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { FileExtensionError } from "./file-extension-error";
import { FilenameForbiddenCharactersError } from "./filename-forbidden-characters-error";
import { FilesizeError } from "./filesize-error";
import { isNumber } from "./helpers-function";
import { MaxFilenameLengthError } from "./max-filename-length-error";
import { MaxFilesError } from "./max-files-error";
import { MinFilesError } from "./min-files-error";
import { TotalFilesizeError } from "./total-filesize-error";
import { SelectedFile } from "./selected-file";

export function minItemsValidationMessage(error: any, field: any) {
    return `should NOT have fewer than ${field?.props?.minItems} items`;
  }
  
  export function maxItemsValidationMessage(error: any, field: any) {
    return `should NOT have more than ${field.props.maxItems} items`;
  }
  
  export function minLengthValidationMessage(error: any, field: any) {
    return `should NOT be shorter than ${field.props.minLength} characters`;
  }
  
  export function maxLengthValidationMessage(error: any, field: any) {
    return `should NOT be longer than ${field.props.maxLength} characters`;
  }
  
  export function minValidationMessage(error: any, field: any) {
    return `should be >= ${field.props.min}`;
  }
  
  export function maxValidationMessage(error: any, field: any) {
    return `should be <= ${field.props.max}`;
  }
  
  export function multipleOfValidationMessage(error: any, field: any) {
    return `should be multiple of ${field.props.step}`;
  }
  
  export function exclusiveMinimumValidationMessage(error: any, field: any) {
    return `should be > ${field.props.step}`;
  }
  
  export function exclusiveMaximumValidationMessage(error: any, field: any) {
    return `should be < ${field.props.step}`;
  }
  
  export function constValidationMessage(error: any, field: any) {
    return `should be equal to constant "${field.props.const}"`;
  }
  
  export function typeValidationMessage({ schemaType }: any) {
    return `should be "${schemaType[0]}".`;
  }

  //custom validation
  export function fieldMatchValidator(control: AbstractControl) {
    const { password, passwordConfirm } = control.value;
  
    // avoid displaying the message error when values are empty
    if (!passwordConfirm || !password) {
      return null;
    }
  
    if (passwordConfirm === password) {
      return null;
    }
  
    return { fieldMatch: { message: 'Password Not Matching' } };
  }


  export function IpValidator(control: AbstractControl): ValidationErrors | null  {
    return !control.value || /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { ip: true };
  }
  
  export function IpValidatorMessage(error: any, field: FormlyFieldConfig) {
    //take anotehr params like message 
    if (!field || !field.formControl) {
      return "";
    }
    return `"${field.formControl.value}" message - is not a valid IP Address`;
  }

  export function dateFutureValidator(
    control: AbstractControl,
    field: FormlyFieldConfig,
    options :any,
  ): ValidationErrors | null {

    // console.log("welcome from validation ----------");
    const minFromDate = new Date();
    const maxToDate = new Date();
    
    const minFromDayFromToday = options.minFromDayFromToday ?? 0;
    const maxToDayFromToday = options.maxToDayFromToday ?? 0;
    
    maxToDate.setDate(maxToDate.getDate() + maxToDayFromToday);
    minFromDate.setDate(minFromDate.getDate() - minFromDayFromToday);

    // console.log("maxToDate Date:", maxToDate.toLocaleDateString());

// const formattedDate = today.toLocaleDateString();
const minformattedDate = minFromDate.toISOString().split('T')[0];
const maxformattedDate = maxToDate.toISOString().split('T')[0];
// console.log("minformattedDate");
// console.log(minformattedDate);

// console.log("maxformattedDate");
// console.log(maxformattedDate);

//     console.log("control.value");
//     console.log(control.value);
//     console.log("field");
//     console.log(field);
//     console.log("options");
//     console.log(options);

    return null;
    return { 'date-future': { message: `custom validator with additional options: ${JSON.stringify(options)}` } };
  }
 
  export function timeFutureValidator(
    control: AbstractControl,
    field: FormlyFieldConfig,
    options :any,
  ): ValidationErrors | null {

    
    // console.log(control.value);
    const isNumberResult = validateTimeString(control.value)

    if(isNumberResult ){
     return null;
    }


    // return null;
    return { 'time-future': { message: `please select a value` } };
  }

  export function maxFiles(
    control: AbstractControl,
    field: FormlyFieldConfig,
    options :any,
  ): ValidationErrors | null 
  {
    const selectedFiles: SelectedFile[] = control.value;

    if (selectedFiles.length > options.maxFiles) {
      const error: MaxFilesError = {
        maxFiles: options.maxFiles,
        actualFiles: selectedFiles.length
      };
      return { maxFiles: error };
    }
    return null;
  }

  export function minFiles(
    control: AbstractControl,
    field: FormlyFieldConfig,
    options :any,
  ): ValidationErrors | null 
  {
    const selectedFiles: SelectedFile[] = control.value;

    if (selectedFiles.length < options.minFiles) {
      const error: MinFilesError = {
        minFiles: options.minFiles,
        actualFiles: selectedFiles.length
      };
      return { minFiles: error };
    }

    return null;
  }

  export function allowedFileExtensions(
    control: AbstractControl,
    field: FormlyFieldConfig,
    options :any,
  ): ValidationErrors | null 
  {
    // const selectedFiles: SelectedFile[] = control.value;

    if (!control.value) {
      return null;
    }

    const uppercasedAllowedFileExtensions = options.allowedFileExtensions
    .map((extension:String) => extension.toUpperCase());

    if(!uppercasedAllowedFileExtensions || uppercasedAllowedFileExtensions.length == 0 ){
      return null;
    }
    const selectedFile: SelectedFile = control.value;
    const file: File = selectedFile.file;

    const index = file.name.lastIndexOf('.');

    if (index === -1) {
      const error: FileExtensionError = {
        allowedFileExtensions: options.allowedFileExtensions,
        actualFileExtension: "undefined"
      };
      return { fileExtensionError: error };
    }

    const fileExtension = file.name.substring(index + 1);

    if (!uppercasedAllowedFileExtensions.includes(fileExtension.toUpperCase())) {
      const error: FileExtensionError = {
        allowedFileExtensions: options.allowedFileExtensions,
        actualFileExtension: fileExtension
      };
      return { fileExtensionError: error };
    }
    return null;
  }
  
  export function filenameForbiddenCharacters(
    control: AbstractControl,
    field: FormlyFieldConfig,
    options :any,
  ): ValidationErrors | null 
  {
    if (!control.value) {
      return null;
    }

    const selectedFile: SelectedFile = control.value;
    const file: File = selectedFile.file;

    const index = file.name.lastIndexOf('.');

    if (index === -1) {
      const error: FilenameForbiddenCharactersError = {
        forbiddenCharacters: options.forbiddenCharacters,
        actualForbiddenCharacters: ["undefined"]
      };
      return { filenameForbiddenCharacters: error };
    }

    const filename = file.name.substring(0, index);
    const actualForbiddenCharacters = new Array<string>();

    options.forbiddenCharacters.forEach((forbiddenCharacter:any) => {
      if (filename.includes(forbiddenCharacter)) {
        actualForbiddenCharacters.push(forbiddenCharacter);
      }
    });

    if (actualForbiddenCharacters.length !== 0) {
      const error: FilenameForbiddenCharactersError = {
        forbiddenCharacters: options.forbiddenCharacters,
        actualForbiddenCharacters
      };
      return { filenameForbiddenCharacters: error };
    }

    return null;
  }
  
  export function maxFilenameLength(
    control: AbstractControl,
    field: FormlyFieldConfig,
    options :any,
  ): ValidationErrors | null 
  {
    if (!control.value) {
      return null;
    }

    const selectedFile: SelectedFile = control.value;
    const file: File = selectedFile.file;

    const index = file.name.lastIndexOf('.');

    if (index === -1) {
      const error: MaxFilenameLengthError = {
        maxFilenameLength: options.maxFilenameLength,
        acturalFilenameLength: 0
      };
      return { maxFilenameLength: error };
    }

    const filename = file.name.substring(0, index);

    if (filename.length > options.maxFilenameLength) {
      const error: MaxFilenameLengthError = {
        maxFilenameLength: options.maxFilenameLength,
        acturalFilenameLength: filename.length
      };
      return { maxFilenameLength: error };
    }
    return null;
  }

  export function x(
    control: AbstractControl,
    field: FormlyFieldConfig,
    options :any,
  ): ValidationErrors | null 
  {
    if (!control.value) {
      return null;
    }

    const selectedFile: SelectedFile = control.value;
    const file: File = selectedFile.file;

    if (file.size > options.maxFilesize) {
      const error: FilesizeError = {
        maxFilesize: options.maxFilesize,
        actualFilesize: file.size
      };
      return { filesize: error };
    }
    return null;
  }

  export function totalFileSize(
    control: AbstractControl,
    field: FormlyFieldConfig,
    options :any,
  ): ValidationErrors | null 
  {
    const selectedFiles: SelectedFile[] = control.value;

    const actualTotalFilesize = selectedFiles
      .map(file => file.file.size)
      .reduce((size1, size2) => size1 + size2, 0);
      
 // Convert the maxTotalFilesize from MB to bytes
 const maxTotalFilesizeInBytes = options.maxTotalFilesize * 1024 * 1024;

 if (actualTotalFilesize > maxTotalFilesizeInBytes) {
   const error: TotalFilesizeError = {
     maxTotalFilesize: maxTotalFilesizeInBytes,
     actualTotalFilesize
   };
   return { totalFilesize: error };
 }

    return null;
  }


  // utils.ts
export function validateTimeString(timeString: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  return regex.test(timeString);
}

export function isControlRequired(control: AbstractControl): boolean {
  if (control) {
    const isRequired = control.hasValidator(Validators.required);
      return isRequired === true;
  }
  return false;
}

  export function autocompleteValidator(
    control: AbstractControl,
    field: FormlyFieldConfig,
    options :any,
  ): ValidationErrors | null {

    // console.log(control.value);
    const isNumberResult = isNumber(control.value)

    if(isNumberResult){
     return null;
    }
    // return null;
    return { 'autocomplete-validation': { message: `please select a value` } };
  }


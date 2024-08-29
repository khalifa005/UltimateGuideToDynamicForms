import { FormlyExtension, FormlyFieldConfig } from "@ngx-formly/core";

export function convertToFormData( dto: any ) {
  const formData = new FormData();

  for ( const key of Object.keys(dto) ) {
    const value = dto[key];
    let typeOfCurrentValue =  typeof(value) ;

    if(isFileArray(value)){
      for (let i = 0; i < value.length; i++) {
        let file: File = value[i];
        formData.append('File', file, file.name);    // the filed name is `files` because the server side declares a `Files` property
      }
    }

    if(typeOfCurrentValue == 'number' && !isFileArray(value)){

      if(value == -1){
        // value = 'null';
      }
    }

    if(typeOfCurrentValue == 'object' && !isFileArray(value))
    {
      if(Array.isArray(value)){
        formData.append(key , JSON.stringify(value));

      }
      else if (value != 'null' && value != null && value instanceof Date){
        formData.append(key, value.toDateString());
      }
      else if (value === 'null' ||value === null || value === 'undifined' && !isFileArray(value) ){
        formData.append(key, '');
      }
    }
    else if (value === 'null' ||value === null || value === 'undifined' ){
      formData.append(key, '');
    }
    else
    {
      if(!isFileArray(value)){
        formData.append(key, value);
      }

    }

  }

  return formData;
}

export function isFileArray(data: any[]): boolean {
  return Array.isArray(data) && data.every((value) => value instanceof File);
}

export function convertCommaSeparatedToNumberArray(commaSeparated: string): number[] {
  if (!commaSeparated) {
    return [];
  }

  return commaSeparated.split(',').map(item => {
    const trimmedItem = item.trim();
    return trimmedItem ? Number(trimmedItem) : NaN;
  }).filter(item => !isNaN(item));
}

function isNumberArray(array: any[]): array is number[] {
  return array.every(item => typeof item === 'number');
}

export function onFileUploadValidationSize(event: HTMLInputEvent, size: number): boolean {
  if (event.target.files!.length > 0) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files[0].size < size)
      return true;

  }
  return false;
}

export function calculatedFileSizeInKB(sizeInMegaByte: number): number {

  const KBTMB : number = 1048576;

  return sizeInMegaByte * KBTMB;

}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export function generateRandomNumberBasedOnDate(): number {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const randomFraction = Math.random();
  const randomNumber = Math.floor(timestamp * randomFraction);
  return randomNumber;
}

export function getCurrentDateAsNumber(): number {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const dateNumber = Number(`${year}${month}${day}`);
  return dateNumber;
}

export function isNumberWontCheckString(value: any): boolean {
  return typeof value === 'number' && isFinite(value);
}

export function isNumber(value: any): boolean {
  const num = parseFloat(value);
  return typeof num === 'number' && isFinite(num) && !isNaN(num);
}


export function getItemsByArrayNameKeyword(data:any, keyword:any) {
  // Find the array that contains the keyword in its key
  const arrayKey = Object.keys(data).find(key => key.toLowerCase().includes(keyword.toLowerCase()));
  
  if (!arrayKey) {
      return 'No matching array found';
  }

  // Return the array
  return data[arrayKey];
}

export class AutoCompleteExtension implements FormlyExtension {
  constructor() {}
  prePopulate(field: FormlyFieldConfig) {

    let props :any = field.props;
    if (!props || !props.translate || props._translated ) {
      return;
    }

    props._translated = true;
    field.expressions = {
      ...(field.expressions || {}),
      // 'props.label': "test",
    };
  }
}
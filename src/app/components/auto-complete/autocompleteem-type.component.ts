import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { FieldTypeConfig } from '@ngx-formly/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { isNumber, getItemsByArrayNameKeyword } from '../../common/helpers-function';

@Component({
  selector: 'formly-autocompleteem-type',
  styleUrls: ['./autocomplete-type.component.scss'],
  template: `

<div class="input-container">
      <input
        matInput
        [matAutocomplete]="auto"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [placeholder]="props.placeholder ?? '' "
        [errorStateMatcher]="errorStateMatcher">
      <mat-icon matSuffix>arrow_drop_down</mat-icon>
    </div>
  

  <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn">
    <mat-option *ngFor="let value of filter | async" [value]="value.id">
      {{ value.name }}
    </mat-option>
  </mat-autocomplete>
`,
})

export class AutocompleteemTypeComponent extends FieldType<FieldTypeConfig> implements OnInit, OnDestroy  {
  filter!: Observable<any>;
  private destroy$: Subject<void> = new Subject<void>();

  listOfOptionsTest:any[] = [];
  orignallistOfOptionsTest: any[] = [];
  selectedItem : string = "testtt";
  private dynamicSearch(text: string, list :any[]): any[] {

    if(isNumber(text)){
    return list;    
    }

    return text ? list.filter(item => item.name.toLowerCase().includes(text.toLowerCase())) : list;
  }

  private setupFilter() {
    this.filter = this.formControl.valueChanges.pipe(
      startWith(''),
      map(text => this.dynamicSearch(text, this.listOfOptionsTest as any[])),
      takeUntil(this.destroy$)
    );
  }

  private setupParentControlListener() {
    const parentId = this.props['parentId'];
    if (parentId) {
      const parentControl = this.form.get(parentId);
      if (parentControl) {
        if (parentControl.value) {
          this.updateOptionsBasedOnParent(parentControl.value);
        }else{
          //rest in case oninit to make the list empty because it depend on parent and the parent doesn't have va;ue
          this.updateOptionsBasedOnParent("0");
        }

        parentControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(parentNewValue => {
          this.updateOptionsBasedOnParent(parentNewValue);
        });
      }


    }else{
    }
  }

  private updateOptionsBasedOnParent(parentNewValue: any) {
    const optionsKey = this.props['optionsKey'];
    this.props.options = this.orignallistOfOptionsTest.filter(option => option.parentId == parentNewValue);
    this.listOfOptionsTest = this.orignallistOfOptionsTest.filter(option => option.parentId == parentNewValue);
    this.formControl.patchValue(null);
  }

  displayFn = (item: any): string => {
  if(this.props.options && isNumber(item) ){

      const options = this.props.options as any[];
      const selectedOption = options.find(x=> x.id == item);
      
      return selectedOption ? selectedOption.name : 'undefined';
    }
    return item ? item.toString() : '';
  }

  ngOnInit() {

    this.orignallistOfOptionsTest = this.props.options as any[];
    this.listOfOptionsTest = this.orignallistOfOptionsTest;

    if (this.formControl.value) {
      this.formControl.patchValue(this.formControl.value);
    }
    this.setupFilter();
    this.setupParentControlListener();
  }

  override ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    super.ngOnDestroy();
  }

}

import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription, Subject, tap, takeUntil, of } from 'rxjs';
import { generateRandomNumberBasedOnDate, convertCommaSeparatedToNumberArray } from './common/helpers-function';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  
private subs: Subscription[] = [];
private destroy$: Subject<any> = new Subject<any>();
form: FormGroup;
isUpdateMode: boolean = false;
formJsonFileName = "api-dynamic-form-testing.json"
model:any= {};

formModelDto = {
     
  "TaskTimeID": "1",
  "StartTime": "2024-06-20T00:00:00.000Z",
  "PlannedDate": "2024-06-19T21:00:00.000Z",
  "EndTime": "2024-06-24T21:00:00.000Z",
  "GVKEY": 3708,
  "TaskTypeID1": 24,
  "TaskTypeID2": 24,
  "TaskTypeID3": 24,
  "TaskTypeID4": 24,
  "TaskTypeID5": 24,
  "FBFID": 5003,
  "FBFID2": 5003,
  "StatusFilter": 0,
  "ShowFilledFBFs": "1"
};

options: FormlyFormOptions = {
  formState: {
    selectOptionsData: {}
    // Remove the selectOptionsData property
    //we can set dtopdown item here or get them from api 
  },
};

fields: FormlyFieldConfig[];
type: string;
formHeader: string = "Dynamic form title";
firstModelChange: boolean = true;
showForm: boolean = false;
formRandomNumber: number;


examples = [
  // 'simple',
  'json-powered',
  // 'dynamic-form',
  // 'dynamic-form',
  // 'nested',
  // 'arrays',
  // 'numbers',
  // 'references',
  // 'schema_dependencies',
  // 'null_field',
  // 'nullable',
  // 'allOf',
  // 'anyOf',
  // 'oneOf',
  // 'select_alternatives',
];


constructor(private http: HttpClient) {}

ngOnInit(): void {
  // this.loadExample(this.examples[0]);
  this.loadSpecificExample();
}

loadSpecificExample() {
  this.showForm = false;
  this.form = new FormGroup({});
  this.options = {};
  
  this.http
  // .get<FormlyFieldConfig[]>('assets/json-powered/user-form-static.json')
  .get<FormlyFieldConfig[]>(`assets/json-powered/${this.formJsonFileName}`)
  // .get<FormlyFieldConfig[]>('src/assets/json-powered/user-form.json')
  .subscribe(fields => {
    // this.fetchSelectOptionsData(fields);
    //we can all dependent fields here and store them 
    // this.fields = this.mapFields(fields);
    this.model = {
      "MAINCLASSFICATION": 6100,
      "SUBCATEGORY": 6110,
      "ACTIONTAKEN": "6136,6135",
      "LOCATIONRELATEDASSET": "2",
      "HOUSECONNECTIONNUMBER": "23",
      "REMARKS": "efsdsddfgdhggfjhv",
      "REPORTID": 727.0,
      "PK": "!!!SPNWCALLDP-1722350383!!!",
      "TASKCODE": "#TASKCODE#"
  };
  this.mapDropdownOptions(fields); //fake api simulation   

    this.type = "json-powered";
  });

  return ;
  
  }

mapDropdownOptions(fields:any) {
// Simulating API call with fake data
const fakeApiResponse: any = {

  sports: [
      { id: '1', name: 'Soccer'},
      { id: '2', name: 'Basketball'},
      { id: '3', name: 'sport 3'},
      { id: '4', name: 'sport 4'},
        
        ],
  teams: [
      { id: '1', name: 'Bayern Munich', parentId: '1' },
      { id: '2', name: 'Real Madrid', parentId: '1' },
      { id: '3', name: 'Cleveland', parentId: '2' },
      { id: '4', name: 'Miami', parentId: '2' },
  ],
  players: [
    { id: '1', name: 'Bayern Munich (Player 1)', parentId: '1' },
    { id: '2', name: 'Bayern Munich (Player 2)', parentId: '1' },
    { id: '3', name: 'Real Madrid (Player 1)', parentId: '2' },
    { id: '4', name: 'Real Madrid (Player 2)', parentId: '2' },
    { id: '5', name: 'Cleveland (Player 1)', parentId: '3' },
    { id: '6', name: 'Cleveland (Player 2)', parentId: '3' },
    { id: '7', name: 'Miami (Player 1)', parentId: '4' },
    { id: '8', name: 'Miami (Player 2)', parentId: '4' },
  ],
};

// Simulating API call using 'of' operator
of(fakeApiResponse).subscribe(
  (data: any) => {
    // this.options.formState.selectOptionsData = data;

    this.options.formState = {
      ...this.options.formState,
      selectOptionsData: data,
    };

    //for non dependency lookups - not shared across props
    this.fields = this.mapFields(fields);
    this.showForm = true;
  },
  (error) => {
    console.error('Failed to fetch select options data:', error);
  }
);
}

mapFields(fields: FormlyFieldConfig[]) {
  return fields.map((f:any) => {
    
   
    if (f.key === 'color') {
      f.type = 'radio';
      f.props.options = this.getColors();
    }

    if (f.type === 'select' && f.props && f.props.multiple == true ) {
      
      const valueAsNumArray = convertCommaSeparatedToNumberArray(this.model[f.key]) ;
      this.model[f.key] = valueAsNumArray ;
    }
    
    return f;
  });
}

getColors() {
  //simulation of how to get from api 
  return this.http.get<{ label: string; value: string }[]>('assets/json-powered/colors.json');
}

onSubmit() {
  console.log(this.model);
  if (this.form.valid) {
    // this.model = this.mapObjectProps(this.model);
    console.log(this.model);
  }

}

public ngOnDestroy(): void {
  this.destroy$.next(true);
  this.destroy$.complete();
  this.subs.forEach((s) => s.unsubscribe());

}

modelChange(event: any) {
//track model changes
  if(this.firstModelChange){
    this.loadCityOptions();
    this.firstModelChange = false;
  }
  console.log(this.form);
  const allDropdownss = this.fields.filter(field => field.key === 'cityId');
  const allDropdown = this.fields.filter(field => field.type === 'select');

  allDropdown.forEach(select => {
      //we can call generic api to populate this select baseed on key
      //or to call all lookups data and make function to populate on the client
      if(select.key === 'formControl'){
        
      }
      
    });

    Object.keys(this.form.controls).forEach(key => {
      const controlErrors = this.form?.get(key)?.errors;
      if (controlErrors != null) {
        
      }
    });


  }

loadCityOptions() {
  const cityFields = this.fields.find(field => field.key === 'nationId');

  if(cityFields){
    cityFields.formControl?.valueChanges.subscribe(value => {
      console.log('nationId changes:', value);
    });
  }

}
 

}

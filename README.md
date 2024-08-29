# UltimateGuideToDynamicForms

## Project Overview

The **UltimateGuideToDynamicForms** is an Angular project designed to create, manage, and validate dynamic forms efficiently. This project offers a modular structure, allowing for easy customization and extension to suit various use cases. It heavily relies on **Angular Formly**, a powerful library that allows you to dynamically generate forms in Angular using JSON configuration.

## Main Components and Functionality

### 1. Main Application Files
- **`app.component.ts`**: The root component that manages the primary view of the application and coordinates the interaction between the UI and the data.
- **`app.module.ts`**: The main module of the application, importing and declaring all necessary components, services, and Angular modules.

### 2. Common Utilities (`src/app/common/`)
- **`fileApiService.ts`**: Service handling file-related operations like uploads and validation.
- **`file-type-config.ts` & `file-type-validation-messages.ts`**: These files contain configurations and validation messages for various file types to ensure they meet specific criteria before being accepted in the form.
- **Validation Error Classes**: Several TypeScript files such as `file-extension-error.ts`, `max-files-error.ts`, and others define custom errors for specific validation cases in dynamic forms.

### 3. Dynamic Form Components (`src/app/components/`)

#### Auto-Complete (`auto-complete/`)
- **Auto-Complete Component**: Manages auto-completion functionality, providing users with suggestions as they type into input fields. This component supports object mapping, allowing users to map objects to IDs, not just strings. This feature is particularly useful for forms that require selecting items from a list where each item has an associated ID (e.g., selecting a user by name but submitting the user ID).

#### Custom Error Message (`custom-error-message/`)
- Displays dynamic error messages within forms, tailored to specific validation errors that occur during user interaction.

#### File Input (`file-input/`)
- Handles file input fields in forms, including selecting, validating, and previewing files.

#### File Upload (`file-upload/`)
- **File Upload Component**: This component handles file uploads, providing a flexible way to manage file data in forms. If the component's `props` include `"uploadUrl": "https://localhost:7014/api/demo/SubmitFormlyFormFileStream"`, the file will be uploaded immediately upon selection. If the `uploadUrl` is not specified, the file will be included in the form data and submitted as part of the entire form when the form is submitted. This allows developers to choose between immediate upload or deferred upload as part of the form submission process.

### 4. Pipes (`src/app/pipes/`)
- **`file-size.pipe.ts`**: A custom Angular pipe that formats file sizes into a human-readable string (e.g., KB, MB).
- **`file-upload-error-message.pipe.ts`**: Formats and translates error messages related to file uploads, making them more user-friendly.

### 5. Assets (`src/assets/`)
- **Static Files**: The `src/assets/` directory contains SVG icons and a JSON file (`api-dynamic-form-testing.json`) used for testing and possibly for generating dynamic forms.

## How It All Works Together

### Dynamic Form Handling
The project is heavily focused on the dynamic generation and validation of forms. Utilities and components work together to create forms that adapt to user input and data, with robust validation to ensure data integrity.

### File Handling
Handling files is a core feature, with components and services dedicated to selecting, validating, and uploading files. This includes managing the file upload process, ensuring files meet predefined criteria, and providing user feedback during the process.

### Custom Error Handling
Custom error handling is an integral part of the project, with dedicated components to manage and display error messages based on validation rules defined in the common utilities.

![Ultimate Guide To Dynamic Example](https://github.com/user-attachments/assets/d96ceaed-f689-4342-8d22-feb9e9d6133e)

## Getting Started

### Development Server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code Scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Unit Tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running End-to-End Tests
Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

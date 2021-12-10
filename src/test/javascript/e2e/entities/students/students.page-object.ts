import { element, by, ElementFinder } from 'protractor';

export class StudentsComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-students div table .btn-danger'));
  title = element.all(by.css('jhi-students div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }
}

export class StudentsUpdatePage {
  pageTitle = element(by.id('jhi-students-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  studentIdentifierInput = element(by.id('field_studentIdentifier'));
  studentFirstNameInput = element(by.id('field_studentFirstName'));
  studentLastNameInput = element(by.id('field_studentLastName'));
  dateOfBirthInput = element(by.id('field_dateOfBirth'));
  schoolYearInput = element(by.id('field_schoolYear'));
  classNameInput = element(by.id('field_className'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setStudentIdentifierInput(studentIdentifier: string): Promise<void> {
    await this.studentIdentifierInput.sendKeys(studentIdentifier);
  }

  async getStudentIdentifierInput(): Promise<string> {
    return await this.studentIdentifierInput.getAttribute('value');
  }

  async setStudentFirstNameInput(studentFirstName: string): Promise<void> {
    await this.studentFirstNameInput.sendKeys(studentFirstName);
  }

  async getStudentFirstNameInput(): Promise<string> {
    return await this.studentFirstNameInput.getAttribute('value');
  }

  async setStudentLastNameInput(studentLastName: string): Promise<void> {
    await this.studentLastNameInput.sendKeys(studentLastName);
  }

  async getStudentLastNameInput(): Promise<string> {
    return await this.studentLastNameInput.getAttribute('value');
  }

  async setDateOfBirthInput(dateOfBirth: string): Promise<void> {
    await this.dateOfBirthInput.sendKeys(dateOfBirth);
  }

  async getDateOfBirthInput(): Promise<string> {
    return await this.dateOfBirthInput.getAttribute('value');
  }

  async setSchoolYearInput(schoolYear: string): Promise<void> {
    await this.schoolYearInput.sendKeys(schoolYear);
  }

  async getSchoolYearInput(): Promise<string> {
    return await this.schoolYearInput.getAttribute('value');
  }

  async setClassNameInput(className: string): Promise<void> {
    await this.classNameInput.sendKeys(className);
  }

  async getClassNameInput(): Promise<string> {
    return await this.classNameInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class StudentsDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-students-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-students'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

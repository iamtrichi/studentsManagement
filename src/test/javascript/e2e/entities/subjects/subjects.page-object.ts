import { element, by, ElementFinder } from 'protractor';

export class SubjectsComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-subjects div table .btn-danger'));
  title = element.all(by.css('jhi-subjects div h2#page-heading span')).first();
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

export class SubjectsUpdatePage {
  pageTitle = element(by.id('jhi-subjects-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  subjectInput = element(by.id('field_subject'));
  keywordsInput = element(by.id('field_keywords'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setSubjectInput(subject: string): Promise<void> {
    await this.subjectInput.sendKeys(subject);
  }

  async getSubjectInput(): Promise<string> {
    return await this.subjectInput.getAttribute('value');
  }

  async setKeywordsInput(keywords: string): Promise<void> {
    await this.keywordsInput.sendKeys(keywords);
  }

  async getKeywordsInput(): Promise<string> {
    return await this.keywordsInput.getAttribute('value');
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

export class SubjectsDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-subjects-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-subjects'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

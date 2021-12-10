import { element, by, ElementFinder } from 'protractor';

export class AppreciationsComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-appreciations div table .btn-danger'));
  title = element.all(by.css('jhi-appreciations div h2#page-heading span')).first();
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

export class AppreciationsUpdatePage {
  pageTitle = element(by.id('jhi-appreciations-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  appreciationIdentifierInput = element(by.id('field_appreciationIdentifier'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setAppreciationIdentifierInput(appreciationIdentifier: string): Promise<void> {
    await this.appreciationIdentifierInput.sendKeys(appreciationIdentifier);
  }

  async getAppreciationIdentifierInput(): Promise<string> {
    return await this.appreciationIdentifierInput.getAttribute('value');
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

export class AppreciationsDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-appreciations-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-appreciations'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

import { element, by, ElementFinder } from 'protractor';

export class IdeaComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-idea div table .btn-danger'));
  title = element.all(by.css('jhi-idea div h2#page-heading span')).first();
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

export class IdeaUpdatePage {
  pageTitle = element(by.id('jhi-idea-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  ideeInput = element(by.id('field_idee'));
  themeInput = element(by.id('field_theme'));
  pisteInput = element(by.id('field_piste'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setIdeeInput(idee: string): Promise<void> {
    await this.ideeInput.sendKeys(idee);
  }

  async getIdeeInput(): Promise<string> {
    return await this.ideeInput.getAttribute('value');
  }

  async setThemeInput(theme: string): Promise<void> {
    await this.themeInput.sendKeys(theme);
  }

  async getThemeInput(): Promise<string> {
    return await this.themeInput.getAttribute('value');
  }

  async setPisteInput(piste: string): Promise<void> {
    await this.pisteInput.sendKeys(piste);
  }

  async getPisteInput(): Promise<string> {
    return await this.pisteInput.getAttribute('value');
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

export class IdeaDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-idea-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-idea'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

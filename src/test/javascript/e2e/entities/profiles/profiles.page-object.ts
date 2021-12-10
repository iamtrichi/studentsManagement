import { element, by, ElementFinder } from 'protractor';

export class ProfilesComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-profiles div table .btn-danger'));
  title = element.all(by.css('jhi-profiles div h2#page-heading span')).first();
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

export class ProfilesUpdatePage {
  pageTitle = element(by.id('jhi-profiles-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  profileIdentifierInput = element(by.id('field_profileIdentifier'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setProfileIdentifierInput(profileIdentifier: string): Promise<void> {
    await this.profileIdentifierInput.sendKeys(profileIdentifier);
  }

  async getProfileIdentifierInput(): Promise<string> {
    return await this.profileIdentifierInput.getAttribute('value');
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

export class ProfilesDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-profiles-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-profiles'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

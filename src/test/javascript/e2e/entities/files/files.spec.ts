import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { FilesComponentsPage, FilesDeleteDialog, FilesUpdatePage } from './files.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('Files e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let filesComponentsPage: FilesComponentsPage;
  let filesUpdatePage: FilesUpdatePage;
  let filesDeleteDialog: FilesDeleteDialog;
  const fileNameToUpload = 'logo-jhipster.png';
  const fileToUpload = '../../../../../../src/main/webapp/content/images/' + fileNameToUpload;
  const absolutePath = path.resolve(__dirname, fileToUpload);
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Files', async () => {
    await navBarPage.goToEntity('files');
    filesComponentsPage = new FilesComponentsPage();
    await browser.wait(ec.visibilityOf(filesComponentsPage.title), 5000);
    expect(await filesComponentsPage.getTitle()).to.eq('Files');
    await browser.wait(ec.or(ec.visibilityOf(filesComponentsPage.entities), ec.visibilityOf(filesComponentsPage.noResult)), 1000);
  });

  it('should load create Files page', async () => {
    await filesComponentsPage.clickOnCreateButton();
    filesUpdatePage = new FilesUpdatePage();
    expect(await filesUpdatePage.getPageTitle()).to.eq('Create or edit a Files');
    await filesUpdatePage.cancel();
  });

  it('should create and save Files', async () => {
    const nbButtonsBeforeCreate = await filesComponentsPage.countDeleteButtons();

    await filesComponentsPage.clickOnCreateButton();

    await promise.all([filesUpdatePage.setUrlInput(absolutePath), filesUpdatePage.setDescriptionInput('description')]);

    expect(await filesUpdatePage.getUrlInput()).to.endsWith(fileNameToUpload, 'Expected Url value to be end with ' + fileNameToUpload);
    expect(await filesUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');

    await filesUpdatePage.save();
    expect(await filesUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await filesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Files', async () => {
    const nbButtonsBeforeDelete = await filesComponentsPage.countDeleteButtons();
    await filesComponentsPage.clickOnLastDeleteButton();

    filesDeleteDialog = new FilesDeleteDialog();
    expect(await filesDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Files?');
    await filesDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(filesComponentsPage.title), 5000);

    expect(await filesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

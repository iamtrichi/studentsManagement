import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SubjectsComponentsPage, SubjectsDeleteDialog, SubjectsUpdatePage } from './subjects.page-object';

const expect = chai.expect;

describe('Subjects e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let subjectsComponentsPage: SubjectsComponentsPage;
  let subjectsUpdatePage: SubjectsUpdatePage;
  let subjectsDeleteDialog: SubjectsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Subjects', async () => {
    await navBarPage.goToEntity('subjects');
    subjectsComponentsPage = new SubjectsComponentsPage();
    await browser.wait(ec.visibilityOf(subjectsComponentsPage.title), 5000);
    expect(await subjectsComponentsPage.getTitle()).to.eq('Subjects');
    await browser.wait(ec.or(ec.visibilityOf(subjectsComponentsPage.entities), ec.visibilityOf(subjectsComponentsPage.noResult)), 1000);
  });

  it('should load create Subjects page', async () => {
    await subjectsComponentsPage.clickOnCreateButton();
    subjectsUpdatePage = new SubjectsUpdatePage();
    expect(await subjectsUpdatePage.getPageTitle()).to.eq('Create or edit a Subjects');
    await subjectsUpdatePage.cancel();
  });

  it('should create and save Subjects', async () => {
    const nbButtonsBeforeCreate = await subjectsComponentsPage.countDeleteButtons();

    await subjectsComponentsPage.clickOnCreateButton();

    await promise.all([subjectsUpdatePage.setSubjectInput('subject'), subjectsUpdatePage.setKeywordsInput('keywords')]);

    expect(await subjectsUpdatePage.getSubjectInput()).to.eq('subject', 'Expected Subject value to be equals to subject');
    expect(await subjectsUpdatePage.getKeywordsInput()).to.eq('keywords', 'Expected Keywords value to be equals to keywords');

    await subjectsUpdatePage.save();
    expect(await subjectsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await subjectsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Subjects', async () => {
    const nbButtonsBeforeDelete = await subjectsComponentsPage.countDeleteButtons();
    await subjectsComponentsPage.clickOnLastDeleteButton();

    subjectsDeleteDialog = new SubjectsDeleteDialog();
    expect(await subjectsDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Subjects?');
    await subjectsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(subjectsComponentsPage.title), 5000);

    expect(await subjectsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

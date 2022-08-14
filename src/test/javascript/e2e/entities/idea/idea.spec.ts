import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { IdeaComponentsPage, IdeaDeleteDialog, IdeaUpdatePage } from './idea.page-object';

const expect = chai.expect;

describe('Idea e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let ideaComponentsPage: IdeaComponentsPage;
  let ideaUpdatePage: IdeaUpdatePage;
  let ideaDeleteDialog: IdeaDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Ideas', async () => {
    await navBarPage.goToEntity('idea');
    ideaComponentsPage = new IdeaComponentsPage();
    await browser.wait(ec.visibilityOf(ideaComponentsPage.title), 5000);
    expect(await ideaComponentsPage.getTitle()).to.eq('Ideas');
    await browser.wait(ec.or(ec.visibilityOf(ideaComponentsPage.entities), ec.visibilityOf(ideaComponentsPage.noResult)), 1000);
  });

  it('should load create Idea page', async () => {
    await ideaComponentsPage.clickOnCreateButton();
    ideaUpdatePage = new IdeaUpdatePage();
    expect(await ideaUpdatePage.getPageTitle()).to.eq('Create or edit a Idea');
    await ideaUpdatePage.cancel();
  });

  it('should create and save Ideas', async () => {
    const nbButtonsBeforeCreate = await ideaComponentsPage.countDeleteButtons();

    await ideaComponentsPage.clickOnCreateButton();

    await promise.all([ideaUpdatePage.setIdeeInput('idee'), ideaUpdatePage.setThemeInput('theme'), ideaUpdatePage.setPisteInput('piste')]);

    expect(await ideaUpdatePage.getIdeeInput()).to.eq('idee', 'Expected Idee value to be equals to idee');
    expect(await ideaUpdatePage.getThemeInput()).to.eq('theme', 'Expected Theme value to be equals to theme');
    expect(await ideaUpdatePage.getPisteInput()).to.eq('piste', 'Expected Piste value to be equals to piste');

    await ideaUpdatePage.save();
    expect(await ideaUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await ideaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Idea', async () => {
    const nbButtonsBeforeDelete = await ideaComponentsPage.countDeleteButtons();
    await ideaComponentsPage.clickOnLastDeleteButton();

    ideaDeleteDialog = new IdeaDeleteDialog();
    expect(await ideaDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Idea?');
    await ideaDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(ideaComponentsPage.title), 5000);

    expect(await ideaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

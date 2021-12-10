import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AppreciationsComponentsPage, AppreciationsDeleteDialog, AppreciationsUpdatePage } from './appreciations.page-object';

const expect = chai.expect;

describe('Appreciations e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let appreciationsComponentsPage: AppreciationsComponentsPage;
  let appreciationsUpdatePage: AppreciationsUpdatePage;
  let appreciationsDeleteDialog: AppreciationsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Appreciations', async () => {
    await navBarPage.goToEntity('appreciations');
    appreciationsComponentsPage = new AppreciationsComponentsPage();
    await browser.wait(ec.visibilityOf(appreciationsComponentsPage.title), 5000);
    expect(await appreciationsComponentsPage.getTitle()).to.eq('Appreciations');
    await browser.wait(
      ec.or(ec.visibilityOf(appreciationsComponentsPage.entities), ec.visibilityOf(appreciationsComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Appreciations page', async () => {
    await appreciationsComponentsPage.clickOnCreateButton();
    appreciationsUpdatePage = new AppreciationsUpdatePage();
    expect(await appreciationsUpdatePage.getPageTitle()).to.eq('Create or edit a Appreciations');
    await appreciationsUpdatePage.cancel();
  });

  it('should create and save Appreciations', async () => {
    const nbButtonsBeforeCreate = await appreciationsComponentsPage.countDeleteButtons();

    await appreciationsComponentsPage.clickOnCreateButton();

    await promise.all([appreciationsUpdatePage.setAppreciationIdentifierInput('appreciationIdentifier')]);

    expect(await appreciationsUpdatePage.getAppreciationIdentifierInput()).to.eq(
      'appreciationIdentifier',
      'Expected AppreciationIdentifier value to be equals to appreciationIdentifier'
    );

    await appreciationsUpdatePage.save();
    expect(await appreciationsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await appreciationsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Appreciations', async () => {
    const nbButtonsBeforeDelete = await appreciationsComponentsPage.countDeleteButtons();
    await appreciationsComponentsPage.clickOnLastDeleteButton();

    appreciationsDeleteDialog = new AppreciationsDeleteDialog();
    expect(await appreciationsDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Appreciations?');
    await appreciationsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(appreciationsComponentsPage.title), 5000);

    expect(await appreciationsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

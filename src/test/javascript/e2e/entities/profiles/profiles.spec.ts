import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProfilesComponentsPage, ProfilesDeleteDialog, ProfilesUpdatePage } from './profiles.page-object';

const expect = chai.expect;

describe('Profiles e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let profilesComponentsPage: ProfilesComponentsPage;
  let profilesUpdatePage: ProfilesUpdatePage;
  let profilesDeleteDialog: ProfilesDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Profiles', async () => {
    await navBarPage.goToEntity('profiles');
    profilesComponentsPage = new ProfilesComponentsPage();
    await browser.wait(ec.visibilityOf(profilesComponentsPage.title), 5000);
    expect(await profilesComponentsPage.getTitle()).to.eq('Profiles');
    await browser.wait(ec.or(ec.visibilityOf(profilesComponentsPage.entities), ec.visibilityOf(profilesComponentsPage.noResult)), 1000);
  });

  it('should load create Profiles page', async () => {
    await profilesComponentsPage.clickOnCreateButton();
    profilesUpdatePage = new ProfilesUpdatePage();
    expect(await profilesUpdatePage.getPageTitle()).to.eq('Create or edit a Profiles');
    await profilesUpdatePage.cancel();
  });

  it('should create and save Profiles', async () => {
    const nbButtonsBeforeCreate = await profilesComponentsPage.countDeleteButtons();

    await profilesComponentsPage.clickOnCreateButton();

    await promise.all([profilesUpdatePage.setProfileIdentifierInput('profileIdentifier')]);

    expect(await profilesUpdatePage.getProfileIdentifierInput()).to.eq(
      'profileIdentifier',
      'Expected ProfileIdentifier value to be equals to profileIdentifier'
    );

    await profilesUpdatePage.save();
    expect(await profilesUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await profilesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Profiles', async () => {
    const nbButtonsBeforeDelete = await profilesComponentsPage.countDeleteButtons();
    await profilesComponentsPage.clickOnLastDeleteButton();

    profilesDeleteDialog = new ProfilesDeleteDialog();
    expect(await profilesDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Profiles?');
    await profilesDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(profilesComponentsPage.title), 5000);

    expect(await profilesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

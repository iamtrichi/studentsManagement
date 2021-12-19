import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CourseComponentsPage, CourseDeleteDialog, CourseUpdatePage } from './course.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('Course e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let courseComponentsPage: CourseComponentsPage;
  let courseUpdatePage: CourseUpdatePage;
  let courseDeleteDialog: CourseDeleteDialog;
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

  it('should load Courses', async () => {
    await navBarPage.goToEntity('course');
    courseComponentsPage = new CourseComponentsPage();
    await browser.wait(ec.visibilityOf(courseComponentsPage.title), 5000);
    expect(await courseComponentsPage.getTitle()).to.eq('Courses');
    await browser.wait(ec.or(ec.visibilityOf(courseComponentsPage.entities), ec.visibilityOf(courseComponentsPage.noResult)), 1000);
  });

  it('should load create Course page', async () => {
    await courseComponentsPage.clickOnCreateButton();
    courseUpdatePage = new CourseUpdatePage();
    expect(await courseUpdatePage.getPageTitle()).to.eq('Create or edit a Course');
    await courseUpdatePage.cancel();
  });

  it('should create and save Courses', async () => {
    const nbButtonsBeforeCreate = await courseComponentsPage.countDeleteButtons();

    await courseComponentsPage.clickOnCreateButton();

    await promise.all([
      courseUpdatePage.setTitleInput('title'),
      courseUpdatePage.setUrlsInput(absolutePath),
      courseUpdatePage.setCtypeInput('ctype'),
    ]);

    expect(await courseUpdatePage.getTitleInput()).to.eq('title', 'Expected Title value to be equals to title');
    expect(await courseUpdatePage.getUrlsInput()).to.endsWith(fileNameToUpload, 'Expected Urls value to be end with ' + fileNameToUpload);
    expect(await courseUpdatePage.getCtypeInput()).to.eq('ctype', 'Expected Ctype value to be equals to ctype');

    await courseUpdatePage.save();
    expect(await courseUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await courseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Course', async () => {
    const nbButtonsBeforeDelete = await courseComponentsPage.countDeleteButtons();
    await courseComponentsPage.clickOnLastDeleteButton();

    courseDeleteDialog = new CourseDeleteDialog();
    expect(await courseDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Course?');
    await courseDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(courseComponentsPage.title), 5000);

    expect(await courseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

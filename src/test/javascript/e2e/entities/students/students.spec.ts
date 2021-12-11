import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { StudentsComponentsPage, StudentsDeleteDialog, StudentsUpdatePage } from './students.page-object';

const expect = chai.expect;

describe('Students e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let studentsComponentsPage: StudentsComponentsPage;
  let studentsUpdatePage: StudentsUpdatePage;
  let studentsDeleteDialog: StudentsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Students', async () => {
    await navBarPage.goToEntity('students');
    studentsComponentsPage = new StudentsComponentsPage();
    await browser.wait(ec.visibilityOf(studentsComponentsPage.title), 5000);
    expect(await studentsComponentsPage.getTitle()).to.eq('Students');
    await browser.wait(ec.or(ec.visibilityOf(studentsComponentsPage.entities), ec.visibilityOf(studentsComponentsPage.noResult)), 1000);
  });

  it('should load create Students page', async () => {
    await studentsComponentsPage.clickOnCreateButton();
    studentsUpdatePage = new StudentsUpdatePage();
    expect(await studentsUpdatePage.getPageTitle()).to.eq('Create or edit a Students');
    await studentsUpdatePage.cancel();
  });

  it('should create and save Students', async () => {
    const nbButtonsBeforeCreate = await studentsComponentsPage.countDeleteButtons();

    await studentsComponentsPage.clickOnCreateButton();

    await promise.all([
      studentsUpdatePage.setStudentIdentifierInput('studentIdentifier'),
      studentsUpdatePage.setStudentFirstNameInput('studentFirstName'),
      studentsUpdatePage.setStudentLastNameInput('studentLastName'),
      studentsUpdatePage.setDateOfBirthInput('2000-12-31'),
      studentsUpdatePage.setSchoolYearInput('schoolYear'),
      studentsUpdatePage.setClassNameInput('className'),
    ]);

    expect(await studentsUpdatePage.getStudentIdentifierInput()).to.eq(
      'studentIdentifier',
      'Expected StudentIdentifier value to be equals to studentIdentifier'
    );
    expect(await studentsUpdatePage.getStudentFirstNameInput()).to.eq(
      'studentFirstName',
      'Expected StudentFirstName value to be equals to studentFirstName'
    );
    expect(await studentsUpdatePage.getStudentLastNameInput()).to.eq(
      'studentLastName',
      'Expected StudentLastName value to be equals to studentLastName'
    );
    expect(await studentsUpdatePage.getDateOfBirthInput()).to.eq('2000-12-31', 'Expected dateOfBirth value to be equals to 2000-12-31');
    expect(await studentsUpdatePage.getSchoolYearInput()).to.eq('schoolYear', 'Expected SchoolYear value to be equals to schoolYear');
    expect(await studentsUpdatePage.getClassNameInput()).to.eq('className', 'Expected ClassName value to be equals to className');

    await studentsUpdatePage.save();
    expect(await studentsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await studentsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Students', async () => {
    const nbButtonsBeforeDelete = await studentsComponentsPage.countDeleteButtons();
    await studentsComponentsPage.clickOnLastDeleteButton();

    studentsDeleteDialog = new StudentsDeleteDialog();
    expect(await studentsDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Students?');
    await studentsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(studentsComponentsPage.title), 5000);

    expect(await studentsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

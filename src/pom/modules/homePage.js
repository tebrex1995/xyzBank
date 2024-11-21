import { HOMEPAGE } from '../../fixtures/pageTextValues';

export class Homepage {
  constructor(page) {
    this.page = page;
    this.homeBtn = page.getByRole('button', { name: HOMEPAGE['homeBtnText'] });
    this.mainHeading = page.locator('.mainHeading');
    this.managerLoginBtn = page.getByRole('button', {
      name: HOMEPAGE['managerLoginBtnText'],
    });
  }
}

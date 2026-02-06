import * as pages from './pages';
import config from 'config';
import {secretPage} from "./pages";

const result = {
  [pages.defaultPage]: `${config.UI_URL_PREFIX}/${pages.defaultPage}`,
  [pages.books]: `${config.UI_URL_PREFIX}/${pages.books}`,
  [pages.login]: `${config.UI_URL_PREFIX}/${pages.login}`,
  [pages.formCreate]: `${config.UI_URL_PREFIX}/${pages.formCreate}`,
  [pages.secretPage]: `${config.UI_URL_PREFIX}/${pages.secretPage}`,
};

export default result;

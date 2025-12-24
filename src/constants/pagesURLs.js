import * as pages from './pages';
import config from 'config';
import {secretPage} from "./pages";

const result = {
  [pages.defaultPage]: `${config.UI_URL_PREFIX}/${pages.defaultPage}`,
  [pages.bookPage]: `${config.UI_URL_PREFIX}/${pages.bookPage}`,
  [pages.bookDetailsPage]: `${config.UI_URL_PREFIX}/${pages.bookDetailsPage}`,
  [pages.login]: `${config.UI_URL_PREFIX}/${pages.login}`,
  [pages.secretPage]: `${config.UI_URL_PREFIX}/${pages.secretPage}`,
};

export default result;

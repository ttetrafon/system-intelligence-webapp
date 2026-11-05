// styles
import './styles/style.css';
// data
import { APP_NAME, OBSERVABLE_ACCESS_TOKEN, OBSERVABLE_USER } from './util/constants';
import { aliases, routes } from './data/routes';
// components
import 'library/lib-fe/components/404/script';
import './components/contents-table/script';
import './components/dashboard/script';
import './components/footer/script';
import './components/header/script';
import './components/menu-item/script';
// services
import { Logger } from 'library/lib/services/logger';
import { Navigator } from 'library/lib-fe/services/navigator';
import { State } from 'library/lib-fe/services/state';
import { LoginResponse, visitor } from 'library/shared/model/User';
import { requestPost } from 'library/lib-fe/util/Requests';
import { serverRequestUrl } from './util/requests';
import { userRefresh } from 'library/shared/data/endpoints';

const logger: Logger = Logger.getInstance();
logger.setLevel('debug');

document.body.classList.add('app-loading');

const state: State = State.getInstance(APP_NAME);
Navigator.getInstance(import.meta.env.VITE_DOMAIN_ROOT, '#app', routes, aliases);

setTimeout(() => {
  document.body.classList.remove('app-loading');
}, 300);

// Initial setup

// ... initialise user state
state.createObservable(OBSERVABLE_USER, visitor);
state.createObservable(OBSERVABLE_ACCESS_TOKEN, {});

// ... send initial request to get user data if a cookie exists
try {
  const refresh = await requestPost<LoginResponse>(serverRequestUrl(userRefresh), JSON.stringify({}), true);
  state.updateObservable(OBSERVABLE_USER, refresh.user);
  state.updateObservable(OBSERVABLE_ACCESS_TOKEN, refresh.token);
}
catch (_ignored) { }
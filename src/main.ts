// styles
import './styles/style.css';
// data
import { APP_NAME, OBSERVABLE_USER } from './util/constants';
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
import { requestGet } from 'library/lib-fe/util/Requests';
import { User, visitor } from 'library/shared/model/User';
import { serverRequestUrl } from './util/requests';

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

// ... send initial request to get user data if there a cookie exists
// const user = requestGet<User | Error>(serverRequestUrl("/app-started"));

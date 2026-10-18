// styles
import './styles/style.css';
// data
import { AppName } from './util/constants';
import { domainRoot } from './data/config';
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

const logger: Logger = Logger.getInstance();
logger.setLevel('debug');

document.body.classList.add('app-loading');

State.getInstance(AppName);
Navigator.getInstance(domainRoot, '#app', routes, aliases);

setTimeout(() => {
  document.body.classList.remove('app-loading');
}, 300);

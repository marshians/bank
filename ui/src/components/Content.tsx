import keycloak from '../keycloak';
import { isAdmin } from '../utils';
import Account from './Account';
import Admin from './Admin';

const Content: React.FC = () => {
  const adminList = import.meta.env.VITE_ADMINS || '';
  const userId = keycloak.subject;

  if (isAdmin(adminList, userId)) {
    return <Admin />;
  } else {
    return <Account />;
  }
};

export default Content;

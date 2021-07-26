import { useHistory, useLocation } from 'react-router-dom';

const BackButton = () => {
    const location = useLocation();
    const history = useHistory();
    if (location.pathname === '/')
        return null;
    return <button id="link" onClick={() => history.replace('/')}>Back to main menu...</button>;
}
 
export default BackButton;
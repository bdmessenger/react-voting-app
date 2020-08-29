import React, {useState, useEffect} from 'react';
import { 
  NavLink, Link, useLocation, useHistory
} from 'react-router-dom';

function App({children, state, isRequestCompleted}) {

  const { isAuthenticated, user} = state;

  const history = useHistory();
  const { pathname } = useLocation();

  const [isUserOptionsCollapse, setUserOptionsCollapse] = useState(true);

  useEffect(() => {
    setUserOptionsCollapse(true);
  }, [pathname]);

  const handleUserOptions = (type) => {
      switch(type) {
          case 'LOGOUT':
              window.open(`${process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8080/'}auth/logout`, "_self");
              break;
          case 'MY_POLLS':
              history.push('/my-polls');
              break;
          case 'CREATE_POLL':
              window.location.href = '/create-poll';
              break;
          default:
              console.log('How did you do that???');
      }
      setUserOptionsCollapse(true);
  }

  return (
    <div>
        <nav className="border-b border-blue-800">
            <div className="container h-full text-center font-semibold flex justify-between items-center">
                <Link exact="true" to="/" className="w-18 px-2 text-2xl text-blue-100">
                    Polltacular
                </Link>
                <div className="flex h-full items-center">
                    <NavLink exact={true} to="/" className="h-full mx-1 p-3 text-blue-100" activeStyle={{background: '#2b6cb0'}}>Home</NavLink>
                    {
                        isAuthenticated &&
                        <div className="mx-2 relative">
                            <div className="select-none cursor-pointer" onClick={() => setUserOptionsCollapse(state => !state)}>
                                <span className="text-blue-100 hover:text-blue-200">{user.name}</span>
                                <b className="caret"></b>
                            </div>
                            {
                                !isUserOptionsCollapse &&
                                <div className="border border-blue-800 border-t-0 rounded rounded-t-none absolute w-64 hidden md:flex flex-col p-2 bg-blue-400" style={{top: '36px', left: '-205px'}}>
                                    <button className="bg-teal-500 focus:bg-teal-600 border-2 border-teal-700" onClick={() => handleUserOptions('MY_POLLS')}>My Polls</button>
                                    <button className="bg-indigo-500 focus:bg-indigo-600 border-2 border-indigo-700" onClick={() => handleUserOptions('CREATE_POLL')}>Create New Poll</button>
                                    <button className="bg-red-500 focus:bg-red-600 border-2 border-red-800 mb-0" onClick={() => handleUserOptions('LOGOUT')}>Log Out</button>
                                </div>
                            }
                        </div>
                    }
                    {
                        !isAuthenticated && 
                        <div 
                            className={`select-none cursor-pointer h-full p-3 text-blue-100 focus:bg-blue-600 ${!isRequestCompleted && 'opacity-50'}`} 
                            disabled={!isRequestCompleted} 
                            onClick={() => window.open(`${process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8080/'}auth/twitter`, "_self")}
                        >Login</div>
                    }
                </div>
            </div>
        </nav>
        {
            !isUserOptionsCollapse &&
            <div className="absolute flex flex-col w-full bg-blue-500 border-b border-blue-800 py-2 md:hidden" style={{top: '46px'}}>
                <button className="bg-teal-500 focus:bg-teal-600 border-2 border-teal-700" onClick={() => handleUserOptions('MY_POLLS')}>My Polls</button>
                <button className="bg-indigo-500 focus:bg-indigo-600 border-2 border-indigo-700" onClick={() => handleUserOptions('CREATE_POLL')}>Create New Poll</button>
                <button className="bg-red-500 focus:bg-red-600 border-2 border-red-800 mb-0" onClick={() => handleUserOptions('LOGOUT')}>Log Out</button>
            </div>
        }
        <div className="rounded-none md:rounded content container shadow-lg">
            {children}
        </div>
        <footer className="container h-16 text-blue-700 text-lg font-semibold text-center">
            Copyright © BDMESSENGER 2020
        </footer>
    </div>
  );
}

export default App;

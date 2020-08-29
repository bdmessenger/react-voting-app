import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import API from '../API'

export default ({isAuthenticated, isRequestCompleted}) => {
    const [polls, setPollsData] = useState(null);

    useEffect(() => {
        API.get('/api/my-polls')
        .then(res => setPollsData(res.data.rows))
        .catch(err => window.location.href = '/not-authorized');
    }, []);

    useEffect(() => {
        if(isRequestCompleted && !isAuthenticated) window.location.href = '/not-authorized';
    }, [isRequestCompleted, isAuthenticated]);

    return(
        <div className="text-center my-4">
            {
                (isRequestCompleted && isAuthenticated && polls) ?
                <>
                    <h2>My Polls:</h2>
                    <h6>Select a poll to see the results and vote.</h6>
                    <div className="border-t-2 max-w-screen-lg mx-auto text-xl overflow-y-auto mt-4 overflow-x-hidden">
                        { 
                            polls.length > 0 ?
                            <div className="mt-3 border-2 border-b-0 border-blue-600 rounded bg-blue-400 select-none">
                                {
                                    polls.map(ele => {
                                        return (
                                            <Link to={`/poll/${ele.id}`} key={ele.id}>
                                                <div className="w-full h-auto hover:bg-blue-500 border-b-2 border-blue-600 cursor-pointer">
                                                    <div className="mx-auto h-full text-white p-4">{ele.name}</div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                }
                            </div>
                            :
                            <div className="p-4">
                                <h3>No Polls Available</h3>
                                <a className="text-blue-500 hover:text-blue-600" href="/create_poll">Create A Poll To Get Started</a>
                            </div>
                        }
                    </div>
                </>
                :
                <h1 className="mt-4 text-gray-700">Loading...</h1>
            }
        </div>
    );
}
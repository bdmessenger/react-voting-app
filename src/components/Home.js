import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import API from '../API';

export default () => {

    const [polls, setPollsData] = useState(null);

    useEffect(() => {
        API.get('/api/polls')
        .then(res => setPollsData(res.data.rows));
    }, []);

    return (
        <div className="text-center my-4">
            <h2>Polltacular</h2>
            {
                polls ?
                <>
                    <h6>Select a poll to see the results and vote, or sign-in to make a new poll.</h6>
                    <div className="border-t max-w-screen-lg mx-auto text-xl overflow-y-auto mt-3 overflow-x-hidden">
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
                                <h2>No Polls Available</h2>
                            </div>
                        }
                    </div>
                </>
                :
                <h1 className="text-blue-600">Now loading...</h1>
            }
        </div>
    );
}
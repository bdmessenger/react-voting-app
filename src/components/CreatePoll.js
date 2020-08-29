import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import API from '../API'

export default ({isAuthenticated, isRequestCompleted}) => {

    const history = useHistory();

    const [title, setTitle] = useState('');

    const [options, setOptions] = useState([
        {id: 1, value: ''},
        {id: 2, value: ''}
    ]);

    useEffect(() => {
        if(isRequestCompleted && !isAuthenticated) window.location.href = '/not-authorized';
    }, [isRequestCompleted, isAuthenticated]);

    const addNewChoiceInput = e => {
        e.preventDefault();
        const length = options.length;
        if(length === 10) return alert('Max amount of options has been reached.');
        setOptions(state => [...state, {id: length + 1, value: ''}]);
        e.target.blur();
    }

    const deleteChoiceInput = (e, id) => {
        e.preventDefault();
        setOptions(options.filter(option => option.id !== id).map((option, i) => ({id: i + 1, value: option.value})));
    }

    const handleOptionInputChange = (e, id) => {
        const newOptionsArray = [...options];
        newOptionsArray[id - 1] = {id, value: e.target.value};
        setOptions(newOptionsArray);
    }

    const handleSubmit = e => {
        e.preventDefault();
        if(title.trim() === '') return alert('invalid title...');
        if(options.find(option => option.value.trim() === '')) return alert('invalid option(s)');

        API.post('/api/create-poll', {
            q_name: title,
            answers: options
        })
        .then(res => {
            alert('A new poll has successfully been created.');
            return history.push(`/poll/${res.data.id}`);
        })
        .catch(err => {
            alert('Failed to create new poll.');
            window.location.href = '/not-authorized';
            return;
        });
    }

    return(
        <div className="my-4 text-center">
        {
            (isRequestCompleted && isAuthenticated) ?
            <>
                <h3>Create Poll</h3>
                <div className="max-w-screen-lg mx-auto text-left text-xl overflow-y-auto mt-4 overflow-x-hidden">
                    <form className="max-w-screen-md mx-auto p-2" onSubmit={handleSubmit}>
                        <div>
                            <label className="font-semibold">Title</label>
                            <input 
                                className="w-full mt-1 p-1 px-2 outline-none border-2 border-blue-300 focus:border-blue-400 focus:bg-blue-100" 
                                type="text" 
                                placeholder="ex: What is your favourite cheese?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required={true}
                                maxLength={50}
                            />
                        </div>
                        <div className="mt-4 w-full">
                            <label className="font-semibold">Options</label>
                            <div className="border mt-2 p-2 bg-gray-200 rounded">
                                <div id="options" className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {
                                        options.map(option =>
                                            <div key={option.id} className="mx-auto md:mx-0 border-2 border-blue-300 flex w-full md:max-w-sm rounded"> 
                                                <input
                                                    type="text"
                                                    className="w-full p-1 px-2 w-full outline-none border-blue-300 focus:border-blue-400 focus:bg-blue-100" 
                                                    
                                                    id={option.id} 
                                                    value={option.value} 
                                                    onChange={e => handleOptionInputChange(e, option.id)} 
                                                    placeholder={`Enter Input For Option ${option.id}`} 
                                                    maxLength={30}
                                                    required={true}
                                                />
                                                {
                                                    option.id > 2 && <button className="bg-blue-400 focus:bg-blue-500 rounded-none m-0 p-1 px-4" onClick={(e) => deleteChoiceInput(e, option.id)}>X</button>
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    options.length === 10 ?
                                    <button className="m-0 mt-4 p-1 px-2 py-2 w-full opacity-25 bg-blue-700 cursor-not-allowed" disabled={true}>Add New Choice</button> :
                                    <button className="m-0 mt-4 p-1 px-2 py-2 w-full" onClick={addNewChoiceInput}>Add New Choice</button>
                                }
                            </div>
                        </div>
                        <input className="submit-btn w-full mt-4" type="submit" value="Submit"/>
                    </form>
                </div>
            </>
            :
            <h1 className="mt-4 text-gray-700">Loading...</h1>
        }
        </div>
    );
}
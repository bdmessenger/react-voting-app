import React, {useState, useEffect, useRef} from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Chart from 'chart.js'
import { TwitterShareButton, TwitterIcon } from 'react-share'
import API from '../API'

export default (props) => {

    const { isAuthenticated, user } = props;

    const {id} = useParams();
    const history = useHistory();

    const [data, setData] = useState(null);
    const chartRef = useRef(null);
    const selectRef = useRef(null);

    const colors = [
        "#63b598", "#ce7d78", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177" ,"#0d5ac1" ,
        "#f205e6" ,"#1c0365" ,"#14a9ad" ,"#4ca2f9" ,"#a4e43f" ,"#d298e2" ,"#6119d0",
        "#d2737d" ,"#c0a43c" ,"#f2510e" ,"#651be6" ,"#79806e" ,"#61da5e" ,"#cd2f00" ,
        "#9348af" ,"#01ac53" ,"#c5a4fb" ,"#996635","#b11573" ,"#4bb473" ,"#75d89e" ,
        "#2f3f94" ,"#2f7b99" ,"#da967d" ,"#34891f" ,"#b0d87b" ,"#ca4751" ,"#7e50a8" ,
        "#c4d647" ,"#e0eeb8" ,"#11dec1" ,"#289812" ,"#566ca0" ,"#ffdbe1" ,"#2f1179" ,
        "#935b6d" ,"#916988" ,"#513d98" ,"#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
        "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
        "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
        "#5be4f0", "#57c4d8", "#a4d17a", "#225b8", "#be608b", "#96b00c", "#088baf",
        "#f158bf", "#e145ba", "#ee91e3", "#05d371", "#5426e0", "#4834d0", "#802234",
        "#6749e8", "#0971f0", "#8fb413", "#b2b4f0", "#c3c89d", "#c9a941", "#41d158",
        "#fb21a3", "#51aed9", "#5bb32d", "#807fb", "#21538e", "#89d534", "#d36647",
        "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
        "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
        "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#21538e", "#89d534", "#d36647",
        "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
        "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
        "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#9cb64a", "#996c48", "#9ab9b7",
        "#06e052", "#e3a481", "#0eb621", "#fc458e", "#b2db15", "#aa226d", "#792ed8",
        "#73872a", "#520d3a", "#cefcb8", "#a5b3d9", "#7d1d85", "#c4fd57", "#f1ae16",
        "#8fe22a", "#ef6e3c", "#243eeb", "#1dc18", "#dd93fd", "#3f8473", "#e7dbce",
        "#421f79", "#7a3d93", "#635f6d", "#93f2d7", "#9b5c2a", "#15b9ee", "#0f5997",
        "#409188", "#911e20", "#1350ce", "#10e5b1", "#fff4d7", "#cb2582", "#ce00be",
        "#32d5d6", "#17232", "#608572", "#c79bc2", "#00f87c", "#77772a", "#6995ba",
        "#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e", "#d00043",
        "#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
        "#28fcfd", "#bb09b", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#a84a8f",
        "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
        "#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a", "#88aa0b", "#406df9",
        "#615af0", "#4be47", "#2a3434", "#4a543f", "#79bca0", "#a8b8d4", "#00efd4",
        "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
        "#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a",
        "#4cf09d", "#c188a2", "#67eb4b", "#b308d3", "#fc7e41", "#af3101", "#ff065",
        "#71b1f4", "#a2f8a5", "#e23dd0", "#d3486d", "#00f7f9", "#474893", "#3cec35",
        "#1c65cb", "#5d1d0c", "#2d7d2a", "#ff3420", "#5cdd87", "#a259a4", "#e4ac44",
        "#1bede6", "#8798a4", "#d7790f", "#b2c24f", "#de73c2", "#d70a9c", "#25b67",
        "#88e9b8", "#c2b0e2", "#86e98f", "#ae90e2", "#1a806b", "#436a9e", "#0ec0ff",
        "#f812b3", "#b17fc9", "#8d6c2f", "#d3277a", "#2ca1ae", "#9685eb", "#8a96c6",
        "#dba2e6", "#76fc1b", "#608fa4", "#20f6ba", "#07d7f6", "#dce77a", "#77ecca"
    ];

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    useEffect(() => {
        API.get(`/api/poll/${id}`)
        .then(res => {
            if(res.status === 200) {
                const {data} = res;
                const {answers} = data;
                setData(data);

                const myChartRef = chartRef.current.getContext('2d');

                new Chart(myChartRef, {
                    type: "pie",
                    data: {
                        labels: answers.map(answer => answer.name),
                        datasets: [
                            {
                                label: "Answers",
                                data: answers.map(answer => answer.votes),
                                backgroundColor: shuffle(colors)
                            }
                        ]
                    },
                    options: {
                        layout: {
                            padding: 0
                        },
                        legend: {
                            onClick: null,
                            position: 'bottom',
                            labels: {
                                fontSize: 18,
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        aspectRatio: 1
                    }
                });

                return true;
            }

            //throw new Error('Invalid Request.');
        })
        .catch(err => history.push('/404'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectSubmit = (e) => {
        const value = selectRef.current.value;
        if(value !== 'default') {

            const a_id = parseInt(value);

            API.post('/api/vote', {
                q_id: id,
                a_id
            })
            .then(res => {
                if(res.data.success) {
                    alert(`You've voted for: ${data.answers.find(answer => answer.id === a_id).name}.`);
                    window.location.reload();
                    return true;
                }

                alert('Invalid Vote. You can only vote once per poll.');
            });
        } else {
            alert('You must choose which option to vote for.');
        }

        return e.target.blur();
    }

    const handleInputPrompt = (e) => {
        var option = prompt("Please enter a new option:", "");
        if(!option) return e.target.blur();
        
        while(
            // eslint-disable-next-line
            data.answers.find(answer => answer.name.toLowerCase() === option.toLowerCase()) !== undefined ||
            option.trim() === '' ||
            option.length < 1 || option.length > 30
        ) {
            option = prompt("Invalid input. Please enter a new option:");
            if(!option) return e.target.blur();
        }

        API.post('/api/add-poll-option', {
            q_id: id,
            name: option
        })
        .then(res => {
            alert(`Option "${option}" was successfully submitted to the poll.`);
            window.location.reload();
        })
        .catch(err => {
            alert('Option was unsuccessfully submitted to the poll.');
            window.location.reload();
        });
        
        return e.target.blur();
    }

    const handleDeletePoll = e => {
        const confirmation = window.confirm('Are you sure you want to remove this poll?');
        if(confirmation) {

            API.delete(`/api/delete-poll/${id}`)
            .then(res => {
                alert('Poll deleted.');
                return history.push('/');
            })
            .catch(err => {
                alert('This poll has not been deleted.');
                return window.location.reload();
            });


        }
        return e.target.blur();
    }

    return(
        <div className="md:my-8">
            {
                data ?
                <div className="flex flex-col lg:flex-row justify-center items-center">
                    <div className="w-full lg:w-2/5 text-center m-8">
                            <h4>{data.question.name}</h4>
                            <div className="mt-4">
                                <h3>I'd like to vote for...</h3>
                                <select className="w-full p-2 rounded mt-2 border-2 border-blue-400" defaultValue={"default"} ref={selectRef}>
                                    <option value="default" disabled>Choose an option...</option>
                                    {
                                        data.answers.map(answer => <option key={answer.id} value={answer.id}>{answer.name}</option>)
                                    }
                                </select>
                                <div className="mt-3">
                                    {
                                        (isAuthenticated && data.question.user_id === user.id) ?
                                        <>
                                            <button className="w-1/2 m-0 md:text-lg font-semibold rounded-r-none bg-green-500 focus:bg-green-600" onClick={handleSelectSubmit}>Submit</button>
                                            <button className="w-1/2 m-0 md:text-lg font-semibold rounded-l-none bg-orange-500 focus:bg-orange-600" onClick={handleInputPrompt}>Add New Option</button>
                                        </>
                                        :
                                        <button className="w-full m-0 md:text-lg font-semibold rounded-r-none bg-green-500 focus:bg-green-600" onClick={handleSelectSubmit}>Submit</button>
                                    }
                                    <TwitterShareButton
                                        url={window.location.href}
                                        title={`${data.question.name} | Polltacular`}
                                        style={{
                                            backgroundColor: '#4299e1'
                                        }}
                                        className="w-full m-0 mt-2 focus:bg-blue-600"
                                    >
                                        <div className="w-full m-0 flex items-center justify-center p-2">
                                            <TwitterIcon
                                                size={32}
                                                bgStyle={{fill: 'transparent'}}
                                            />
                                            <span className="text-white font-semibold text-lg">Share on Twitter</span>
                                        </div>
                                    </TwitterShareButton>
                                </div>
                            </div>
                    </div>
                    <div className="lg:mt-0 w-full md:w-4/6 lg:w-2/6">
                            <canvas id="chart" ref={chartRef}/>
                            <div className="text-center text-lg font-semibold text-gray-700 mt-3">Total Votes: {data.question.total_votes}</div>
                            {
                                (isAuthenticated && data.question.user_id === user.id ) &&
                                <button className="w-full m-0 mt-3 font-semibold bg-red-600 focus:bg-red-700" onClick={handleDeletePoll}>Delete This Poll</button>
                            }
                    </div>
                </div>
                :
                <div className="flex flex-col lg:flex-row justify-center items-center">
                    <div className="w-full text-center m-8">
                        <h2>Loading Poll...</h2>
                    </div>
                </div>
                
            }
        </div>
    );
}
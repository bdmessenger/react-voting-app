module.exports = (connection, authCheck = null) => {
    const router = require('express').Router();

    router.get('/polls', (req,res) => {
        connection.query("SELECT `id`, `name` FROM `questions`", (err, rows) => {
            if (err) throw err;
            res.json({rows});
        });
    });

    router.get('/poll/:id', (req,res) => {
        const {id} = req.params;
        const result = {};
        connection.query("SELECT `id`, `name`, `user_id`, `total_votes` FROM `questions` WHERE `id`=?", id, (err, rows) => {
            if (err) throw err;
            if(rows.length <= 0) return res.status(401).send('Invalid Id');
            
            result['question'] = rows[0];
            
            connection.query("SELECT `id`, `name`, `votes` FROM `answers` WHERE `q_id`=?", id, (err, rows) => {
                if(err) throw err;
                if(rows.length > 0) {
                    result['answers'] = rows;
                    return res.json(result);
                }
                
                return res.status(401).send('Invalid Id');
            })
        });
    });

    router.get('/my-polls', authCheck, (req,res) => {
        connection.query("SELECT `id`, `name` FROM `questions` WHERE `user_id`=?", req.user.id, (err, rows) => {
            if(err) throw err;
            return res.json({rows});
        });
    });

    router.post('/vote', (req,res) => {
        const {q_id, a_id} = req.body;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
        if(q_id && a_id && ip) {
            connection.query("SELECT `id` FROM `votes` WHERE `ip`=? AND `q_id`=?", [ip, q_id], (err, rows) => {
                if(err) throw err;
                
                if(rows.length > 0) return res.json({success: false});
                connection.query("INSERT INTO `votes` (`a_id`, `q_id`, `ip`) VALUES (?, ?, ?)", [a_id, q_id, ip], (err) => {
                    if(err) throw err;
                    return res.json({success: true});
                });
            })
        } else {
            return res.status(401).send('Invalid id/ip');
        }
    });

    router.post('/add-poll-option', authCheck, (req,res) => {
        const {q_id, name} = req.body;
    
        if(req.user && q_id && name) {
            connection.query("SELECT `id` FROM `questions` WHERE `id`=? AND `user_id`=?", [q_id, req.user.id], (err, result) => {
                if(err) throw err;

                if(result.length < 1) return res.status(401).send("Invalid Poll.");
    
                connection.query("INSERT INTO `answers` (`q_id`,`name`) VALUES (?, ?)", [q_id, name], (err) => {
                    if(err) throw err;
                    return res.send('A new option was added to the poll.');
                });
            });
        } else {
            return res.status(401).send('Invalid Poll.');
        }
    });

    router.post('/create-poll', authCheck, (req,res) => {
        const {q_name, answers } = req.body;
        if(req.user && q_name && answers) {
            connection.query("INSERT INTO `questions` (`name`, `user_id`) VALUES (?, ?); SELECT LAST_INSERT_ID();", [q_name, req.user.id], (err, result) => {
                if(err) throw err;
                const q_id = result[0].insertId;
                answers.forEach((obj, i) => {
                    connection.query("INSERT INTO `answers` (`q_id`, `name`) VALUES (?, ?)", [q_id, obj.value], err => { 
                        if(err) throw err;
                        //if(answers.length - 1 === i) return res.send('Poll was successfully created.')
                    });
                });
                return res.json({message: 'Successfully created a new poll.', id: q_id});
            })
        } else {
            return res.status(401).send('Failed to create a new poll.');
        }
    });

    router.delete('/delete-poll/:id', authCheck, (req,res) => {
        const { id } = req.params;
        if(req.user && id) {
            connection.query("DELETE FROM `questions` WHERE `id`=? AND `user_id`=?", [id, req.user.id], (err, result) => {
                if (err) throw err;
                if(result.affectedRows !== 0) return res.send(`Poll #${id} has been deleted.`);
                return res.status(401).send(`Poll #${id} has not been deleted.`);
            });
        } else {
            return res.status(401).send('Invalid Poll.');
        }
    });





    return router;
};


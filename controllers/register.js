
const handleRegister = (db, bcrypt) => (req, res) => {
    console.log("Starting handleRegister")
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission')
    }
    const hash = bcrypt.hashSync(password);
        console.log("Encrypting password")
        db.transaction(trx =>  {
            console.log("Starting transaction with database")
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        console.log(user)
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
            console.log("transaction complete")
        })
        .catch(err => res.status(400).json('User already exists: ', err))
}

module.exports = { handleRegister }
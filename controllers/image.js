const Clarifai = require('clarifai')


const handleApiCall = (req, res) =>{
    const MODEL_ID = process.env["CLARIFAI-MODEL-ID"];
    const MODEL_VERSION_ID = process.env["CLARIFAI-VERSION-ID"];
    const returnClarifaiRequestOptions = (imageUrl) => {
        // Your PAT (Personal Access Token) can be found in the Account's Security section
        const PAT = process.env["CLARIFAI-PAT"];
        // Specify the correct user_id/app_id pairings
        // Since you're making inferences outside your app's scope
        const USER_ID = 'rakoc001';
        const APP_ID = 'ZTM-Smart-Brain';
        // Change these to whatever model and image URL you want to use
        const IMAGE_URL = imageUrl;

        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": IMAGE_URL
                        }
                    }
                }
            ]
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT
            },
            body: raw
        };

        return requestOptions;
    }

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", returnClarifaiRequestOptions(req.body.input))
    .then(response => response.json())
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))
}

const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('Unable to retrieve entry count'))
}

module.exports = { 
    handleImage,
    handleApiCall
}
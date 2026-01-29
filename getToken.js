const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

exports.getToken = async () => {
    try {
        const key = await askQuestion('Enter API key: ');
        const secret = await askQuestion('Enter API secret: ');
        
        const tokenUrl = process.env.tokenUrl;
        const scope = process.env.scope;
        const flow = process.env.flow;

        const tokenResponse = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: flow,
                scope: scope,
                client_id: key,
                client_secret: secret,
            }),
        });

        const tokenJson = await tokenResponse.json();

        const token = tokenJson.access_token;
        
        rl.close();
        return token;
    } catch (err) {
        rl.close();
        return err;
    }
};

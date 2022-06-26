import Snoowrap from 'snoowrap';

export class Reddit {

    private static instance:Reddit;

    public client:Snoowrap;

    constructor(){

        this.client = require("snoowrap");
        this.client = new Snoowrap({
            userAgent: 'GotterfunkenPostingBot',
            clientId: process.env.FG_REDDIT_CLIENT_ID,
            clientSecret: process.env.FG_REDDIT_CLIENT_SECRET,
            username: process.env.FG_REDDIT_USER,
            password: process.env.FG_REDDIT_PASS
        });

    }

    // Service Instance Initialization
    static getInstance() {
        
        if (!Reddit.instance) {
            Reddit.instance = new Reddit();
        }
        return Reddit.instance;

    }

}

export default Reddit.getInstance();
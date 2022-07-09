import {Pool} from "pg";

export class DBFactory {

    private static instance:DBFactory;

    private Pool:Pool;

    constructor() {

        this.Pool = new Pool({
            database: process.env.EUINT_DATABASE,
            host: process.env.EUINT_DATABASE_HOST,
            password: process.env.EUINT_DATABASE_PASSWORD,
            user: process.env.EUINT_DATABASE_USER
        });

        this.Pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err)
            process.exit(-1)
        });

    }

    static getInstance() {
        if (!DBFactory.instance) {
            DBFactory.instance = new DBFactory();
            // ... any one time initialization goes here ...
        }
        return DBFactory.instance;

    }

    async q(query:any) {

        const client = await this.Pool.connect();

        try {

            return await client.query(query);

        } finally {

            client.release();

        }
    
    }

}

export const db = DBFactory.getInstance();
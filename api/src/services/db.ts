import * as mysql from "mysql";

export class DB {

    private static instance:DB;

    private Pool:mysql.Pool;

    constructor() {
        
        this.Pool = mysql.createPool({
            user:process.env._DB_USERNAME,
            password:process.env._DB_PASSWD,
            database:process.env._DB,
            host:'localhost',
            multipleStatements: true,
            charset:'utf8mb4',
            connectionLimit : 1000,
            connectTimeout  : 60 * 60 * 1000,
            acquireTimeout  : 60 * 60 * 1000,
            timeout         : 60 * 60 * 1000,
        });

        this.Pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err)   
            process.exit(-1)
        });

        console.log("DB Init");

        this.q('CREATE TABLE IF NOT EXISTS user (' +
        'id int(11) NOT NULL AUTO_INCREMENT,' +
        'user_name varchar(255) NOT NULL,' +
        'email varchar(255) NOT NULL,' +
        'password varchar(255) NOT NULL,' +
        'PRIMARY KEY (id),'+
        'UNIQUE KEY email_UNIQUE (email),' +
        'UNIQUE KEY password_UNIQUE (password))',[]).catch(e=>console.error(e));


    }

    private getPoolConnection() : Promise<mysql.PoolConnection> {

        let that = this;
        return new Promise(function(resolve,reject) {

            that.Pool.getConnection(function(error:mysql.MysqlError, connection:any) {
                
                if(error) {
                
                    reject(error);
                
                } else {
                
                    resolve(connection);
                
                }
            
            });

        });

    }

    static getInstance() {
        
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;

    }

    public getConnectionQuery(connection:mysql.PoolConnection,sql:string,vals:any[]):Promise<any>{

        return new Promise(function(resolve,reject) {

            connection.query(sql,vals,(error, results)=>{

                if(error) {
                    
                    reject({error:error,sql:sql,vals:vals});
                
                } else {

                    connection.release();

                    resolve(results);
                
                }

            });

        });

    }

    // Execute MySQL query
	public async q(sql:string,vals?:any[]) {

        if(!vals) vals = [];
        if(this.Pool) {
            
            const connection = await this.getPoolConnection().catch(e=>{throw e});

            return await this.getConnectionQuery(connection,sql,vals);

        } else {

            throw "Pool Errpr";

        }

	}

    public async getById(table:string,value:any) {

        return await this.q(`SELECT * FROM ? WHERE id = ?`,[table,value]).catch(e=>console.error(e));

    }

    public where(arr:Array<string>){

        let rtn = "";
        
        for(let i=0;i<arr.length;i++){
            if (i === 0) {
                rtn += "WHERE " + arr[i];
            } else {
                rtn += " AND " + arr[i];
            }
        }
        
        return rtn;

    }

}

export default DB.getInstance();
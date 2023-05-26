// common
import mysql, {Pool} from 'mysql2';

export class Database {
    private pool: Pool;

    // database pool for sql connection
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
    }

    Query(sql, values?) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, values, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}
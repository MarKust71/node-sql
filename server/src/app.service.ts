import { Injectable } from '@nestjs/common';

const sql = require('mssql');

@Injectable()
export class AppService {
    getHello(): string {
        const config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: `${process.env.DB_HOST}`,
            database: 'ERPXL_PBSiM',
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000,
            },
            options: {
                enableArithAbort: true,
            },
        };
        const sqlQuery = async () => {
            try {
                console.log('Connecting...');
                await sql.connect(config);
                try {
                    console.log('Querying...');
                    const result = await sql.query(
                        `select * from CDN.KntKarty WHERE Knt_Nazwa1 LIKE '%MITAX%'`,
                    );
                    console.log('result:', result);
                } catch {
                    (error) =>
                        console.error('1 querying error:', error.message);
                }
            } catch {
                (error) => console.error('1 connecting error:', error.message);
            }
            console.log('finished');
        };
        sqlQuery();
        return 'Hello World!';
    }
}

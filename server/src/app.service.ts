import { Injectable } from '@nestjs/common';

const sql = require('mssql');

@Injectable()
export class AppService {
    getHello(): string {
        const config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000,
            },
            options: {
                enableArithAbort: true,
            },
        };
        console.log('config:', config);
        const sqlQuery = async () => {
            try {
                console.log('Connecting...');
                await sql.connect(config);
                try {
                    console.log('Querying...');
                    const query = `SELECT TraNag.TrN_TrNRok, TraNag.TrN_TrNMiesiac, TraNag.TrN_TrNTyp, TraNag.TrN_TrNSeria, 
                                        TraNag.TrN_TrNNumer, TraNag.TrN_DokumentObcy, KntKarty.Knt_Akronim, KntKarty.Knt_Nazwa1, 
                                        KntKarty.Knt_Miasto, KntKarty.Knt_Nip, TraNag.TrN_NettoP, TraNag.TrN_VatP, 
                                        TraNag.TrN_GIDTyp, TraNag.TrN_GIDNumer, 
                                        KntKarty.Knt_Akronim+KntKarty.Knt_Nazwa1+KntKarty.Knt_Miasto+KntKarty.Knt_Ulica+KntKarty.Knt_Nip AS 'klucz', 
                                        CDN.TSToDate(TraNag.TrN_Data2, 0) AS 'DataW', CDN.TSToDate(TraNag.TrN_Data3, 0) AS 'DataZ', 
                                        CDN.NumerDokumentu(TraNag.TrN_GIDTyp,TraNag.TrN_SpiTyp,TraNag.TrN_TrnTyp,TraNag.TrN_TrnNumer,TraNag.TrN_TrnRok,TraNag.TrN_TrnSeria,TraNag.TrN_TrnMiesiac) AS 'ident'
                                   FROM CDN.KntKarty KntKarty, CDN.TraNag TraNag
                                   WHERE TraNag.TrN_KntNumer = KntKarty.Knt_GIDNumer 
                                        AND ((TraNag.TrN_Dziennik Like '%') 
                                            AND (TraNag.TrN_DokumentObcy Like '%'+''+'%') 
                                            AND (KntKarty.Knt_Akronim+KntKarty.Knt_Nazwa1+KntKarty.Knt_Miasto+KntKarty.Knt_Ulica+KntKarty.Knt_Nip Like '%'+''+'%') 
                                            AND (TraNag.TrN_TrNSeria+'/'+CDN.NumerDokumentu(TraNag.TrN_GIDTyp,TraNag.TrN_SpiTyp,TraNag.TrN_TrnTyp,TraNag.TrN_TrnNumer,TraNag.TrN_TrnRok,TraNag.TrN_TrnSeria,TraNag.TrN_TrnMiesiac) Like '%'+''+'%') 
                                            AND (TraNag.TrN_TrNRok>=2020))
                                   ORDER BY TraNag.TrN_TrNRok, TraNag.TrN_TrNMiesiac, TraNag.TrN_TrNTyp, TraNag.TrN_TrNSeria, TraNag.TrN_TrNNumer`;
                    const result = await sql.query(query);
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

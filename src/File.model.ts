declare class Statement {
    public readonly sql: string;
    public readonly lastID: number;
    public readonly changes: number;

    public bind(): Promise<Statement>;
    public bind(...params: any[]): Promise<Statement>;

    public reset(): Promise<Statement>;

    public finalize(): Promise<void>;

    public run(): Promise<Statement>;
    public run(...params: any[]): Promise<Statement>;

    public get(): Promise<any>;
    public get(...params: any[]): Promise<any>;

    public all(): Promise<any[]>;
    public all(...params: any[]): Promise<any[]>;

    public each(callback?: (err: Error, row: any) => void): Promise<number>;
    public each(...params: any[]): Promise<number>;
  }

declare class Database {
    public close(): Promise<void>;

    public run(sql: string): Promise<Statement>;
    public run(sql: string, ...params: any[]): Promise<Statement>;

    public get(sql: string): Promise<any>;
    public get(sql: string, ...params: any[]): Promise<any>;

    public all(sql: string): Promise<any[]>;
    public all(sql: string, ...params: any[]): Promise<any[]>;

    public exec(sql: string): Promise<Database>;

    public each(sql: string, callback?: (err: Error, row: any) => void): Promise<number>;
    public each(sql: string, ...params: any[]): Promise<number>;

    public prepare(sql: string): Promise<Statement>;
    public prepare(sql: string, ...params: any[]): Promise<Statement>;

    public migrate(options: { force?: boolean, table?: string, migrationsPath?: string }): Promise<Database>;
}

import {open} from 'sqlite';
import * as del from 'del'


export class Files{
    dbase:Database;

    ready:Promise<{}>;

    constructor(){
        this.ready = open('./database.sqlite').then(databse=>{
            this.dbase = databse;
            this.dbase.run('create table if not exists files(id INTEGER PRIMARY KEY, original varchar, filename varchar, uploaded integer)')
            return {};
        })
    }

    async add(filename:string, original:string){
        await this.dbase.run(`insert into files(original,filename,uploaded) values('${original}','${filename}',${Date.now()});`);
        return await this.dbase.get(`select * from files where filename='${filename}' limit 1;`).then(file=>{
            let temp = file;
            delete temp.filename;
            return temp;
        });
    }

    get(id:number){
        return this.dbase.get(`select * from files where id=${id} limit 1;`)
    }

     all(){
        return this.dbase.all(`select * from files;`).then(file=>{
            let temp = file.map(val=>{
                let temp1 = val;
                delete temp1.filename;
                return temp1;
            })
            return temp;
        })
    }

    async remove(id:number){
        let record = await this.dbase.get(`select * from files where id=${id} limit 1;`);
        del.sync('files/'+record.filename);
        
        await this.dbase.run(`DELETE from files where id=${id};`)
        return true;
    }
}

export default new Files();
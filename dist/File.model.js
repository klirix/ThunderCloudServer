"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const sqlite_1 = require("sqlite");
const del = require("del");
class Files {
    constructor() {
        this.ready = sqlite_1.open('./database.sqlite').then(databse => {
            this.dbase = databse;
            this.dbase.run('create table if not exists files(id INTEGER PRIMARY KEY, original varchar, filename varchar, uploaded integer)');
            return {};
        });
    }
    add(filename, original) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dbase.run(`insert into files(original,filename,uploaded) values('${original}','${filename}',${Date.now()});`);
            return yield this.dbase.get(`select * from files where filename='${filename}' limit 1;`).then(file => {
                let temp = file;
                delete temp.filename;
                return temp;
            });
        });
    }
    get(id) {
        return this.dbase.get(`select * from files where id=${id} limit 1;`);
    }
    all() {
        return this.dbase.all(`select * from files;`).then(file => {
            let temp = file.map(val => {
                let temp1 = val;
                delete temp1.filename;
                return temp1;
            });
            return temp;
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = yield this.dbase.get(`select * from files where id=${id} limit 1;`);
            del.sync('files/' + record.filename);
            yield this.dbase.run(`DELETE from files where id=${id};`);
            return true;
        });
    }
}
exports.Files = Files;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Files();

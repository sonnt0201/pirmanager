import { IPirRecord } from "../interfaces";
import { ID } from "../interfaces/typedef";

export class PirRecord implements IPirRecord {
    private _recordId: String;
    private _pirId: String;
    private _vols: number[];
    private _time: number;

    constructor({ id, pir, vols, time }: {
        id: ID;
        pir: ID;
        vols: number[];
        time: number;
    }) {
        this._recordId = id;
        this._pirId = pir;
        this._vols = vols;
        this._time = time;
    }
    get recordId() {
        return this._recordId;
    };
    get pirId() {
        return this._pirId;
    }
    get vols() {
        return this._vols;
    }
    get time() {
        return this._time;
    }
    // set time(value: number) {
    //     this._time = value;
    // }

    // set recordId(value: ID) {
    //    this._recordId = value;
    // };
    // set pirId(value: ID) {
    //    this._pirId = value;
    // }
    // set vols(value: number[]) {
    //      this._vols = value;
    // }

    timeInMillisecs(): number[] {
        let times = [];
        const numberOfVols = this._vols.length;
        for (let i = 0; i < 1000; i+= Math.floor(1000 / numberOfVols)) {
            times.push(this._time * 1000 + i);
        }
        return times;
    }


    serializedPairs(): {
        timestamp: number;
        vol: number;
    }[] {

        if (this._vols.length !== 100) {
            console.log("Record cannot be serialized")
            return [];
        }

        let out = [];

       
        const numberOfVols = this._vols.length;
        for (let i = 0; i < 1000; i+= Math.floor(1000 / numberOfVols)) {
            out.push({
                timestamp: (this._time * 1000 + i),
                vol: this._vols[Math.floor(i / 10)]
            });
        }

        return out;
    } 



}
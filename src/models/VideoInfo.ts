import { IVideoInfo } from "../interfaces";

export class VideoInfo implements IVideoInfo {
    private _rawName: string = "";
    private _beginTimestamp: number = 0;
    private _endTimestamp: number = 0;
    private _onRawNameChanged: (name: string) => void = (name: string) => {};
    constructor(rawName: string){
        this.rawName = rawName;
    };

    set rawName(name: string ) {
        this._rawName = name;
        const words = name.split("-");
        this._beginTimestamp = Number(words[0]);
        this._endTimestamp = Number(words[1]);


        this._onRawNameChanged(name);
    }

    get rawName() { return this._rawName; }

    get beginTimestamp() { return this._beginTimestamp; }
    get endTimestamp() { return this._endTimestamp; }

    onRawNameChanged(callback: (name: string) => void) {
        this._onRawNameChanged = callback;


    } 


    // duration in milliseconds
    get duration() { return (this._endTimestamp - this.beginTimestamp)}


    // duration in seconds
    get durationInSecond() { return ((this._endTimestamp - this._beginTimestamp)/1000) }
}
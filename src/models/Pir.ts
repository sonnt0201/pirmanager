import { EncodedPir, IPir } from "../interfaces";

export class Pir implements IPir {
    private _id: string;
    private _description: string;
    private _groupId: string;

    constructor(id: string, groupId: string, description: string) {
        this._id = id;
        this._description = description;
        this._groupId = groupId;
    };


    get id() {
        return this._id;

    }

    ;
    get description() {
        return this._description;
    }
    get groupId() {
        return this._groupId;
    }

}
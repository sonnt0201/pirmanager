import { ID } from "./typedef";

export interface IPirRecord {
    recordId: ID;
    pirId: ID;
    vols: number[];
    time: number;
}


export interface EncodedPirRecord {
    "record_id": string,
    "pir_id": string,
    "timestamp": number,
    "voltages": number[],
    
  }
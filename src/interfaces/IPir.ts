
import { ID } from "./typedef";
export interface IPir {
    id: ID;
    description: String;
    groupId: String;
}

export interface EncodedPir {
    "pir_id": string,
    "group_id": string,
    "pir_description": string
}
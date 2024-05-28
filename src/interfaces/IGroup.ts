import { IPir } from "./IPir";
import { ID } from "./typedef";

export interface IGroup {
    id: ID
    pirs: IPir[] | null;
    description: string;
}
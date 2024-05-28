import {IpcMainInvokeEvent } from "electron"

export interface IGroundService<PayloadType, ReturnType> {
    channel: string;
    executer: (event: IpcMainInvokeEvent, payload : PayloadType) => ReturnType
}




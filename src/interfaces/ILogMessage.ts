


enum LogType {
    NORMAL,
    SUCCESS,
    WARNING,
    ERROR


}

export {LogType}
export interface ILogMessage {
    time: string;
    title: string;
    pirGroup?: string;
    description: string;   
    type: LogType 
}
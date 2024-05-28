import { createContext, useContext } from 'react';
import { LogType, ILogMessage } from '../interfaces';
import { useState } from 'react';

const LogContext = createContext<[ILogMessage[] ,((type: LogType, title: string, description: string, groupID?: string) => void), () => void ]>([[], (type: LogType, title: string, description: string, groupID?: string) => {}, () => {}]);

export const LogProvider = ({ children }: {
    children: JSX.Element
}) => {

    const [logMessages, setLogMessages] = useState<ILogMessage[]>([])

    const log = (type: LogType, title: string, description: string, groupID?: string) => {
        const initLog: ILogMessage = {
            title: title,
            time: Date().toString().slice(0, -25),
            pirGroup: groupID,
            description: description,
            type: type,
        }
        setLogMessages(prev => [initLog, ...prev])
    }

    const clearLog = () => {
        setLogMessages([])
    }

    return <LogContext.Provider value={[logMessages, log, clearLog] }>
        {children}
    </LogContext.Provider>
}
// export type LogContextTuple = [LogMessage[] ,((type: LogType, title: string, description: string, groupID?: string) => void) ]| null
export const useLog = () => useContext(LogContext)
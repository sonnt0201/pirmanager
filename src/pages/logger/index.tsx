"use client";
import { Badge, Button, Timeline } from "flowbite-react";
import { ILogMessage, LogType } from "../../interfaces";
import { GrClearOption } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { ImWarning } from "react-icons/im";
import { FaBell } from "react-icons/fa6";
import { AiOutlineCheck } from "react-icons/ai";
import { useEffect } from "react";
import { useLog } from "../../app_states";
interface Props {
  logMessages: ILogMessage[]
}

export function Logger() {

  const [logMessages, log, clearLog] = useLog()

  useEffect(() => {


    log && log(LogType.NORMAL, 'welcome', 'PIR Manager initialized!')
  }, [])

  const icon = (type: LogType) => {
    if (type === LogType.SUCCESS) return <AiOutlineCheck  className={`scale-75 fill-${color(type)}`}/>;
    if (type === LogType.ERROR) return <AiOutlineClose  className={`scale-75 fill-${color(type)}`}/>;
    if (type === LogType.WARNING) return <ImWarning  className={`scale-75 fill-${color(type)}`}/>;
    if (type === LogType.NORMAL) return <FaBell className={`scale-75 fill-${color(type)}`} />
  }

  const color = (type: LogType) => {
    if (type === LogType.SUCCESS) return "green-600";
    if (type === LogType.ERROR) return "red-600";
    if (type === LogType.WARNING) return "yellow-600";
    if (type === LogType.NORMAL) return "blue-500"
  }

  return (
    <div className=" overflow-y-auto justify-center items-center w-12/12 p-3  h-[90vh] font-consolas">
      {<div className="flex justify-between items-center my-3">
        <h2 className="font-consolas text-center font-bold my-2 mx-2">
          Notifications
        </h2>
        <Button onClick={clearLog} pill size="md" gradientDuoTone="pinkToOrange"><GrClearOption className="p-0 m-0" /></Button>
      </div>
      }

      <div className="w-12/12">
        <Timeline>

          {
            (logMessages.length > 0) &&
            logMessages.map((message: ILogMessage, index: number) => <>
              <Timeline.Item>

                <Timeline.Point />


                <Timeline.Content >
                  <Timeline.Time><p style={{
                    color: index === 0 ? "green" : "black",
                    fontWeight: "semi-bold",
                    fontSize: "0.8rem",
                    marginBottom: "0.3rem"
                  }}>{message.time + (index === 0 ? "(Newest)" : "")}</p></Timeline.Time>
                  {/* <Timeline.Title > */}
                    <div className="flex">

                      {icon(message.type)}<p className={`text-sm ml-1 text-${color(message.type)} py-0 m-0`}>{message.title} </p>
                    </div>


                  {/* </Timeline.Title> */}

                  <Timeline.Body>
                    <p style={{
                      color: 'black',
                      fontWeight: "semi-bold",
                      fontSize: "0.8rem",
                      marginTop: "0.3rem"
                    }}>
                      {message.pirGroup && `Group: ${message.pirGroup}\n`}
                      {message.description}
                    </p>

                  </Timeline.Body>

                </Timeline.Content>
              </Timeline.Item>
            </>)
          }



        </Timeline>
      </div>

    </div>

  )
}
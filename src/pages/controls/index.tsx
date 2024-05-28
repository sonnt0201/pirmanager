import { useState, useCallback, useRef, useEffect, LegacyRef, useContext } from "react";
import { Dropdown, Button, FloatingLabel, Tooltip, Spinner } from "flowbite-react";
import { CamRecorder } from "./CamRecorder";
import { IGroup, LogType, IPir, EncodedPir } from "../../interfaces";
import { useLog } from "../../app_states";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { TbPlugConnectedX } from "react-icons/tb";
import axios from "axios";
import { NezukoLoader } from "../../assets";
import { PirChart } from "./PirChart";
import { Pir } from "../../models";

const GROUP_DES_PLACEHOLDER = "Hãy chọn 1 group"


export const ControlsPage = () => {

    const [capturing, setCapturing] = useState(false);

    // server address
    const [serverAddress, setServerAddress] = useState("0.0.0.0:8080");
    const [serverConnection, setServerConnection] = useState<boolean>(false);
    const [serverConnectionMessage, setServerConnectionMessage] = useState<string>("Trying to connect ...")

    // // pir address
    // const [pirAddress, setPirAddress] = useState("0.0.0.0:3001")
    // // connection state
    // const [pirConnection, setPirConnection] = useState<boolean>(false);
    const [selectedPirGroup, setSelectedPirGroup] = useState<IGroup | null>(null)
    // const [pirConnectionMessage, setPirConnectionMessage] = useState<string>("Trying to connect ...")

    const [groups, setGroups] = useState<IGroup[]>([])
    const [_, log] = useLog();

    // state to ensure the connection
    const [readyToRecord, setReadyToRecord] = useState<boolean>(
        false
    )

    // continuously connect to the server and pir
    useEffect(() => {
        // log(LogType.NORMAL, "Connecting to server and pir device ...", "");
        const id = setInterval(() => {
            checkConnection();
        }, 1000)

        setSelectedPirGroup(null);
        
        return () => clearInterval(id);
    }, [serverAddress])

    // ensure the system is ready to record
    useEffect(() => {
        setReadyToRecord((//pirConnection === true
             serverConnection === true
            && selectedPirGroup != null))
    }, [serverConnection, selectedPirGroup])

    useEffect(() => {

        if (selectedPirGroup === null) return;

        if (selectedPirGroup.pirs !== null) return;
        // console.log("update group ...")
        onSelectedPirGroupUpdated();

    }, [selectedPirGroup])

    const onSelectedPirGroupUpdated = () =>
        axios.get(`http://${serverAddress}/api/pirs/group?group_id=${selectedPirGroup?.id}`)
            .then(response => {


                const pirs: Pir[] = response.data.payload.map((pir: EncodedPir) => {
                    return new Pir(pir.pir_id, pir.group_id, pir.pir_description)
                })

                setSelectedPirGroup(prev => {
                    if (!prev) return prev;

                    const out: IGroup = { ...prev, pirs: pirs }
                    // console.log(out)
                    return out;
                })
            }).catch((err: any) => console.log(err))



    const checkConnection = () => {

        // connect to the server
        axios.get(`http://${serverAddress}/`).then((response) => {
            // console.log(response.status)
            if (response.status === 200) {
                setServerConnection(true);
                setServerConnectionMessage("Server is connected")
                updateGroupIdsList();
            } else {
                setServerConnection(false);
                setServerConnectionMessage("Connection to server is failed, status: " + response.status + ". Trying to reconnect...");
            }

        }).catch((error) => {
            setServerConnection(false)
            setServerConnectionMessage("Connection to server is failed, " + error.message + ". Trying to reconnect...");
        })



    }

    const updateGroupIdsList = async () => {
        try {
            const response = await axios.get(`http://${serverAddress}/api/all-groups`)
            const groupsRaw = response.data
            setGroups(groupsRaw.map((group: { id: String, description: String }) => {
                const out: IGroup = {
                    id: group.id,
                    description: group.description as string,
                    pirs: null,
                }

                return out;

            }));

        } catch (err) {

        }
    }

    const pirOn = () => {
        axios.post(`http://${serverAddress}/on`).then((response) => {
            if (response.status === 200) {
                log(LogType.SUCCESS, "Turn on PIR", serverAddress);
            } else {
                throw new Error("status: " + response.status)
            }
        }).catch(err => {
            log(LogType.ERROR, "Failed to turn on pir", err.message);
        })
    }


    const pirOff = () => {
        axios.post(`http://${serverAddress}/off`).then((response) => {
            if (response.status === 200) {
                log(LogType.SUCCESS, "Turn off PIR", serverAddress);
            } else {
                throw new Error("status: " + response.status)
            }
        }).catch(err => {
            log(LogType.ERROR, "Failed to turn off pir", serverAddress);
        })
    }



    return (

        <>
            <h2 className="mb-2 ml-4 font-bold">
                Điều khiển ghi dữ liệu
            </h2>
            <div className="flex items-center  space-x-4">

                <FloatingLabel style={{ maxWidth: '150px' }} variant="filled" label="Server Address" disabled={capturing} value={serverAddress} onChange={(e) => {
                    setServerAddress(e.target.value.trimEnd());
                }} />

                <Tooltip content={serverConnectionMessage} className="">
                    {serverConnection && <PiPlugsConnectedFill className="scale-150 fill-green-600" />}
                    {
                        !serverConnection && <Spinner color="failure" aria-label="Warning spinner example" />
                        // <TbPlugConnectedX className="scale-150 fill-red-400" />
                    }
                </Tooltip>

                {/* <FloatingLabel style={{ maxWidth: '150px' }} variant="filled" label="PIRs Address" disabled={capturing} value={pirAddress} onChange={(e) => {
                    setPirAddress(e.target.value.trimEnd());
                }} />

                <Tooltip content={pirConnectionMessage}>
                    {pirConnection && <PiPlugsConnectedFill className="scale-150 fill-green-600" />}
                    {
                        !pirConnection && <Spinner color="failure" aria-label="Warning spinner example" />
                        // <TbPlugConnectedX className="scale-150 fill-red-400" />
                    }
                </Tooltip> */}

                {/* choosing pir group */}
                <div className="flex items-center space-x-4">
                    {/* dropdown choosing group */}

                    {!capturing && <Dropdown label={"Chọn nhóm"} size={"xs"} dismissOnClick={true} className="w-64 text-md inline-flex "> {/* Add spacing for visual separation */}
                        {
                            groups.map(group => <Dropdown.Item onClick={() => setSelectedPirGroup(() => group)}>{`${group.description as string}`}</Dropdown.Item>)
                        }

                    </Dropdown>}

                    <FloatingLabel variant="standard" label={selectedPirGroup ? selectedPirGroup.description as string : ""} disabled={true}  />



                </div>

                {/* alert text */}

                {(!serverConnection) && <p className="text-red-600 text-sm">Đang kết nối ...</p>}
                {serverConnection && !selectedPirGroup && <p className="text-red-600 text-sm">Hãy chọn 1 nhóm PIR ... </p>}
                {readyToRecord && <p className="text-green-600 text-sm">Sẵn sàng ghi</p>}
            </div>


            {readyToRecord && <div className="flex align-middle gap-2">

                <div className="">

                    <CamRecorder
                        capturing={capturing}
                        setCapturing={setCapturing}
                        pirOn={pirOn}
                        pirOff={pirOff}
                        readyToRecord={readyToRecord}
                    />

                </div>


                <div className="w-7/12 my-auto">

                    <PirChart serverAddress={serverAddress} pirGroup={selectedPirGroup} capturing={capturing} />

                </div>

            </div>}



        </>
    );
};


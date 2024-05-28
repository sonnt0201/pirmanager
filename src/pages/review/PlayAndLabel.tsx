import ReactPlayer from "react-player";
import { Pir, PirRecord, VideoInfo } from "../../models"
import { useEffect, useRef, useState } from "react";
import { OnProgressProps } from "react-player/base";
import { Button, ButtonGroup, Dropdown, FloatingLabel, Label, Progress, Spinner, Table, Tooltip } from "flowbite-react";
import axios from "axios";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { EncodedPir, EncodedPirRecord, IGroup, ILabel, IPirRecord, ITable2D, LogType } from "../../interfaces";
import { useLog } from "../../app_states";

interface Props {
    videoInfo: VideoInfo;
}


export const PlayAndLabel = ({ videoInfo }: Props) => {

    const videoRef = useRef<ReactPlayer>(null);

    const [secondsPlayed, setSecondsPlayed] = useState<number>(0)
    const [isBufferingEnded, setIsBufferingEnded] = useState<boolean>(false);
    const [secondsLoaded, setSecondsLoaded] = useState(0);
    const [duration, setDuration] = useState<number>(videoInfo.duration)
    const [videoUrl, setVideoUrl] = useState<string>(`/videos/${videoInfo.rawName}.webm`)
    const [pirRecords, setPirRecords] = useState<PirRecord[]>([])

    const [currentLabel, setCurrentLabel] = useState<number>(0)

    const [labelsList, setLabelsList] = useState<ILabel[]>([]);
    const [serverAddress, setServerAddress] = useState<string>();
    const [selectedPirGroup, setSelectedPirGroup] = useState<IGroup | null>();

    const [_, log] = useLog();

    useEffect(() => {
        if (serverAddress && selectedPirGroup) fetchMatchedRecords();
    }, [serverAddress, selectedPirGroup])

    useEffect(() => {
        if (pirRecords.length > 0) {
            const pairs = pirRecords[0].serializedPairs()
            // console.log(pairs)
        }

    }, [pirRecords])


    const serializeLabelsList: () => Map<number, string> = () => {

        let timeMap = new Map<number, string>(); // key as timestamp number and value as string

        // map available labels
        labelsList.forEach((label: ILabel) => {
            timeMap.set(label.timestamp, label.content);


        })

        for (let time = Math.floor(videoInfo.beginTimestamp / 10) * 10; time <= Math.floor(videoInfo.endTimestamp / 10) * 10; time += 10) {
            let value: string;
            if (timeMap.has(time)) continue;
            value = (timeMap.get(time - 10) !== undefined) ? timeMap.get(time - 10) as string : "id0";
            timeMap.set(time, value);
            console.log(time + ": " + value);

        }

        return timeMap;

    }

    const create2DTable = () => {

        var table: ITable2D = {}// number key as timestamp, string key as pir 0,1,2,3,4 and "label name", string value as vols of pirs and label value

        const labelMap = serializeLabelsList();
        // 
        pirRecords.forEach((record, ii) => {
            let serializedRecord = record.serializedPairs();
            serializedRecord?.forEach((pair, index) => {

                // if (ii === 0){ console.log(pair); console.log(record)}

                console.log(pair.timestamp + ": " + labelMap.get(pair.timestamp))
                if (!labelMap.has(pair.timestamp)) return;

                if (!table[pair.timestamp]) {
                    table[pair.timestamp] = {}; // Create a new nested object if it doesn't exist
                }

                const label = labelMap.get(pair.timestamp)
                table[pair.timestamp]["label"] = label ? label : "error";
                table[pair.timestamp][record.pirId as string] = String(pair.vol);
            })
        })

        let csvString = "";
        // create csv
        for (let timestamp in table) {
            csvString += timestamp + ","
            for (let header in table[timestamp]) {
                csvString = csvString + table[timestamp][header] + ",";
            }
            csvString = csvString.substr(0, csvString.length - 1);
            csvString += "\n";
        }

        // create object and download
        const blob = new Blob([csvString], { type: 'text/csv' });

        const url = window.URL.createObjectURL(blob)

        // Creating an anchor(a) tag of HTML 
        const a = document.createElement('a')

        // Passing the blob downloading url  
        a.setAttribute('href', url)

        // Setting the anchor tag attribute for downloading 
        // and passing the download file name 
        a.setAttribute('download', `${videoInfo.beginTimestamp} - ${videoInfo.endTimestamp}.csv`);

        // Performing a download with click 
        a.click()

    }

    const fetchMatchedRecords = async () => {

        const res = await axios.get(`http://localhost:8080/api/records?group=${selectedPirGroup?.id}&begin=${Math.floor(videoInfo.beginTimestamp / 1000)}&end=${Math.floor(videoInfo.endTimestamp / 1000)}`);
        const data = res.data.payload.sort((a: EncodedPirRecord, b: EncodedPirRecord) => (a["timestamp"] - b["timestamp"]));

        setPirRecords(() =>
            data.map((datum: EncodedPirRecord) => new PirRecord({
                id: datum["record_id"],
                pir: datum["pir_id"],
                time: datum["timestamp"],
                vols: datum["voltages"],
            }))
        )


    }

    const onVideoProgress = () => {
        if (videoRef.current) {
            // setSecondsLoaded(state.loaded)
            setSecondsPlayed(videoRef.current.getCurrentTime())
            setSecondsLoaded(videoRef.current.getSecondsLoaded())
            if (videoRef.current.getDuration() !== Infinity) setDuration(videoRef.current.getDuration())
        }
    }

    const appendLabel = (label: ILabel) => {
        if (labelsList.findIndex(element => element.timestamp === label.timestamp) >= 0) {

            setLabelsList(prev => prev.map(element => {
                if (element.timestamp === label.timestamp) return label;
                return element;
            }).sort((a, b) => (a.timestamp - b.timestamp))
            )

        } else {
            setLabelsList(prev => [...prev, label].sort((a, b) => (a.timestamp - b.timestamp)))
        }


    }


    const removeLabel = (timestamp: number) => {
        setLabelsList(prev => prev.filter(element => element.timestamp !== timestamp))
    }

    return <div className="">
        <Label className="text-red-600" value="Time values:" />
        <div className="flex space-x-10 my-2">

            <Label value={`Begin timestamp: ${videoInfo.beginTimestamp} ms`} />

            <Label value={`Current timestamp: ${Math.floor(videoInfo.beginTimestamp + secondsPlayed * 1000)} ms`} />
            {/* <Label value={`Loading : ${secondsLoaded * 1000}`} /> */}
            <Label value={`Duration: ${duration} ms`} />

        </div>

        <div className="flex">
            <div className="w-8/12">
                {<ReactPlayer


                    controls
                    ref={videoRef}
                    url={videoUrl}

                    onProgress={onVideoProgress}

                    // onPlay={() => onVideoProgress}
                    // onDuration={(val) => setDuration(val)}

                    onReady={(player: ReactPlayer) => {
                        console.log(player.getDuration())
                        console.log(player.getDuration() === Infinity)
                        if (player.getDuration() !== Infinity) setDuration(player.getDuration())
                    }}

                />}


            </div>

            <div className="w-4/12">
                <LabelsSelector
                    current={currentLabel}
                    onCurrentLabelChanged={(value) => setCurrentLabel(value)}
                    onSubmit={(currentLabel) => {
                        appendLabel({
                            timestamp: Math.floor((videoInfo.beginTimestamp + secondsPlayed * 1000) / 10) * 10,
                            content: "id" + currentLabel
                        });

                        log(
                            LogType.SUCCESS,
                            "Added a label", 
                            `Timestamp: ${videoInfo.beginTimestamp + ((videoRef.current)? videoRef.current.getSecondsLoaded() : 0) * 1000 }
                             Label: id${currentLabel}`
                        )
                    }}
                />
            </div>

        </div>

        <ServerConnector
            disabled={false}
            onServerAddressChanged={(value: string) => setServerAddress(value)}
            onSelectedPirGroupChanged={(value: IGroup | null) => setSelectedPirGroup(value)}
        />

        {/* label table */}
        <div className="overflow-x-auto">

            <Table hoverable striped>
                <Table.Head>

                    <Table.HeadCell>Timestamp</Table.HeadCell>
                    <Table.HeadCell>Label ID</Table.HeadCell>
                </Table.Head>

                <Table.Body>
                    {
                        labelsList.map(
                            label => (<Table.Row>

                                <Table.Cell>{label.timestamp}</Table.Cell>
                                <Table.Cell>{label.content}</Table.Cell>

                                <Table.Cell>
                                    <Button onClick={() => { 
                                        removeLabel(label.timestamp)
                                        log(LogType.NORMAL,
                                            "Removed a label",
                                            `Timestamp: ${label.timestamp}
                                            Label: ${label.content as string}` 
                                            
                                            
                                        )    
                                    }
                                        }>Delete</Button>
                                </Table.Cell>

                            </Table.Row>))
                    }
                </Table.Body>
            </Table>
        </div>

        {serverAddress && selectedPirGroup && <Button onClick={() => {
            log(LogType.NORMAL, "Creating a CSV record ...", "", selectedPirGroup.description as string)
            create2DTable()

        }}>Xuất CSV</Button>}

        {
            (!serverAddress || !selectedPirGroup) && <Label className="text-red-600 " value="Hãy kết nối với Server và chọn nhóm PIR để xuất csv."/>
        }

    </div>
}


const LabelsSelector = ({
    current,
    onCurrentLabelChanged,
    onSubmit,
}: {
    current: number,
    onCurrentLabelChanged: (value: number) => void,
    onSubmit: (value: number) => void
}) => {

    const PositionMatrix: Array<Array<number>> = [
        [11, 12, 21, 22, 31, 32],
        [13, 14, 23, 24, 33, 34],
        [41, 42, 51, 52, 61, 62],
        [43, 44, 53, 54, 63, 64],
        [71, 72, 81, 82, 91, 92],
        [73, 74, 83, 84, 93, 94]
    ]


    return (
        <div className="m-3">
            {
                PositionMatrix.map((row: Array<number>) =>
                (<>
                    <ButtonGroup >
                        {
                            row.map((id: number) =>
                                <Button color={(current === id) ? "failure" : "info"} className="m-1 w-16" onClick={() => onCurrentLabelChanged(id)}>

                                    {
                                        id
                                    }
                                </Button>
                            )
                        }
                    </ButtonGroup>


                </>

                )
                )
            }

            <div className="flex">

                <Button className={"m-2"} color={(current === 0) ? "failure" : "info"} onClick={() => onCurrentLabelChanged(0)}>
                    0
                </Button>

                <Button className={"m-2 font-bold"} color={"success"} onClick={() => onSubmit(current)}>
                    Thêm
                </Button>
            </div>

        </div>

    )

}

const ServerConnector = ({
    disabled = false,

    onServerAddressChanged,

    onSelectedPirGroupChanged,
    onConnectionChanged,

}: {
    disabled: boolean;

    onServerAddressChanged?: (value: string) => void;
    onSelectedPirGroupChanged?: (value: IGroup | null) => void;
    onConnectionChanged?: (value: boolean) => void;
    // serverConnection: boolean
}) => {

    const [groups, setGroups] = useState<IGroup[]>([])
    const [serverConnection, setServerConnection] = useState<boolean>(false);
    const [serverConnectionMessage, setServerConnectionMessage] = useState<string>("Trying to connect");
    const [selectedPirGroup, setSelectedPirGroup] = useState<IGroup | null>(null)
    const [serverAddress, setServerAddress] = useState<string>("localhost:8080")



    //fire event for parent
    useEffect(() => {
        if (onServerAddressChanged) onServerAddressChanged(serverAddress)
    }, [serverAddress])


    useEffect(() => {
        if (onConnectionChanged) onConnectionChanged(serverConnection)
    }, [serverConnection])

    useEffect(() => {
        if (onSelectedPirGroupChanged) onSelectedPirGroupChanged(selectedPirGroup)
    }, [selectedPirGroup])

    // continuously connect to the server and pir
    useEffect(() => {
        // log(LogType.NORMAL, "Connecting to server and pir device ...", "");
        const id = setInterval(() => {
            checkConnection();
        }, 1000)

        setSelectedPirGroup(null);

        return () => clearInterval(id);
    }, [serverAddress])


    useEffect(() => {

        if (selectedPirGroup === null) return;

        if (selectedPirGroup.pirs !== null) return;
        // console.log("update group ...")
        onSelectedPirGroupUpdated();

    }, [selectedPirGroup])




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

    return (<>
        <div className="flex items-center  space-x-4">

            <FloatingLabel
                style={{ maxWidth: '150px' }}
                variant="filled"
                label="Server Address"
                disabled={disabled}
                value={serverAddress}
                onChange={e => setServerAddress(e.target.value)} />

            <Tooltip content={serverConnectionMessage} className="">
                {serverConnection && <PiPlugsConnectedFill className="scale-150 fill-green-600" />}
                {
                    !serverConnection && <Spinner color="failure" aria-label="Warning spinner example" />
                    // <TbPlugConnectedX className="scale-150 fill-red-400" />
                }
            </Tooltip>



            {/* choosing pir group */}
            <div className="flex items-center space-x-4">
                {/* dropdown choosing group */}

                {!disabled && <Dropdown label={"Chọn nhóm"} size={"xs"} dismissOnClick={true} className="w-64 text-md inline-flex "> {/* Add spacing for visual separation */}
                    {
                        groups.map(group => <Dropdown.Item onClick={() => setSelectedPirGroup(group)}>{`${group.description as string}`}</Dropdown.Item>)
                    }

                </Dropdown>}

                <FloatingLabel variant="standard" label={selectedPirGroup ? selectedPirGroup.description as string : ""} disabled={true} />



            </div>

            {/* alert text */}

            {(!serverConnection) && <p className="text-red-600 text-sm">Đang kết nối ...</p>}
            {serverConnection && !selectedPirGroup && <p className="text-red-600 text-sm">Hãy chọn 1 nhóm PIR ... </p>}

        </div>

    </>)
}
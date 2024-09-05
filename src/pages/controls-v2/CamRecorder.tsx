import { useState, useCallback, useRef, useEffect, LegacyRef } from "react";
import { Dropdown, Button, Badge, Tooltip } from "flowbite-react";
import Webcam from "react-webcam";
import { EventRegister } from "../../ground_services";
import { useLog } from "../../app_states";
import { LogType } from "../../interfaces";
import { CustomLoading } from "../../assets";
import { BiVideoRecording } from "react-icons/bi";

interface Props {
    capturing: boolean;
    setCapturing: React.Dispatch<React.SetStateAction<boolean>>;
    pirOn: () => void;
    pirOff: () => void;
    readyToRecord: boolean;
}

export const CamRecorder = ({ capturing, setCapturing, pirOn, pirOff, readyToRecord }: Props) => {
    const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
    const webcamRef = useRef<HTMLVideoElement | null>(null) as LegacyRef<Webcam> | undefined;
    // createRef<HTMLVideoElement>()

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [videoBegin, setVideoBegin] = useState<number>(0)
    const [recordingTime, setRecordingTime] = useState(0)

    const [_, log] = useLog();

    const now = () => Date.now();

    useEffect(() => {
        if (recordedChunks.length > 0) {

            downloadAvailableRecord();
        }
    }, [recordedChunks])



    const startCapture = useCallback(() => {
        if (readyToRecord == false ) {
            log(LogType.ERROR, "System is not ready to record yet.", "Check your connections to server and PIR device, also choose your PIR group");
            return;
        }

         pirOn();

         mediaRecorderRef.current = new MediaRecorder(webcamRef?.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );

        setRecordedChunks([])
        setCapturing(true);
        setVideoBegin(now());
        mediaRecorderRef.current.start();
        setRecordingTime(0); // Reset recording time
        startInterval(); // Start tracking time
        log(LogType.NORMAL, "Started recording", "");

    }, [webcamRef, setCapturing, mediaRecorderRef, readyToRecord]);

    const startInterval = () => {
        recordIntervalRef.current = setInterval(() => {
            setRecordingTime((prevTime) => prevTime + 1); // Update recording time every second
        }, 1000);


    };

    const handleDataAvailable = useCallback(
        ({ data }: { data: Blob }) => {
            if (data.size > 0) {

                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    useEffect(() => {
        console.log(readyToRecord)
        if (!readyToRecord && capturing) {
            log(LogType.ERROR, "Recording stopped !", "Error happened during recording, may be because of the connection.")
            stopCaptureThenSave();
        }
    },[readyToRecord])

    const cancelCapture = useCallback(() => {
        if (recordIntervalRef.current) clearInterval(recordIntervalRef.current); // Clear interval when stopping

        mediaRecorderRef.current?.pause();
        
        log(LogType.NORMAL, "Stop capturing", "")
        setCapturing(false);
        pirOff();
    }, [mediaRecorderRef, webcamRef, setCapturing, readyToRecord])

    const stopCaptureThenSave = useCallback(() => {
        if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
        mediaRecorderRef.current?.stop();
        setCapturing(false);
        pirOff();
    }, [mediaRecorderRef, webcamRef, setCapturing, readyToRecord]);

    const pauseToSaveThenContinue = () => {
        stopCaptureThenSave();
        startCapture()

    }

    // download available recorded chunks
    const downloadAvailableRecord = async () => {
        try {   
            log(LogType.NORMAL, "Trying to download", "")

            if (recordedChunks.length) {

                const blob = new Blob(recordedChunks, {
                    type: "video/webm"
                });


                var buffers: ArrayBuffer = await blob.arrayBuffer()
                const rc = await window.useGroundServices.invoke(
                    EventRegister.saveRecordedVideo.channel, { name: `${videoBegin}-${now()}`, buffers: buffers }
                )
                console.log(rc)
                log(LogType.SUCCESS, "Saved video successfully", "");

                setRecordedChunks([])

            };
        } catch (e: any) {
            log(LogType.ERROR, "Error saving video", e.message)
        }

    }
    return (
        <div>
            {/* controls buttons */}
            <div className="flex my-3">
                {!capturing &&
                    // <Button.Group className="flex flex-wrap gap-2 ml-3">
                    <Tooltip content="Ghi hình bằng camera">

                        <Button pill gradientDuoTone="purpleToBlue" size={"sm"} onClick={startCapture}>
                            <BiVideoRecording className="scale-125 mr-3" />
                            Bắt đầu
                        </Button>
                    </Tooltip>

                    // </Button.Group>
                }

                {capturing && <Button.Group className="flex flex-wrap gap-1 ml-2 h-4"  >
                    {/* <Button pill disabled={(recordingTime < 30) } size={"sm"} color="success" onClick={pauseToSaveThenContinue}>
                        Lưu và tiếp tục
                    </Button> */}
                    <Button pill color="purple" size={"sm"} onClick={stopCaptureThenSave}>
                        Ngắt và lưu
                    </Button>
                    <Button pill color="failure" size={"sm"} onClick={cancelCapture}  >
                        Hủy
                    </Button>



                </Button.Group>}

                {
                    capturing && <div className="flex mx-2 ">


                        <img src={CustomLoading.default} alt="loading" style={{ height: "3rem" }} />
                        <Badge color="success">Đang ghi... {recordingTime}s</Badge>
                    </div>


                }
            </div>


            <div className="my-2 mr-2">
                <Webcam ref={webcamRef} videoConstraints={{
                    width: 500,
                }} />
            </div>
            {
            recordedChunks.length > 0 && (
                <Button onClick={downloadAvailableRecord}>Lưu record</Button>
            )}

            {/* <Button onClick={() => {
                console.log(recordedChunks)
            }} >check chunks</Button> */}
        </div>
    )
}
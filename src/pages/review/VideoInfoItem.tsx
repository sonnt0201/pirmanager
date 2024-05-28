
"use client";

import { List, Avatar, Button, Tooltip, ButtonGroup } from "flowbite-react";
import { useEffect, useState } from "react";
import { LocalStorageServices, VideoInfo } from "../../models";
import { timestampToDate } from "../../utils";
import { FaPlay } from "react-icons/fa6";
import { LuCircleDashed } from "react-icons/lu";
import { FaTrashAlt } from "react-icons/fa";
import { EventRegister } from "../../ground_services";
import { ReturnCode } from "../../interfaces";
import { MdEdit } from "react-icons/md";

interface Props {
    rawName: string;
    itemKey: number;
    onPlayButtonClicked: () => any;
    onDeleteButtonClicked: () => void;
    onEditButtonClicked: () => void;
    // attachedVideoInfo: VideoInfo;
}



export const VideoInfoItem = ({ rawName, itemKey, onPlayButtonClicked, onDeleteButtonClicked, onEditButtonClicked }: Props) => {

    const [videoInfo, setVideoInfo] = useState<VideoInfo>(new VideoInfo(rawName));

    const [reviewState, setReviewState] = useState<boolean>(false);

    const [display, setDisplay] = useState<boolean>(true);

    const [description, setDescription] = useState<string>("")
    useEffect(() => {
        initReviewState();
        


        // add observer for description changes
        const observerId = LocalStorageServices.addObserver(() => {
            console.log("Updating ...")
            updateDescription();
        });

        return () =>  LocalStorageServices.removeObserver(observerId);

    }, [])

    useEffect(() => {
        updateVideoInfo();
        updateDescription();
    }, [rawName])

    const updateVideoInfo = () => setVideoInfo(new VideoInfo(rawName));

    const updateDescription = () => {
        setDescription(() => LocalStorageServices.getDescription(rawName));
    }

    const initReviewState = () => {
        const value = LocalStorageServices.getReviewState(rawName);
        if (value) {
            setReviewState(() => value);
        }
    }

    const changeReviewState = (state: boolean) => {
        setReviewState(state);
        LocalStorageServices.setReviewState(rawName, state)
    }

   
    return ( <>
        <List.Item className={`p-3 my-2 ${!display ? "hidden" : ""} rounded-xl border-2 ${(reviewState === false) && "border-purple-400"} ${(reviewState === true) && "border-green-500"} ${reviewState?`hover:bg-green-50`:`hover:bg-violet-50`} hover:shadow-lg transition duration-200 ease-out`}>
            <div className={`flex items-center`}>

                {/* phát */}

                <Tooltip content = {`Phát`} style = "auto" >
                    <div className="hover:scale-110 transition duration-100">
                         <Button pill gradientDuoTone="purpleToBlue" onClick={onPlayButtonClicked}>
                    <FaPlay fill="white" />
                    </Button>
                    </div>
                    
                </Tooltip>
               
                <div className="min-w-0 flex-1 space-y-1 mx-3">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        Video {itemKey + 1}
                    </p>
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        Bắt đầu: <span className="text-purple-900">{timestampToDate(videoInfo.beginTimestamp)}</span>  | Kết thúc: <span className="text-purple-900">{timestampToDate(videoInfo.endTimestamp)}</span>

                    </p>

                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                       {description}
                    </p>

                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {`${videoInfo.duration / 1000} giây`} - {reviewState ? "Đã xem" : "Chưa xem"}
                    </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">


                    {(reviewState === false) && <Tooltip content="Đánh dấu là đã xem" style="light" >
                        <Button className="mx-1     hover:scale-110 transition-all duration-100" color="purple" pill onClick={() => changeReviewState(true)}>
                            <LuCircleDashed size={"20"} className="  cursor-pointer"/>
                        </Button>
                    </Tooltip>}

                    {(reviewState === true) && <Tooltip content="Đánh dấu là chưa xem" style="light">
                        <Button className="mx-1     hover:scale-110 transition-all duration-100" color="success" pill onClick={() => changeReviewState(false)}>
                            <LuCircleDashed size={"20"} className="cursor-pointer"/>
                        </Button>
                    </Tooltip>}

                    <Tooltip content="Viết mô tả" style="light">
                        <Button className="mx-1     " color="none" pill onClick={onEditButtonClicked}>
                        <MdEdit fill="#8b5cf6" size={"20"} className="  "/>
                        </Button>
                    </Tooltip>

                    <Tooltip content="Xóa video" style="light">
                        <Button color="mx-1  p-0   " className="" pill onClick={onDeleteButtonClicked}>
                        <FaTrashAlt fill="#dc2626" size={"20"} className=" "/>
                        </Button>
                    </Tooltip>

                </div>
            </div>
        </List.Item>
    </>)

    
}
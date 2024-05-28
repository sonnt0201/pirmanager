"use client";

import { List, Avatar, Label, Modal, TextInput, Button } from "flowbite-react";
import { ReactNode, useEffect, useState } from "react";
import { EventRegister } from "../../ground_services";
import { VideoInfoItem } from "./VideoInfoItem";
import { LocalStorageServices, VideoInfo } from "../../models";
import { ReturnCode } from "../../interfaces";


interface Props {
    // selectedVideoInfo: VideoInfo | null;
    setSelectedVideoInfo: React.Dispatch<React.SetStateAction<VideoInfo | null>>;
}

export const VideosList = ({ setSelectedVideoInfo }: Props) => {


    const [namesList, setNamesList] = useState<string[]>()

    // name in string of the video whose description is editing
    const [editingDescriptionVideoName, setEditingDescriptionVideoName] = useState<string | null>(null)

   

    const [descriptionContent, setDescriptionContent] = useState<string>("");

    useEffect(() => {
        fetchVideoInfo()
    }, [namesList])

   
    useEffect(() => {
        if (!editingDescriptionVideoName) return;
        fetchAvailableDescription();
    },[editingDescriptionVideoName])
   

    const fetchAvailableDescription = () => {
       if (editingDescriptionVideoName) setDescriptionContent(LocalStorageServices.getDescription(editingDescriptionVideoName))
    }

    const fetchVideoInfo = () => window.useGroundServices.invoke(
        EventRegister.videoFileNames.channel,
        0
    ).then((names: string[]) => setNamesList(names))

    // return a function
    const deleteVideo = (videoName: string) => {

        return () => {
            let rc = window.useGroundServices.invoke(
                EventRegister.deleteVideo.channel,
                videoName,
            );

            if (rc === ReturnCode.OK) {
                setNamesList(prev => prev?.filter(name => name !== videoName))
                LocalStorageServices.delete(videoName);
            }
            else return;
        }
    }

    const playVideo = (name: string) => {

        return () => setSelectedVideoInfo( () => {
            return new VideoInfo(name)
        })
    }

    const editDescription = (name: string) => {
        return () =>{ 
            
            setEditingDescriptionVideoName(name)

        }
    }

    const saveNewDescription = () => {
        if (editingDescriptionVideoName ) LocalStorageServices.setDescription(editingDescriptionVideoName, descriptionContent);
        setEditingDescriptionVideoName(null);
    }

    const modalHeader: () => ReactNode = () => {
        if (!editingDescriptionVideoName) return (<></> );

        //    let video =  new VideoInfo(editingDescriptionVideoName);
        const index = namesList?.findIndex(name => name === editingDescriptionVideoName);

        if (index === undefined) return <></>;

        return <>{"Video " + String(index + 1) }</> 

    }

    return <>
        <h2 className="font-bold">Sắp xếp từ mới nhất</h2>
        {editingDescriptionVideoName  }

        <DescriptionEditor
        header={modalHeader()}
            content={descriptionContent}
            onContentChanged={(e) => setDescriptionContent(e.target?.value)}
            show = {editingDescriptionVideoName !== null}
            onCancel={() => setEditingDescriptionVideoName(null)}
            onClose={() => setEditingDescriptionVideoName(null)}
            onSubmit={saveNewDescription}
        />

        <List unstyled className="flex-1 space-y-2 ">
            {
                namesList?.map((name: string, index: number) => <VideoInfoItem
                    onPlayButtonClicked={playVideo(name)}
                    rawName={name}
                    key={index}
                    itemKey={index}
                    onDeleteButtonClicked={deleteVideo(name)}
                    onEditButtonClicked={editDescription(name)}

                />).reverse()
            }
        </List>
    </>
}   


const DescriptionEditor = ({
    header,
    content,
    onContentChanged,
    show,
    onClose,
    onSubmit,
    onCancel
}: {
    header?: ReactNode 
    content?: string | null,
    onContentChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    show?: boolean,
    onClose?: () => void,
    onSubmit?: () => void
    onCancel?: React.MouseEventHandler<HTMLButtonElement> 
}) => {

   

    return (<>
    {
       
        <Modal show={show} size="md" onClose={onClose} popup>
        <Modal.Header className="mt-3 mx-3">
        {header}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white"></h3> */}
            <div>
              <div className="mb-2 block">
                <Label  value="Thêm mô tả" />
              </div>
              <TextInput
                id="des"
                placeholder="Thêm mô tả"
                value={content? content : ""}
                onChange={onContentChanged}

                onKeyUp={(event) => {
                    if (event.key === 'Enter' && onSubmit) 
                        onSubmit();
                    
                      
                }}
                // required
              />
            </div>
       
          
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={onSubmit}>Lưu</Button>
          <Button color="gray" onClick={onCancel}>
            Hủy
          </Button>
        </Modal.Footer>
        
      </Modal>
    }
    </>)
}
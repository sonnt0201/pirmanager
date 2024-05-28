import { useEffect, useState } from "react"
import { EventRegister } from "../../ground_services"
import { VideosList } from "./VideosList";
import { VideoInfo } from "../../models";
import { PlayAndLabel } from "./PlayAndLabel";

export const ReviewPage = () => {


  const [selectedVideoInfo, setSelectedVideoInfo] = useState<VideoInfo | null>(null);



  useEffect(() => {
   
  }, [])


  return <>
    {/* <p>
      This is the page for reviewing
    </p> */}
    <div className="w-10/12 mx-auto">
     {!selectedVideoInfo && <VideosList setSelectedVideoInfo = {setSelectedVideoInfo} />}

     {selectedVideoInfo &&  <PlayAndLabel  videoInfo = {selectedVideoInfo}/>}
    
    </div>

  </>
}
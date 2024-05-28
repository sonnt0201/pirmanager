import { IGroundService } from "../interfaces"
import { deleteVideo } from "./deleteVideo"
import { saveRecordedVideo } from "./saveRecordedVideo"
import { videoFileNames } from "./videoFileNames"
export const EventRegister: {
    [index: string]: IGroundService<any, any>
} = {
    saveRecordedVideo,
    videoFileNames,
    deleteVideo
}


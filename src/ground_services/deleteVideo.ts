import { IGroundService, ReturnCode } from "../interfaces";

export const deleteVideo : IGroundService<string, ReturnCode> = {
    channel: "delete-video",
    executer: (_, videoName) => {
        
        try {
            var fs = require("fs");
               fs.unlinkSync(`./videos/${videoName}.webm`);
                return ReturnCode.OK;
        } catch (e) {
            return ReturnCode.FAILED;
        }
     


    }
}
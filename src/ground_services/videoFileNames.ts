import { IGroundService, IVideoInfo } from "../interfaces";
import { VideoInfo } from "../models/VideoInfo";



export const videoFileNames: IGroundService<any, string[]> = {
    channel: "video-file-names",
    executer: function (_, __): string[] {
        const fs = require("fs");
        let out: string[] = [];
        fs.readdirSync("./videos").forEach((file: string) => {
            if (file.endsWith(".webm")) {
               out.push(file.slice(0, -5));
            }
         })

        return out;
    }
}

import { IGroundService } from "../interfaces/IGroundService";
import { ReturnCode } from "../interfaces/ReturnCode";


interface VideoInfo {
    name: string;
    buffers: ArrayBuffer;
}

export const saveRecordedVideo: IGroundService<VideoInfo, ReturnCode> = {
    channel: "save-recorded-video",
    
    executer: (_, videoInfo) => {
        var fs = require("fs");

        // create folder if not exist
        if (!fs.existsSync('./videos')) {
            fs.mkdirSync('./videos');
        }

        const stream = fs.createWriteStream(`./videos/${videoInfo.name}.webm`);
        const byteArray = new Uint8Array(videoInfo.buffers);
        let offset = 0;
        const writeChunk = () => {
            if (offset >= byteArray.length) return stream.end();
            const chunk = byteArray.slice(offset, offset + 1024); // Write in chunks of 1024 bytes
            offset += chunk.length;
            stream.write(chunk, (err: any) => {
                if (err) {
                    console.error(err);
                    stream.end();
                } else {
                    writeChunk();
                }
            });
        };
        writeChunk();
        return ReturnCode.OK;
    }
}


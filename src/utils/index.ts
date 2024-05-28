import dayjs from "dayjs";

export const timestampToDate: (timestamp: number) => string = (timestamp: number) =>{
    return dayjs(timestamp).format("HH [giờ] mm [phút], [ngày] DD/MM/YYYY");

}
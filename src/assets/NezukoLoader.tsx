import { Badge } from "flowbite-react"
import { CustomLoading } from "."
export const NezukoLoader = ({ message }: {message: String}) => {

    return <div>
        <img src={CustomLoading.default} alt="loading" style={{ height: "3rem" }} />
        <Badge color="success"> {message} </Badge>

    </div>
}
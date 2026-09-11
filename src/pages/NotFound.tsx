import {Link} from "react-router-dom";

export default function NotFound(){
    return (
        <div>
            <p className="text-white">
            Page not found
            </p>
            <Link to="/games">Go back</Link>
        </div>
    )
}
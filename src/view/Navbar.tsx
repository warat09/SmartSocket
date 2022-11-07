import { Link } from "react-router-dom";
const Navbar :React.FC = () =>{
    return(
        <>
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/node">Node</Link></li>
                <li><Link to="/asset">Asset</Link></li>
                <li><Link to="/createasset">CreateAsset</Link></li>
            </ul>
        </>
    )
};
export default Navbar

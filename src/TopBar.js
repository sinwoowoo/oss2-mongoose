import { useSelector } from "react-redux";
import { selectUserDetails } from "./features/user/userSlice";

function TopBar() {
    const userDetails = useSelector(selectUserDetails);

return (
        <header className='w-full bg-light'>
            <div className='px-4 py-2 flex justify-between items-center'>
                <strong>Todo manager</strong>
                <span>
                    {
                        userDetails !== ''
                        ? <span>Welcome, {userDetails} <a href="">Logout</a></span>
                        : <a href="/.auth/login/github">Login</a>
                    }
                </span>
            </div>
        </header>
    )
}

export default TopBar;

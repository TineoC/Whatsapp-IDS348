import { GoogleLogout } from 'react-google-login'
const myId = '506098763641-1m2pfrsglfatggtass4uja8mdjkobd2j.apps.googleusercontent.com';

function Logout() {
    
    const onLogoutSuccess = (res) => {
    console.log("Ha cerrado sesión exitosamente", res.profileObj)
    }

    return (
        <div id='SignOutButton'>
          <GoogleLogout 
            clientId={myId}
            buttonText='Logout'
            onLogoutSuccess={onLogoutSuccess}
          />
        </div>
    )
}

export default Logout
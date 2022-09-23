import { GoogleLogin } from 'react-google-login'

const myId = '506098763641-1m2pfrsglfatggtass4uja8mdjkobd2j.apps.googleusercontent.com';

function Login() {
    const onSuccess = (res) => {
        console.log("Ha iniciado sesión exitosamente", res.profileObj)
    }
      
    const onFailure = (res) => {
        console.log("Ha ocurrido un error", res)
    }

    return (
          <div id='SignInButton'>
            <GoogleLogin 
              clientId={myId}
              buttonText="Log In"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single-host-origin'}
              isSignedIn={true}
            />
          </div>
      );
}

export default Login
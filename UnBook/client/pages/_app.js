import { UserProvider } from "../context";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";
import Register from './register';

function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <div>
                <link rel="stylesheet" href="/css/styles.css" />
            </div>
            {Component.name !== 'Login' && <Nav />}
            <ToastContainer position="top-center" />
            <Component {...pageProps} />
        </UserProvider>
    )
}

export default MyApp;
import { Client } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useState } from "react";
import Account from "../interface/master-data/Account";
import { NotifyContext } from "./NotifyContext";

interface SocketProviderProps {
    children: React.ReactNode;
}

const SocketContext = createContext<Client | null>(null);

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {

    const [socket, setSocket] = useState<Client | null>(null);
    const { dispatch } = useContext(NotifyContext);
    const myUser: Account = JSON.parse(localStorage.getItem("user") as string);

    useEffect(() => {

        if (socket) return;

        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            debug: function (str) {
                console.log(str);
            },
            onConnect: () => {
                setSocket(stompClient);
                console.log('Kết nối socket thành công!');

                stompClient.subscribe(`/private/friend-request-receive/${myUser.user.userId}`, (message) => {
                    console.log(message);
                    dispatch({ type: "info", payload: message.body });
                });

            },
            onDisconnect: () => {
                setSocket(null);
                console.log('Đã ngắt kết nối socket!');
            },
            onStompError: (frame) => {
                console.error(frame);
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [dispatch, myUser.user.userId]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}


export default SocketProvider;
export { SocketContext };
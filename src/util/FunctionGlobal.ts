import axios from "axios";
import { NotifyAction } from "../context/NotifyContext";
import { MyJwtIsExpired } from "./MyJwtDecode";
import { NavigateFunction } from "react-router";

function formatDateTimeChatBubble(dateStr: string): string {
    const date = new Date(dateStr);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function checkErrorResponse(error: unknown, dispatch: React.Dispatch<NotifyAction>): void {
    if (axios.isAxiosError(error) && error.response) {
        dispatch({ type: "error", payload: error.response.data.message });
    } else {
        dispatch({ type: "error", payload: "Đang có lỗi xảy ra, vui lòng kiểm tra lại kết nối" });
    }
}

async function checkJWT(dispatch: React.Dispatch<NotifyAction>, navigate: NavigateFunction): Promise<boolean> {
    if (await MyJwtIsExpired() === true) {
        dispatch({ type: "error", payload: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" });
        navigate("/auth/login");
        return true;
    }
    return false;
}

export { formatDateTimeChatBubble, formatDate, checkErrorResponse, checkJWT };
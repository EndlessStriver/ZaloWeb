import { jwtDecode } from "jwt-decode";
import MyJwtPayload from "../interface/MyJwtPayload";
import { RefreshTokenApi } from "../service/AuthService";

const MỵJwtDecode = (token: string): MyJwtPayload => {
    return jwtDecode(token) as MyJwtPayload;
}

const MyJwtIsExpired = async (): Promise<boolean> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return true;
    }
    const payload = jwtDecode(token) as MyJwtPayload;
    if (payload.exp < Date.now() / 1000) {
        try {
            const response = await RefreshTokenApi();
            localStorage.setItem('accessToken', response.accessToken);
            return false;
        } catch (error) {
            console.log(error);
            return true;
        }
    }
    return false;
}

const MyJwtGetSubject = (): string | null => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return null;
    }
    const payload = jwtDecode(token) as MyJwtPayload;
    return payload.sub;
}

export default MỵJwtDecode;
export { MyJwtIsExpired, MyJwtGetSubject };
import { jwtDecode } from "jwt-decode";
import MyJwtPayload from "../interface/MyJwtPayload";

const MỵJwtDecode = (token: string): MyJwtPayload => {
    return jwtDecode(token) as MyJwtPayload;
}

const JwtIsExpired = (): boolean => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return true;
    }
    const payload = jwtDecode(token) as MyJwtPayload;
    return payload.exp < Date.now() / 1000;
}

const JwtGetSubject = (): string | null => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return null;
    }
    const payload = jwtDecode(token) as MyJwtPayload;
    return payload.sub;
}

export default MỵJwtDecode;
export { JwtIsExpired, JwtGetSubject };
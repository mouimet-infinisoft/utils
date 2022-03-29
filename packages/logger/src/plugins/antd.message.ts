import { message as show } from 'antd';
import { LOGLEVEL, Plugin } from "../provider";

export const antdMessagePlugin: Plugin = ({ message, level }) => {

    switch (level) {
        case LOGLEVEL.ERROR:
            return show.error(message);
            break;
        case LOGLEVEL.WARN:
            return show.warn(message);
            break;
        case LOGLEVEL.SUCCESS:
            return show.success(message);
            break;
        case LOGLEVEL.CUSTOM:
            return show.loading(message);
            break;
        default:
            return show.info(message);
            break;
    }
};

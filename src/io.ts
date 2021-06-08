
import {io, Socket} from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import * as constants from './constants';

const socket = io(constants.url)

export {socket};
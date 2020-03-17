import { IRawPicture } from './IRawPicture';

export interface IRawObject {
    id: string,
    name: string,
    script: string,
    objectType: string,
    rotateMethod: string,
    scene: string,
    sprite:{ pictures:IRawPicture[], sounds:any[] },
    text: string,
    lock: boolean,
    entity: any
}
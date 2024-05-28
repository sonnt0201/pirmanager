import { IVideoLocalData } from "../interfaces";
import { v4 as uuidv4 } from 'uuid';

class LocalStorageServicesClass {

    private _observers: Array<{ 
        id: string;
        callback: () => void 
    }> = [];

    
    // add an observer to listen value changing. Return an id (string) of that observer.
    public addObserver(callback: () => void): string {
        const id = uuidv4();
        this._observers.push({
            id: id,
            callback
        });

        // console.log(this._observers)
        return id;
    }

    public removeObserver(observerId: string) {
        let out = this._observers.filter(o => o.id !== observerId);

        // console.log("observer removed. ")

        this._observers = out;


    }

    private _notifyObservers() {
        // console.log("notifying ...")
        this._observers.forEach(o => o.callback())
    }

    private initLocalData(name: string) {
        const initObject: IVideoLocalData = {
            reviewState: false,
            description: ""
        }

        localStorage.setItem(name, JSON.stringify(initObject));
        this._notifyObservers();
    }

    

    public setReviewState(name: string, value: boolean) {


        if (!localStorage.getItem(name)) this.initLocalData(name);


        let current: IVideoLocalData = JSON.parse(localStorage.getItem(name) as string);

        current = { ...current, reviewState: value };

        localStorage.setItem(name, JSON.stringify(current));

        this._notifyObservers();

    }

    public setDescription(name: string, value: string) {

        if (!localStorage.getItem(name)) this.initLocalData(name);
        
        let current: IVideoLocalData = JSON.parse(localStorage.getItem(name) as string);

        current = { ...current, description: value };

        localStorage.setItem(name, JSON.stringify(current));

        this._notifyObservers();

    }

    public getReviewState(name: string): boolean {
        if (!localStorage.getItem(name)) this.initLocalData(name);

        let current: IVideoLocalData = JSON.parse(localStorage.getItem(name) as string);

        return current.reviewState
    }

    public getDescription(name: string): string {
        if (!localStorage.getItem(name)) this.initLocalData(name);
         let current: IVideoLocalData = JSON.parse(localStorage.getItem(name) as string);
        
         return current.description;
    }

    public delete(name: string) {
        if (!localStorage.getItem(name)) return;

        localStorage.removeItem(name);

        this._notifyObservers();
    }

};

export const LocalStorageServices = new LocalStorageServicesClass();
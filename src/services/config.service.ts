import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConfigService
{
    public readonly baseUrl: string;
    public readonly authToken: string | null;

    constructor()
    {
        const location = window.location;
        this.baseUrl = localStorage.getItem("baseUrl") ?? `${location.protocol}//${location.host}`;
        this.authToken = localStorage.getItem("token");
    }
}

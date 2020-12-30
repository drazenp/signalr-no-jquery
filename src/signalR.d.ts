/// <reference types="@types/signalr" />

export function hubConnection(url?: string, options?: SignalR.Hub.Options): SignalR.Hub.Connection;

export function сonnection(url: string, queryString?: string | Object, logging?: boolean): SignalR.Connection;

export function signalR(url: string, queryString?: string | Object, logging?: boolean): SignalR.Connection;

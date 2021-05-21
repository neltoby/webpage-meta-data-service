
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export abstract class IQuery {
    abstract url(uri: string): Url | Promise<Url>;
}

export class Url {
    title?: string;
    description?: string;
    image?: string;
}

export class Config {

    public static PROVIDER: 'opentok' | 'vonage' | undefined;
    public static APPLICATION_ID: string | undefined;
    public static OPENTOK_API_KEY: string | undefined;

    public static SERVER ={
        dev: true,
        local: 'http://localhost:3000',
        remote: 'http://localhost:3000'
    }
    public static VIDEO = {
        OPENTOK_API_KEY: null,          //  comes from the server
        VONAGE_APPLICATION_ID: null,    //  comes from the server
    }


    public static VONAGE_SERVER = {
        dev: false,
        remote: 'https://1fbc3a1b-f169-45a4-bcf6-74abb8104cc8-00-1h3u4gg3l424z.worf.replit.dev',

    }




}
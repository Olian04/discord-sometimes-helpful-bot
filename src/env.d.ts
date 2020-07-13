// tslint:disable-next-line: no-namespace
declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * The secret token provided by discord for accessing the bot api.
     * @see https://discord.com/developers/applications
     */
    DISCORD_SECRET: string;

    /**
     * A serialized json object of the service account config provided by firebase.
     * @see https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk
     */
    FIREBASE_SERVICE_ACCOUNT: string;

    /**
     * The deployment enviorment is either "development" or "production".
     * This controls log levels, debug features, as well as the database instance that will be used.
     */
    DEPLOY_ENVIRONMENT: 'development' | 'production';

    /**
     * The version tag that will be used as the root of the database to prevent data loss or collisions when migrating between version.
     * Ex: v4, or v4-beta
     */
    DATABASE_VERSION: string;
  }
}
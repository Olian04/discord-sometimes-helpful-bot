export interface IFirebaseServiceAccount {
  type: 'service_account';
  project_id: string;
  [k: string]: string;
}

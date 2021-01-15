export interface AccontType {
    IDX: number;
    ACCOUNT_NAME: string;
    DATE: string;
    ID: string;
    PASSWORD: string;
    OAUTH_SERVICE_NAME: string;
    SORT_ORDER: number;
  }
  export interface ServiceType {
    GRP_IDX: number;
    SERVICE_IDX: number;
    SERVICE_NAME: string;
    SORT_ORDER: number;
  }
  export interface GroupType {
    GRP_IDX: number;
    GRP_NAME: string;
    SORT_ORDER: number;
  }
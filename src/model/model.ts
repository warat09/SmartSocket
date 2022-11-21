export interface Assets {
    id_assets?: number;
    name_assets?: string;
    expire_hour?: number;
    status_assets?: string;
    maintenance?: boolean;
    date_assets?: Date;
    //   children?: React.ReactNode;
  }

  export interface Node {
    mac_address?: string;
    ip?: string;
    status_node?: string;
    date_node?: Date;
    //   children?: React.ReactNode;
  }
  export interface NodeSelection {
    Node_mac_address?: string;
    Node_ip?: string;
    Node_date_node?: Date;
    Node_status_node?:  string;
  }
  export interface Matching{
    Asset_name_assets?: string;
    Match_mac_address?: string;
    Match_status?: string;
    // date_match?: Date;
    Match_active_datetime?: Date;
    Match_room?: string;
    Match_floor?:string;
  }
  export interface UserMatch {
    Asset_name_assets?: string;
    UserMatch_room?: string;
    UserMatch_floor?: string;
    UserMatch_sum_used_time?: string;
    UserMatch_datetime?:string;
    UserMatch_status?:string;
  }
  export interface MatchRentSelection {
    Asset_name_assets?: string;
    Match_id_match?: number;
  }
  export interface Transection{
    Asset_name_assets?: string;
    Match_mac_address?: string;
    Transection_status_action?: string;
    Transection_time_used?: string;
    Transection_time_update?: string;
    Transection_on_date?:string;
    Transection_off_date?:string;
  }
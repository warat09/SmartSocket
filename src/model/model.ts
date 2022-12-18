export interface Dashboards {
    asset?: number
    match?: number
    matchapprove?: number
    matchnotrent?: number
    matchrent?: number
    node?: number
    user?: number
}
export interface Assets {
    id_assets?: number;
    name_assets?: string;
    expire_hour?: number;
    status_assets?: string;
    maintenance?: boolean;
    date_assets?: Date;
    //   children?: React.ReactNode;
  }
  export interface MatchAsset{
    Assets_name_assets?:string;
    Assets_id_assets?:string;
    Assets_expire_hour?:number
    Assets_status_assets?: string;
    Assets_maintenance?: boolean;
    Assets_date_assets?: Date;
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
    Match_status_match?: string;
    Match_remain_time?:number
    Match_active_datetime?: Date;
    Match_room?: string;
    Match_floor?:string;
  }
  export interface Approve {
    UserMatch_id_user_match?: number;
    Asset_name_assets?: string;
    UserMatch_room?: string;
    UserMatch_floor?: string;
    UserMatch_description?: string;
    UserMatch_datetime?:string;
    User_name?:string;
    User_surname?:string;
    User_username?:string;
    UserMatch_status_user_match?:string;
  }
  export interface UserMatch {
    Asset_name_assets?: string;
    UserMatch_room?: string;
    UserMatch_floor?: string;
    UserMatch_sum_used_time?: string;
    UserMatch_datetime?:string;
    UserMatch_status_user_match?:string;
  }
  export interface MatchRentSelection {
    Asset_name_assets?: string;
    Match_id_match?: number;
  }
  export interface Transaction{
    Asset_name_assets?: string;
    Match_mac_address?: string;
    Transaction_status_transaction?: string;
    Transaction_time_used?: string;
    Transaction_time_update?: string;
    Transaction_on_date?:string;
    Transaction_off_date?:string;
  }
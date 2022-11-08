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
    id_matching?: number;
    MAC_address?: string;
    id_assets?: number;
    status_matching?: string;
    date_match?: Date;
    remain_time?: number;
  }
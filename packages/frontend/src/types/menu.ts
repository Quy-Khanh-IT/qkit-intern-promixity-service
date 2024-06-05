export interface SidebarOption {
  key: string
  label: string
}

export interface SidebarOptions {
  [routeAlias: string]: SidebarOption
}

export interface SidebarOption {
  key: string
  label: string
}

export interface SidebarOptions {
  [routeAlias: string]: SidebarOption
}

export interface SidebarOptionsRender extends SidebarOption {
  icon: React.ReactNode
}

export type AdminProps = {
  title: string,
  adminSidebar: AdminSidebar[];
}

export type AdminSidebar = {
    path: string,
    title: string,
    icon: React.ReactNode

}
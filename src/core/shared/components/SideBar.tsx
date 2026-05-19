import { NavLink } from "react-router-dom"
import type { AdminProps } from "../../modules/admin/types/types"



function SideBar({title , adminSidebar} :AdminProps) {

  return (
    <aside className="bg-red-500 w-1/6">

      <div>
        <h3>{title}</h3>
        <span>Icon</span>
      </div>

      <ul>
        {adminSidebar.map(item =>(
          <li key={item.path}>
            <NavLink to={item.path}>
              {item.title}
              <span>{item.icon}</span>
            </NavLink>
          </li>
        ))}
      </ul>

    </aside>
  )
}

export default SideBar
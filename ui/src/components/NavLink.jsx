import React from 'react'

function NavLink({active, title}) {
  return (
    <div
      className={`${
        active === title
          ? 'font-bold text-md text-gray-800 md:px-4 md:pt-3 md:pb-4 pb-1 items-center justify-center flex cursor-pointer  hover:text-black smooth'
          : 'text-md text-gray-800 md:px-4 md:pt-3 md:pb-4 pb-1 items-center justify-center flex cursor-pointer  hover:text-black smooth'
      }`}
    >
      {title}
    </div>
  )
}

export default NavLink

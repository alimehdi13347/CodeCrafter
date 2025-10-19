import React, { useEffect,useState } from 'react'
import { HiSun } from 'react-icons/hi'
import { FaUser } from 'react-icons/fa'
import { RiSettings3Fill } from 'react-icons/ri'


const Navbar = () => {
  const [whitetheme, setWhiteTheme] = useState(false);

const toggletheme = () => {
  setWhiteTheme((prev) => !prev);
};

useEffect(() => {
  document.body.style.backgroundColor = whitetheme ? "#ffffff" : "#090908";
}, [whitetheme]);
  return (
    <div className="nav flex items-center justify-between px-[100px] border-b-[1px] h-[90px] border-gray-800 ">
      <div className="logo ">
        <h3 className='text-[28px] font-[700] sp-text'>CodeCrafter</h3>
      </div>
      <div className="icons flex gap-[20px]">
        <div className="icon" onClick={toggletheme}><HiSun /></div>
        <div className="icon"><FaUser /></div>
        <div className="icon"><RiSettings3Fill /></div>
      </div>
    </div>
  )
}

export default Navbar
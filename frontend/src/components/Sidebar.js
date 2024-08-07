import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";

// const Nav = styled.div`
//     background: #ffffff;
//     height: 80px;
//     display: flex;
//     justify-content: flex-start;
//     align-items: center;
// `;

// const NavIcon = styled(Link)`
//     margin-left: 2rem;
//     font-size: 2rem;
//     height: 80px;
//     display: flex;
//     justify-content: flex-start;
//     align-items: center;
// `;

const SidebarNav = styled.nav`
    background: #ffffff;
    width: 250px;
    height: 100vh;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
    transition: 350ms;
    z-index: 10000;
`;

const SidebarWrap = styled.div`
    width: 100%;
`;

// const Sidebar = () => {
//     const [sidebar, setSidebar] = useState(false);

//     const showSidebar = () => setSidebar(!sidebar);

//     return (
//         <>
//             <IconContext.Provider value={{ color: "#7392a6" }}>
//                 <Nav>
//                     <NavIcon to="#">
//                         <FaIcons.FaBars
//                             onClick={showSidebar}
//                         />
//                     </NavIcon>
//                 </Nav>
//                 <SidebarNav sidebar={sidebar}>
//                     <SidebarWrap>
//                         <NavIcon to="#">
//                             <AiIcons.AiOutlineClose
//                                 onClick={showSidebar}
//                             />
//                         </NavIcon>
//                         {SidebarData.map((item, index) => {
//                             return (
//                                 <SubMenu
//                                     item={item}
//                                     key={index}
//                                 />
//                             );
//                         })}
//                     </SidebarWrap>
//                 </SidebarNav>
//             </IconContext.Provider>
//         </>
//     );
// };

const Sidebar = ({ sidebar, toggleSidebar }) => {
    return (
        <>
            <IconContext.Provider value={{ color: "#7392a6" }}>
                <SidebarNav sidebar={sidebar}>
                    <SidebarWrap>
                        <NavIcon to="#">
                            <AiIcons.AiOutlineClose onClick={toggleSidebar} />
                        </NavIcon>
                        {SidebarData.map((item, index) => {
                            return <SubMenu item={item} key={index} />;
                        })}
                    </SidebarWrap>
                </SidebarNav>
            </IconContext.Provider>
        </>
    );
};

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export default Sidebar;

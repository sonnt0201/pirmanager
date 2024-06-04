
"use client";

import { Button, Navbar } from "flowbite-react";
import { useLocation } from "react-router-dom";
import { IStyles } from "./interfaces";

interface Page {
  title: string;
  link: string
}

const styles : IStyles = {
  "active-page": "color-blue-600"
}

export function NavBar() {

  const location = useLocation()

  const pages: Page[] = [
    {
      title: "Điều khiển",
      link: "",
    },
    {
      title: "Điều khiển",
      link: "/",
    },

    {
      title: "Thông báo",
      link: '/log',
    }

  ]

  return (
      <div className="mr-[15%]">
          <Navbar fluid rounded>
      <Navbar.Brand href="/">
        {/* <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          PIR Manager
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        
        <Navbar.Toggle />
      </div>
      {/* <div className="bg-red-400 mx-auto"> */}
         <Navbar.Collapse>
        <Navbar.Link href="/" active = {location.pathname === "/"}>
          Điều khiển
        </Navbar.Link>

        {/* <Navbar.Link href="/log">Thông báo</Navbar.Link>
        <Navbar.Link href="/test">Test</Navbar.Link> */}
        <Navbar.Link href= "/review" active = {location.pathname === "/review"}>Gán nhãn vị trí</Navbar.Link>

      </Navbar.Collapse>
      {/* </div> */}
     
    </Navbar>
      </div>
    
   
    
  );
}

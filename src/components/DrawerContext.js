// import React, { createContext, useContext, useEffect, useState } from "react";

// const { ipcRenderer } = window.require("electron");

// const DrawerContext = createContext();

// export function DrawerProvider({ children }) {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const checkDrawerStatus = async () => {
//     const { isOpen } = await ipcRenderer.invoke("is-drawer-open");
//     setIsDrawerOpen(isOpen);
//     return isOpen;
//   };

//   useEffect(() => {
//     checkDrawerStatus();

//     ipcRenderer.on("drawer-closed", () => {
//       setIsDrawerOpen(false);
//     });

//     return () => {
//       ipcRenderer.removeAllListeners("drawer-closed");
//     };
//   }, []);

//   return (
//     <DrawerContext.Provider
//       value={{ isDrawerOpen, setIsDrawerOpen, checkDrawerStatus }}
//     >
//       {children}
//     </DrawerContext.Provider>
//   );
// }

// export function useDrawer() {
//   return useContext(DrawerContext);
// }

import React, { createContext, useContext, useEffect, useState } from "react";

const { ipcRenderer } = window.require("electron");

const DrawerContext = createContext();

export function DrawerProvider({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const checkDrawerStatus = async () => {
    const { isOpen } = await ipcRenderer.invoke("is-drawer-open");
    setIsDrawerOpen(isOpen);
    return isOpen;
  };

  useEffect(() => {
    checkDrawerStatus();
  }, []);

  return (
    <DrawerContext.Provider
      value={{ isDrawerOpen, setIsDrawerOpen, checkDrawerStatus }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  return useContext(DrawerContext);
}

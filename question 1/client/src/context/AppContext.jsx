import { createContext, useContext, useState } from 'react'


const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);



const AppContextProvider = ({children}) => {
    const [count, setCount] = useState(0);

    const values={
        count,
        setCount
    }

  return (
    <AppContext.Provider value={values}>
        {children}
    </AppContext.Provider>)
}

export default AppContextProvider;
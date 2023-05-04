import { createContext, useState } from "react";

export const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => 
{
	const [globalState, setGlobalState] = useState({
		saveGameSemuanya: [],
		isPlay: false,
	});


	

	return (
		<GlobalContext.Provider value={[globalState, setGlobalState]}>
			{children}
		</GlobalContext.Provider>
	);
};

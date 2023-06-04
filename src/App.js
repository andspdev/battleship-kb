import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GlobalProvider } from "./States/GlobalProvider";

import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Assets/css/styles.css'


// Load Component
import IndexComponent from './Component/IndexComponent'
import PlayComponent from './Component/PlayComponent'
import KelompokComponent from './Component/KelompokComponent'



function App()
{
	return (
		<GlobalProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<IndexComponent/>}/>
					<Route path="/play" element={<PlayComponent/>}/>
					<Route path="/kelompok-8" element={<KelompokComponent/>}/>
					<Route path='*'></Route>
				</Routes>
			</BrowserRouter>
		</GlobalProvider>
	);
}

export default App;
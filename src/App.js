import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./States/GlobalProvider";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Assets/css/styles.css";

// Load Component
import IndexComponent from "./Component/IndexComponent";
import PlayComponent from "./Component/PlayComponent";
import KelompokComponent from "./Component/KelompokComponent";
import { useEffect, useState } from "react";

function App() 
{
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => 
	{
		const handleResize = () => 
		{
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);


	if (windowSize.width < 768)
	{
		return (
			<div className="menang-kalah">
				<div className="content">
					<h1>Resolusi Tidak Didukung!</h1>
					<p>Pastikan resolusi pada layar anda minimal lebarnya 768px.</p>
				</div>
			</div>
		);
	}
	else
	{
		return (
			<GlobalProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<IndexComponent />} />
						<Route path="/play" element={<PlayComponent />} />
						<Route path="/kelompok-8" element={<KelompokComponent />} />
						<Route path="*"></Route>
					</Routes>
				</BrowserRouter>
			</GlobalProvider>
		);
	}
}

export default App;

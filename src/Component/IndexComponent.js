import { Link } from "react-router-dom";
import { Component } from "react";
import { GlobalContext } from "../States/GlobalProvider";

class IndexComponent extends Component
{
	static contextType = GlobalContext;

	handlePlayGame = () =>
	{
		const [, setGlobalState] = this.context;

		setGlobalState((prevState) => ({
			...prevState,
			isPlay: true
		}));
	}

	render()
	{
		return (
			<>
				<div className="index-message">
					<h1>BattleshipIndo</h1>

					<div className="mt-1">
						<div className="desc">
							Klik tombol dibawah untuk memainkannya.
						</div>

						<div className="mt-4 pt-2">                   
							<Link to="/play" className="btn btn-main" onClick={() => this.handlePlayGame()}><i className="fa-solid fa-ship"></i> Main Sekarang!</Link>
						</div>
					</div>
				</div>

				<div className="footer-index">
					Copyright &copy; 2023 - Dibuat oleh <Link to="/kelompok-8"><i>Kelompok 8</i></Link>
				</div>
			</>
		)
	}
}

export default IndexComponent;
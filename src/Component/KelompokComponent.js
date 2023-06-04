import { Link } from "react-router-dom"

const KelompokComponent = () =>
{
    return(
        <div className="container mt-5">

            <div className="menu-back mb-5">
                <Link className="back-button" to="/">
                    <i className="fa-solid fa-arrow-left"></i> <span>Kembali</span>
                </Link>
            </div>

            <div className='menang-kalah'>
                <div className='content'>
                    <h1>Kelompok 8</h1>
                    <p>Dibuat pada tanggal 04 Mei 2023 dan selesai pada tanggal 04 Mei 2023. Berikut nama anggota kelompok:</p>

                    <div className="mt-4 text-start">
                        <ul>
                            <li>C14210004 - Andreas Pandu P</li>
                            <li>C14210176 - Joy Immanuel K</li>
                            <li>C14210007 - Steven Hariyadi</li>
                            <li>C14210182 - Mouritus Huangtara M</li>
                        </ul>
                    </div>

                    <div className="mt-5 text-center">
                        Kecerdasan Buatan / B - 2023
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KelompokComponent
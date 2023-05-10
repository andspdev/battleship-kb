import { Component } from 'react'
import { GlobalContext } from "../States/GlobalProvider";
import { Link } from 'react-router-dom';


class PlayComponent extends Component 
{
    static contextType = GlobalContext;

    


    constructor(props)
    {
        super(props)

        this.state = {
            // Pengaturan game
            is_play_game: false,
            giliran_player: 'player',


            // Player
                // Kumpulan rotasi kapal
                rotasiKapalInduk: 'horizontal',
                rotasiKapalPerang: 'horizontal',
                rotasiKapalSelam: 'horizontal',
                
                // Keperluan Atur Papan
                board_game_size: 8,
                panjang_kapal: [5, 3, 1],
                posisi_kapal: [],
                posisi_kapal_id: [],

                //  Hide Kapal
                hideKapalInduk: false,
                hideKapalPerang: false,
                hideKapalSelam: false,

            // AI
            posisi_kapal_ai: [],
            posisi_kapal_ai_id: [
                ['s', null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, 'd', null, 'c', 'c', 'c', 'c', 'c'],
                [null, 'd', null, null, null, null, null, null],
                [null, 'd', null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
            ],

        }
    }


    componentDidMount()
    {
        document.title = 'Main Battleship'
		const [globalState] = this.context;


        setTimeout(() =>
        {
            if (!globalState.isPlay)
                window.location.href = '/'
        }, 500);

        

        if (globalState.isPlay)
        {
            // BUat papan gamenya
            const state_class = this.state

            
            let posisi_kapal = [];
            let board_array = Array.from({ length: state_class.board_game_size }, () =>
                Array.from({ length: state_class.board_game_size }, () => null)
            );



            // Pilih semua kapal yang ada
            const kumpulan_kapal = document.querySelectorAll('.ship')
            if (kumpulan_kapal)
            {
                kumpulan_kapal.forEach((kapal) =>
                {
                    if (kapal)
                    {
                        // Ketika kapalnya didrag
                        kapal.addEventListener('dragstart', function()
                        {
                            this.classList.add('dragging');
                        });


                        // Ketika kapalnya didrop
                        kapal.addEventListener('dragend', function()
                        {
                            this.classList.remove('dragging');
                        });
                    }
                });
            }


            // Deteksi semua cell table yang ada
            const papan_main = document.getElementById("papan-main");
            if (papan_main)
            {
                const list_cell = papan_main.querySelectorAll('.cell');

                if (list_cell)
                {
                    list_cell.forEach((cell) =>
                    {
                        // Kalau kursor berada dicell yang mau didrop
                        cell.addEventListener('dragover', function(e)
                        {
                            e.preventDefault();
                        });


                        // Kalau posisi cellnya udh di dropkan
                        cell.addEventListener('drop', () =>
                        {
                            const kapal = document.querySelector(".dragging");
                            const row = cell.parentNode.rowIndex;
                            const col = cell.cellIndex;

                            const orientasi = kapal.classList.contains('horizontal') ? 
                            'horizontal' : 'vertical';

                            
                            // Dapatin panjang dari kapalnya
                            const kapal_num = parseInt(kapal.getAttribute('data-id'))
                            const length_kapal = state_class.panjang_kapal[kapal_num - 1];
                            

                            //  Cek kalau panjangnya  sesuai atai tidak
                            if (state_class.panjang_kapal.includes(length_kapal))
                            {
                                let isTabrakan = false;
                                

                                for (let i = 0; i < length_kapal; i++) 
                                {
                                    if (
                                        orientasi === "horizontal" &&
                                        (col + i >= state_class.board_game_size || board_array[row][col + i] !== null)
                                    ) {
                                        isTabrakan = true;
                                    } else if (
                                        orientasi === "vertical" &&
                                        (row + i >= state_class.board_game_size || board_array[row + i][col] !== null)
                                    ) {
                                        isTabrakan = true;
                                    }
                                }


                                // Deteksi collsion atau engga
                                if (!isTabrakan)
                                {
                                    // Unik id
                                    const kapal_id = kapal.getAttribute('id')

                                    for (let i = 0; i < length_kapal; i++) 
                                    {
                                        if (orientasi === "horizontal") 
                                        {
                                            board_array[row][col + i] = kapal_id.substr(0, 1);
                                        }
                                        else {
                                            board_array[row + i][col] = kapal_id.substr(0, 1);
                                        }
                                    }


                                    // Simpan posisi kapal yang udh diatur
                                    posisi_kapal.push({
                                        id: kapal_id,
                                        orientation: orientasi,
                                        row: row,
                                        col: col,
                                    });


                                    // Update cell yang udh didrop kapalnya
                                    for (let i = 0; i < length_kapal; i++) 
                                    {
                                        const cell =
                                            papan_main.rows[row + (orientasi === "horizontal" ? 0 : i)].cells[
                                                col + (orientasi === "horizontal" ? i : 0)
                                            ];
            
                                        cell.classList.add('diposisikan')
                                        cell.classList.add(kapal_id)
                                    }

                                    if (kapal_id === 'submarine')
                                    {
                                        this.setState({ hideKapalSelam: true })
                                    }
                                    else if (kapal_id === 'destroyer')
                                    {
                                        this.setState({ hideKapalPerang: true })
                                    }
                                    else if (kapal_id === 'carrier')
                                    {
                                        this.setState({ hideKapalInduk: true })
                                    }


                                    // Update posisi kapal yang di state
                                    this.setState({ 
                                        posisi_kapal: posisi_kapal,
                                        posisi_kapal_id: board_array
                                     });
                                    

                                    // reset posisi kapal (yang bukan var state)
                                    if (this.state.hideKapalSelam && this.state.hideKapalPerang && 
                                        this.state.hideKapalInduk)
                                    {
                                        posisi_kapal = [];
                                        board_array = Array.from({ length: state_class.board_game_size }, () =>
                                            Array.from({ length: state_class.board_game_size }, () => null)
                                        );
                                    }
                                }
                            }
                        });
                    });
                }
            }
        }
    }



    rotateKapal(tipe_kapal)
    {
        if (tipe_kapal === 'induk')
        {
            if (this.state.rotasiKapalInduk === 'horizontal')
                this.setState({ rotasiKapalInduk: 'vertical' });
            else
                this.setState({ rotasiKapalInduk: 'horizontal' });
        }
        else if (tipe_kapal === 'perang')
        {
            if (this.state.rotasiKapalPerang === 'horizontal')
                this.setState({ rotasiKapalPerang: 'vertical' });
            else
                this.setState({ rotasiKapalPerang: 'horizontal' });
        }
        else if (tipe_kapal === 'selam')
        {
            if (this.state.rotasiKapalSelam === 'horizontal')
                this.setState({ rotasiKapalSelam: 'vertical' });
            else
                this.setState({ rotasiKapalSelam: 'horizontal' });
        }
    }


    handleMulaiMainGame()
    {
        console.log(this.state.posisi_kapal_ai_id)


        this.setState({
            is_play_game: true
        });
    }


    aturUlangLetak()
    {

        // Atur ulang simpanan statenya
        this.setState({
            posisi_kapal: [],
            hideKapalInduk: false,
            hideKapalPerang: false,
            hideKapalSelam: false,
            rotasiKapalInduk: 'horizontal',
            rotasiKapalPerang: 'horizontal',
            rotasiKapalSelam: 'horizontal',
        });


        // Dapatin semua cell yang udh diatur posisinya
        const papan_main = document.getElementById("papan-main");
        
        if (papan_main)
        {
            const list_cell = papan_main.querySelectorAll('.cell');

            if (list_cell)
                // Ngembalikan posisi semula kapal
                list_cell.forEach((cell) => cell.className = 'cell');
        }


        // Ngembalikan vertikal ke horizontal semua
        const kapal_semua = document.querySelectorAll(".ship");
        if (kapal_semua)
        {
            kapal_semua.forEach((kapal) => 
            {
                kapal.classList.remove('vertical');
                kapal.classList.remove('horizontal');
                kapal.classList.add('horizontal');
            });
        }
    }


    handleKlikCell(baris, kolom)
    {
        alert(`Baris: ${baris}, Kolom: ${kolom}`)
    }


    isPlayGame()
    {
        return(
            <div className='mt-2'>
                <div className="row">
                    <div className="col-md-4">
                        <div style={{maxWidth: '400px', margin: 'auto'}}>
                            <h2>Papan Anda</h2>
                            <p>Musuh akan menyerang kapal Anda secara acak lokasinya.</p>

                            <div className="mt-5">
                                <table id="papan-anda">
                                    <tbody>
                                        {this.state.posisi_kapal_id.map((baris, barisIndex) => 
                                        (
                                            <tr key={barisIndex}>
                                                {baris.map((kolom, kolomIndex) => 
                                                {
                                                    let nama_kolom = 'cell diposisikan'

                                                    if (kolom === 'c')
                                                        nama_kolom += ' carrier'

                                                    else if (kolom === 'd')
                                                        nama_kolom += ' destroyer'

                                                    else if (kolom === 's')
                                                        nama_kolom += ' submarine'

                                                    return (
                                                        <td key={kolomIndex} className={nama_kolom}></td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className='mt-2'>
                                    <small>Ukuran: {this.state.board_game_size}x{this.state.board_game_size}</small>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-4">
                        <div style={{maxWidth: '400px', margin: 'auto'}}>
                            <h2>Papan Musuh</h2>
                            <p>Silakan serang kapal musuh yang ada di papan bawah ini.</p>

                            <div className="mt-5">
                                
                                <table id="papan-ai">
                                    <tbody>
                                        {this.state.posisi_kapal_ai_id.map((baris, barisIndex) => (
                                            <tr key={barisIndex}>
                                                {baris.map((kolom, kolomIndex) => (
                                                    <td className='cell' key={kolomIndex} onClick={() => this.handleKlikCell(barisIndex, kolomIndex)}></td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className='mt-2'>
                                    <small>Ukuran: {this.state.board_game_size}x{this.state.board_game_size}</small>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-4">
                        <div style={{maxWidth: '400px', margin: 'auto'}}>
                            <h2>Permainan</h2>
                            <p>Informasi mengenai permainan dan skill yang akan di pakai nantinya.</p>

                            <div className='mt-5'>
                                <label className="form-label d-block">Giliran Permainan:</label>
                                <b>Anda</b>

                                <div class='mt-5'>                                
                                    <h5>Skill Permainan</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render()
    {
        const [globalState] = this.context;


        if (globalState.isPlay)
        {

            let outputTableCell = '';
            for (let x = 0; x < this.state.board_game_size; x++)
            {
                outputTableCell += '<tr>'
                
                for (let y = 0; y < this.state.board_game_size; y++)
                    outputTableCell += '<td class="cell"></td>'

                outputTableCell += '</tr>'
            }
            
            return(
                <>
                    <div className="container my-5" id="play-board">
                        <div className="menu-back mb-5">
                            <Link to="/" className='back-button'>
                                <i className="fa-solid fa-arrow-left"></i> <span>Kembali</span>
                            </Link>
                        </div>


                        {!this.state.is_play_game ? (
                            <div className='mt-2' style={{maxWidth: '900px', margin: 'auto'}}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div style={{maxWidth: '400px', margin: 'auto'}}>
                                            <h2>Papan Main</h2>
                                            <p>Silakan posisikan letak kapal Anda terlebih dahulu di papan bawah ini:</p>

                                            <div className="mt-5">
                                                <table id="papan-main">
                                                    <tbody dangerouslySetInnerHTML={{__html: outputTableCell}}></tbody>
                                                </table>

                                                <div className='mt-2'>
                                                    <small>Ukuran: {this.state.board_game_size}x{this.state.board_game_size}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-md-6">
                                        <div style={{maxWidth: '400px', margin: 'auto'}}>
                                            <h2>Pilih Kapal</h2>
                                            <p><i>Drag and drop</i> kapal di bawah ini ke papan main, 
                                            serta atur vertikal atau horizontalnya dengan klik pada bagian kapal:</p>


                                            <div className="mt-5">
                                                <div className="col-12 mb-3">
                                                    
                                                    <div className="row">
                                                        <div className='col-md-4 mb-3'>Kapal Induk</div>
                                                        <div className='col-md-8 mb-3'>

                                                            <div style={{display: !this.state.hideKapalInduk ? 'block' : 'none'}}>
                                                                <div className={this.state.rotasiKapalInduk === 'horizontal' ? 'ship horizontal bg-induk' : 'ship vertical bg-induk'} 
                                                                onClick={() => this.rotateKapal('induk')} id="carrier" data-id="1" draggable="true">
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                </div>
                                                            </div>

                                                            {this.state.hideKapalInduk ? (
                                                                <>
                                                                    <i className="fa-solid fa-ship text-secondary"></i> Siap!
                                                                </>
                                                            ) : ''}
                                                        </div>
                                                    </div>
                                                    

                                                </div>

                                                <div className="col-12 mb-3">

                                                    <div className="row">
                                                        <div className='col-md-4 mb-3'>Kapal Perang</div>
                                                        <div className='col-md-8 mb-3'>

                                                            <div style={{display: !this.state.hideKapalPerang ? 'block' : 'none'}}>
                                                                <div className={this.state.rotasiKapalPerang === 'horizontal' ? 'ship horizontal bg-perang' : 'ship vertical bg-perang'} 
                                                                onClick={() => this.rotateKapal('perang')} id="destroyer" data-id="2" draggable="true">
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>
                                                                </div>
                                                            </div>

                                                            {this.state.hideKapalPerang ? (
                                                                <>
                                                                    <i className="fa-solid fa-ship text-success"></i> Siap!
                                                                </>
                                                            ) : ''}
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="col-12 mb-3">
                                                    <div className="row">
                                                        <div className='col-md-4 mb-3'>Kapal Selam</div>
                                                        <div className='col-md-8 mb-3'>

                                                            <div style={{display: !this.state.hideKapalSelam ? 'block' : 'none'}}>
                                                                <div className={this.state.rotasiKapalSelam === 'horizontal' ? 'ship horizontal bg-selam' : 'ship vertical bg-selam'} 
                                                                onClick={() => this.rotateKapal('selam')} id="submarine" data-id="3" draggable="true">
                                                                    <div></div>
                                                                </div>
                                                            </div>

                                                            {this.state.hideKapalSelam ? (
                                                                <>
                                                                    <i className="fa-solid fa-ship text-primary"></i> Siap!
                                                                </>
                                                            ) : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            {this.state.posisi_kapal.length === this.state.panjang_kapal.length ? (
                                                <div className="my-3 py-4 text-center">
                                                    <h4>Sudah Siap?</h4>
                                                    
                                                    <div className='mt-4'>
                                                        <button type='button' className="btn mb-2" onClick={() => this.aturUlangLetak()}>
                                                            <i className="fa-solid fa-rotate-right"></i> Atur Ulang
                                                        </button>

                                                        <button type='button' className="btn btn-mulai-main bg-success text-white mb-2" id="mulai-gamenya" onClick={() => this.handleMulaiMainGame()}>
                                                            <i className="fa-solid fa-play"></i> Mulai!
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : ''}
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : this.isPlayGame()}
                    </div>
                </>
            )
        }
    }
}

export default PlayComponent;
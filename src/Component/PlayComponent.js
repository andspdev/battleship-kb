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
            // Kumpulan rotasi kapal
            rotasiKapalInduk: 'horizontal',
            rotasiKapalPerang: 'horizontal',
            rotasiKapalSelam: 'horizontal',
    
            
            // Keperluan Atur Papan
            board_game_size: 10,
            panjang_kapal: [5, 3, 1],
            posisi_kapal: [],


            //  Hide Kapal
            hideKapalInduk: false,
            hideKapalPerang: false,
            hideKapalSelam: false,
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
                                            board_array[row][col + i] = kapal_id;
                                        }
                                        else {
                                            board_array[row + i][col] = kapal_id;
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
                                    this.setState({ posisi_kapal: posisi_kapal });

                                    
                                    // reset posisi kapal (yang bukan var state)
                                    if (this.state.hideKapalSelam && this.state.hideKapalPerang && 
                                        this.state.hideKapalInduk)
                                        posisi_kapal = [];
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
        alert('test')
    }


    render()
    {
        const [globalState] = this.context;


        let outputTableCell = '';
        for (let x = 0; x < this.state.board_game_size; x++)
        {
            outputTableCell += '<tr>'
            
            for (let y = 0; y < this.state.board_game_size; y++)
                outputTableCell += '<td class="cell"></td>'

            outputTableCell += '</tr>'
        }


        if (globalState.isPlay)
        {
            return(
                <>
                    <div className="container my-5" id="play-board">
                        <div className="menu-back mb-5">
                            <Link to="/" className='back-button'>
                                <i className="fa-solid fa-arrow-left"></i> <span>Kembali</span>
                            </Link>
                        </div>

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
                                                <small>Ukuran: 10x10</small>
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
                                                    <button type='button' className="btn">
                                                        <i className="fa-solid fa-rotate-right"></i> Atur Ulang
                                                    </button>

                                                    <button type='button' className="btn btn-mulai-main bg-success text-white" id="mulai-gamenya" onClick={() => this.handleMulaiMainGame()}>
                                                        <i className="fa-solid fa-play"></i> Mulai!
                                                    </button>
                                                </div>
                                            </div>
                                        ) : ''}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    }
}

export default PlayComponent;
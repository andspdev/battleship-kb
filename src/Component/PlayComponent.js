import { Component } from 'react'
import { GlobalContext } from "../States/GlobalProvider";
import { Link } from 'react-router-dom';

import BombImage from '../Assets/images/bomb.jpg'
import TorpedoImage from '../Assets/images/torpedo.jpg'


const panjang_induk = 5
const panjang_selam = 1
const panjang_perang = 3


class PlayComponent extends Component 
{
    static contextType = GlobalContext;


    constructor(props)
    {
        super(props)



        this.state = {

            // Pengaturan game
            is_play_game: false,
            giliran_player: true,

            pesanBerlangsung: '',
            disablePB_player: false,


            // Player
                // Kumpulan rotasi kapal
                rotasiKapalInduk: 'horizontal',
                rotasiKapalPerang: 'horizontal',
                rotasiKapalSelam: 'horizontal',
                
                // Keperluan Atur Papan
                board_game_size: 8,
                panjang_kapal: [panjang_induk, panjang_perang, panjang_selam],
                posisi_kapal: [],
                posisi_kapal_id: [],

                //  Hide Kapal
                hideKapalInduk: false,
                hideKapalPerang: false,
                hideKapalSelam: false,

                
            // AI
                posisi_kapal_ai_id: [],



            // Count down skill
            countdownSkillBomb: 20,
            countdownSkillTorpedo: 30,


            
            // Cek buat tenggelam atau engga
            kapalIndukTotalTersedia_AI: panjang_induk,
            kapalPerangTotalTersedia_AI: panjang_perang,
            kapalSelamTotalTersedia_AI: panjang_selam,


            kapalIndukTotalTersedia_Player: panjang_induk,
            kapalPerangTotalTersedia_Player: panjang_perang,
            kapalSelamTotalTersedia_Player: panjang_selam
        }

        this.randomPosisiMatrixAI = this.randomPosisiMatrixAI.bind(this)
    }



    startCountdown() 
    {
        // Skill Bomb
        if (this.state.countdownSkillBomb > 0)
        {
            this.countDownBomb = setInterval(() => {
                this.setState((prevState) => {
                if (prevState.countdownSkillBomb <= 0) {
                    clearInterval(this.countDownBomb); // Stop the countdown

                    return prevState;
                } else {
                    return { countdownSkillBomb: prevState.countdownSkillBomb - 1 };
                }
                });
            }, 1000);
        }


        
        // Skill torpedo
        if (this.state.countdownSkillTorpedo > 0)
        {
            this.countDownTorpedo = setInterval(() => {
                this.setState((prevState) => {
                if (prevState.countdownSkillTorpedo <= 0) {
                    clearInterval(this.countDownTorpedo); // Stop the countdown
                    
                    return prevState;
                } else {
                    return { countdownSkillTorpedo: prevState.countdownSkillTorpedo - 1 };
                }
                });
            }, 1800);
        }
    }


    pakaiSkillnya(event, tipe)
    {
        event.preventDefault();

        switch(tipe)
        {
            case 'bomb':
                alert('Lagi dalam pembuatan.');
                break;

            case 'torpedo':
                alert('Dalam pemasangan');
                break;

            default:
                alert('Skill tidak ditemukan.')
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
        const randomPosisiMatrixAI = this.randomPosisiMatrixAI()

        console.log(randomPosisiMatrixAI)

        this.setState({
            is_play_game: true, 
            posisi_kapal_ai_id: randomPosisiMatrixAI
        });

        this.startCountdown();
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


    randomPosisiMatrixAI()
    {
        const board_game_size = this.state.board_game_size
        
        const SHIPS = [
            {type: "s", length: panjang_selam},
            {type: "d", length: panjang_perang},
            {type: "c", length: panjang_induk}
        ];


        function getRandomInt(max) 
        {
            return Math.floor(Math.random() * Math.floor(max));
        }


        function generateMatrix() 
        {
            const matrix = new Array(board_game_size).fill(null)
            .map(() => new Array(board_game_size).fill(null));

            for (const ship of SHIPS) 
            {
                let direction = getRandomInt(2); // 0 for horizontal, 1 for vertical
                let row, col;

                do {
                    row = getRandomInt(board_game_size);
                    col = getRandomInt(board_game_size);
                } while (!canPlaceShip(matrix, row, col, ship.length, direction));

                placeShip(matrix, row, col, ship.type, ship.length, direction);
            }

            return matrix;
        }


        function canPlaceShip(matrix, row, col, length, direction) 
        {
            if ((direction === 0 && col + length > board_game_size) || 
                (direction === 1 && row + length > board_game_size))
                return false;

            for (let i = 0; i < length; i++) 
            {
                if ((direction === 0 && matrix[row][col + i] !== null) || 
                    (direction === 1 && matrix[row + i][col] !== null))
                    return false;
            }

            return true;
        }


        function placeShip(matrix, row, col, type, length, direction) 
        {
            for (let i = 0; i < length; i++) 
            {
                if (direction === 0)
                    matrix[row][col + i] = type;
                else
                    matrix[row + i][col] = type;
            }
        }

        return generateMatrix();
    }


    handleKlikCell(baris, kolom)
    {
        let array_baru = this.state.posisi_kapal_ai_id;

        if (this.state.giliran_player)
        {
            if (array_baru[baris][kolom] !== '-' && 
                array_baru[baris][kolom] !== 'x')
            {

                if (array_baru[baris][kolom] === 's' || 
                    array_baru[baris][kolom] === 'd' || 
                    array_baru[baris][kolom] === 'c')
                {

                    // Cek buat kapal selam
                    if (array_baru[baris][kolom] === 's')
                    {
                        const kapalSelamTotalTersedia = this.state.kapalSelamTotalTersedia_AI - 1

                        this.setState({
                            kapalSelamTotalTersedia_AI: kapalSelamTotalTersedia
                        });


                        if (kapalSelamTotalTersedia === 0)
                        {
                            this.setState({
                                pesanBerlangsung: '<b>Anda</b> berhasil menenggelamkan kapal selam musuh.',
                                giliran_player: false,
                                disablePB_player: true,
                                pesanBerlangsungKapalSelam_AI: false
                            });

                            setTimeout(function() 
                            {
                                this.setState({ 
                                    pesanBerlangsung: '',
                                    disablePB_player: false,
                                    giliran_player: true
                                });
                            }.bind(this), 3000);
                        }
                    }
                    

                    // Cek buat kapal perang
                    if (array_baru[baris][kolom] === 'd')
                    {
                        this.setState((prevState) => ({
                            kapalPerangTotalTersedia_AI: prevState.kapalPerangTotalTersedia_AI - 1
                        }));


                        if (this.state.kapalPerangTotalTersedia_AI === 1)
                        {
                            this.setState({
                                pesanBerlangsung: '<b>Anda</b> berhasil menenggelamkan kapal perang musuh.',
                                giliran_player: false, 
                                disablePB_player: true,
                                pesanBerlangsungKapalPerang_AI: false
                            });

                            setTimeout(function() 
                            {
                                this.setState({ 
                                    pesanBerlangsung: '',
                                    giliran_player: true,
                                    disablePB_player: false
                                });
                            }.bind(this), 3000);
                        }
                    }
                    

                    // Cek buat kapal induk
                    if (array_baru[baris][kolom] === 'c')
                    {
                        this.setState((prevState) => ({
                            kapalIndukTotalTersedia_AI: prevState.kapalIndukTotalTersedia_AI - 1
                        }));


                        if (this.state.kapalIndukTotalTersedia_AI === 1)
                        {
                            this.setState({
                                pesanBerlangsung: '<b>Anda</b> berhasil menenggelamkan kapal induk musuh.',
                                giliran_player: false, 
                                disablePB_player: true,
                                pesanBerlangsungKapalInduk_AI: false
                            });

                            setTimeout(function() 
                            {
                                this.setState({ 
                                    pesanBerlangsung: '',
                                    disablePB_player: false,
                                    giliran_player: true
                                });
                            }.bind(this), 3000);
                        }
                    }


                    // Ganti ke 'x' kalau udh kena tembak
                    array_baru[baris][kolom] = 'x'
                }
                else
                {
                    array_baru[baris][kolom] = '-'
                    this.setState({ giliran_player: false })


                    setTimeout(() =>
                    {
                        // Pasang AI nya disini
                        this.komputerYangNembak()

                        
                    }, 1000);
                }
                    

                // Ganti state kalau ada perubahan jadi 'x'
                this.setState({ posisi_kapal_ai_id: array_baru });
            } 
        }
    }



    komputerYangNembak()
    {
        const statePemain = this.state.posisi_kapal_id

        if (!this.state.giliran_player)
        {
            let array_baru = statePemain;

            function tembak(baris, kolom)
            {
                let statusTembak = "salah"
            
                if (baris !== "" && 
                    kolom !== "" &&
                    typeof array_baru[baris][kolom] !== "undefined")
                {
                    if (array_baru[baris][kolom] !== '-' && 
                        array_baru[baris][kolom] !== 'x')
                    {
                        if (array_baru[baris][kolom] === 's' || 
                            array_baru[baris][kolom] === 'd' || 
                            array_baru[baris][kolom] === 'c')
                        {
                            // Kalau berhasil nembak
                            array_baru[baris][kolom] = 'x'

                            statusTembak = "bener"
                        }
                        else
                        {
                            array_baru[baris][kolom] = '-'
                        }
                    }   
                }

                return statusTembak;
            }


            // Ganti state kalau ada perubahan jadi 'x'
            this.setState({ posisi_kapal_id: array_baru });

            // Ambil state yang terbaru
            let kapal_pemain = this.state.posisi_kapal_id

            let statusTembak = ""
            function tembakAcak() 
            {
                const row = Math.floor(Math.random() * 8);
                const col = Math.floor(Math.random() * 8);
                const cell = kapal_pemain[row][col];
                
                if (cell === "x" || cell === "-")
                {
                    statusTembak = tembakAcak();
                }
                else
                {
                    statusTembak = tembak(row, col);
                }

                return statusTembak
            }



            let cekTembakan = tembakAcak();

            if (cekTembakan === "bener")
            {
                while (cekTembakan)
                {
                    if (cekTembakan === "salah")
                    {
                        this.setState({ giliran_player: true })
                        break;
                    }

                    cekTembakan = tembakAcak();
                }
            }
            else
                this.setState({ giliran_player: true })
        }
    }



    tampilanMenang()
    {
        return(
            <>
                <h1>Yee Menang!</h1>
            </>
        )
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
                                                        <td key={kolomIndex} className={nama_kolom}>
                                                            {kolom === '-' ? (
                                                                <div className='text-center text-secondary'>
                                                                    <i className="fa-solid fa-circle-dot"></i>
                                                                </div>
                                                            ) : kolom === 'x' ? (
                                                                <div className='text-center text-danger'>
                                                                    <i className="fa-solid fa-xmark"></i>
                                                                </div>
                                                            ) : ''}
                                                        </td>
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
                                                    <td className='cell' disabled={kolom === '-'} key={kolomIndex} onClick={() => this.handleKlikCell(barisIndex, kolomIndex)}>
                                                        {kolom === '-' ? (
                                                            <div className='text-center text-secondary'>
                                                                <i className="fa-solid fa-circle-dot"></i>
                                                            </div>
                                                        ) : kolom === 'x' ? (
                                                            <div className='text-center text-danger'>
                                                                <i className="fa-solid fa-xmark"></i>
                                                            </div>
                                                        ) : ''}
                                                    </td>
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

                            <div className='mt-4'>
                                <label className="form-label d-block">Giliran Permainan:</label>
                                <h3>
                                    {
                                        this.state.disablePB_player ? (
                                            <span className="badge bg-secondary"><i className="fa-solid fa-user d-inline-block me-1"></i> Anda</span>
                                        ) : this.state.giliran_player ? (
                                            <span className="badge bg-secondary"><i className="fa-solid fa-user d-inline-block me-1"></i> Anda</span>
                                        ) : (
                                            <span className="badge bg-primary"><i className="fa-solid fa-robot d-inline-block me-1"></i> Komputer</span>
                                        )
                                    }
                                </h3>

                                <div className='mt-4'>                                
                                    <h5>Skill Permainan</h5>

                                    <div className='mt-2 skill-permainan d-flex'>

                                        <div className='me-2'>
                                            <div className='items'>
                                                <div className={this.state.countdownSkillBomb === 0 ? 'open' : 'disabled'}>

                                                {this.state.countdownSkillBomb > 0 ? (
                                                    <>
                                                        <img src={BombImage} alt="Bom Mines"/>
                                                        <p>Ranjau</p>
                                                    </>
                                                ) : (
                                                    <a href="#bomb" onClick={(e) => this.pakaiSkillnya(e, 'bomb')}>
                                                        <img src={BombImage} alt="Bom Mines"/>
                                                        <p>Ranjau</p>
                                                    </a>
                                                )}

                                                
                                                </div>

                                                {this.state.countdownSkillBomb > 0 ? (
                                                    <span className='counter'>{this.state.countdownSkillBomb}s</span>
                                                ) : ''}
                                            </div>
                                        </div>

                                        <div className='mx-2'>
                                            <div className='items'>
                                                <div className={this.state.countdownSkillTorpedo === 0 ? 'open' : 'disabled'}>
                                                    {this.state.countdownSkillTorpedo > 0 ? (
                                                        <>
                                                            <img src={TorpedoImage} alt="Torpedo"/>
                                                            <p>Torpedo</p>
                                                        </>
                                                    ) : (
                                                        <a href="#torpedo" onClick={(e) => this.pakaiSkillnya(e, 'torpedo')}>
                                                            <img src={TorpedoImage} alt="Torpedo"/>
                                                            <p>Torpedo</p>
                                                        </a>
                                                    )}
                                                </div>

                                                {this.state.countdownSkillTorpedo > 0 ? (
                                                    <span className='counter'>{this.state.countdownSkillTorpedo}s</span>
                                                ) : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {this.state.pesanBerlangsung !== '' ? (
                                    <div className='mt-4 text-center'>

                                        <div className='alert alert-warning'>
                                            <h4>Berlangsung</h4>
                                            <div dangerouslySetInnerHTML={{__html: this.state.pesanBerlangsung}}></div>
                                        </div>
                                    </div>
                                ) : ''}

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
            if (this.state.kapalIndukTotalTersedia_AI === 0 &&
                this.state.kapalPerangTotalTersedia_AI === 0 &&
                this.state.kapalSelamTotalTersedia_AI === 0)
            {
                return(
                    <>
                        {this.tampilanMenang()}
                    </>
                )
            }
            else
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
}

export default PlayComponent;
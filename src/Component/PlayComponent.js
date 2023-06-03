import { Component } from 'react'
import { GlobalContext } from "../States/GlobalProvider";
import { Link } from 'react-router-dom';

// import BombImage from '../Assets/images/bomb.jpg'
import TorpedoImage from '../Assets/images/torpedo.jpg'

const panjang_induk = 5
const panjang_selam = 1
const panjang_perang = 3

const delaySkillRanjau = 20
const delaySkillTorpedo = 1


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
                posisi_kapal_minMax: [],

                //  Hide Kapal
                hideKapalInduk: false,
                hideKapalPerang: false,
                hideKapalSelam: false,

                
            // AI
                posisi_kapal_ai_id: [],

            
            // Cek buat tenggelam atau engga
            kapalIndukTotalTersedia_AI: panjang_induk,
            kapalPerangTotalTersedia_AI: panjang_perang,
            kapalSelamTotalTersedia_AI: panjang_selam,


            kapalIndukTotalTersedia_Player: panjang_induk,
            kapalPerangTotalTersedia_Player: panjang_perang,
            kapalSelamTotalTersedia_Player: panjang_selam,



            // Pemakaian Skill Torpedo
            tipePosisiTorpedo: 'baris',
            targetPosisiTorpedo: '',
            showPopupSKill: false,


            // Langkah AI history nembak
            shotHistory: [],

            energiPlayer: 0,
            energiAI: 0
        }

        this.randomPosisiMatrixAI = this.randomPosisiMatrixAI.bind(this)
    }



    pakaiSkillnya(event, tipe)
    {
        event.preventDefault();

        switch(tipe)
        {
            case 'torpedo':
                if (this.state.energiPlayer > 25)
                {
                    this.setState({ showPopupSKill: true })
                }
                break;

            default:
                alert('Skill tidak ditemukan.')
        }
    }





    cancelPopupSkill()
    {
        this.setState({ showPopupSKill: false })
    }

    

    isValiddateKoordinat(row, col)
    {
        const state_main = this.state;
        return row >= 0 && row < state_main.board_game_size && col >= 0 && col < state_main.board_game_size;
    }



    // function buat tembah kolom secara penuh
    tembakKolomPenuh = (kol, tipe = "player") =>
    {
        // list array terbaru
        let board_array = this.state.posisi_kapal_ai_id;
        if (tipe === "ai")
        {
            board_array = this.state.posisi_kapal_id;
        }


        if (this.isValiddateKoordinat(0, kol))
        {

            // cari dan ganti value jadi 'x'
            for (let row = 0; row < this.state.board_game_size; row++)
            {
                if (board_array[row][kol] !== 'x')
                {
                    if (board_array[row][kol] === 's' || 
                    board_array[row][kol] === 'd' || 
                    board_array[row][kol] === 'c')
                    {

                        if (tipe === "player")
                        {
                            this.pesanBerlangsungPlayer(board_array, row, kol);
                        }
                        else
                        {
                            this.pesanBerlangsungAI(board_array, row, kol, true);
                        }


                        board_array[row][kol] = 'x'
                    }
                    else
                    {
                        board_array[row][kol] = '-'
                    }
                }
            }

            return true;
        }

        return false;
    }


    tembakBarisPenuh = (row, tipe = "player") =>
    {
        // list array terbaru
        let board_array = this.state.posisi_kapal_ai_id;
        if (tipe === "ai")
        {
            board_array = this.state.posisi_kapal_id;
        }



        if (this.isValiddateKoordinat(row, 0))
        {
            for (let col = 0; col < this.state.board_game_size; col++)
            {
                if (board_array[row][col] !== 'x')
                {
                    if (board_array[row][col] === 's' || 
                    board_array[row][col] === 'd' || 
                    board_array[row][col] === 'c')
                    {
                        if (tipe === "player")
                        {
                            this.pesanBerlangsungPlayer(board_array, row, col);
                        }
                        else
                        {
                            this.pesanBerlangsungAI(board_array, row, col, true);
                        }

                        board_array[row][col] = 'x';
                    }
                    else
                    {
                        board_array[row][col] = '-'
                    }
                }
            }

            return true;
        }

        return false;
    }




    // Skill Player (--- Torpedonya ---)
    tembakTorpedonya_player() 
    {
        let posisiYangDItembak = ["baris", "kolom"];

        const posisi_tembak = this.state.tipePosisiTorpedo;
        const target_value = this.state.targetPosisiTorpedo;


        let isTargetFull = false;
        if (target_value >= 0 && target_value <= 7)
        {
            // Cek baris/kolom mana aja yang masih ada kosongnya
            let count = 0;
            if (posisi_tembak === "baris")
            {
                for (let column = 0; column < this.state.board_game_size; column++) 
                {
                    if (this.state.posisi_kapal_ai_id[this.state.targetPosisiTorpedo][column] === "-" || 
                        this.state.posisi_kapal_ai_id[this.state.targetPosisiTorpedo][column] === "x")
                    {
                        count++;
                    }
                }
            }
            else if (posisi_tembak === "kolom")
            {
                for (let row = 0; row < this.state.board_game_size; row++) 
                {
                    if (this.state.posisi_kapal_ai_id[row][this.state.targetPosisiTorpedo] === "-" || 
                        this.state.posisi_kapal_ai_id[row][this.state.targetPosisiTorpedo] === "x")
                    {
                        count++;
                    }
                }
            }

            isTargetFull = (count === this.state.board_game_size)
        }


        if (!posisiYangDItembak.includes(posisi_tembak))
        {
            alert('Pilih posisi tembak yang tersedia!');
        }
        else if (!(/^\d+$/.test(target_value)))
        {
            alert('Posisi tembak harus berupa angka atau angka positif!');
        }
        else if (parseInt(target_value) < 0 || 
            parseInt(target_value) > (this.state.board_game_size - 1))
        {
            alert('Posisi tembak harus di antara 0 - 7');
        }
        else if (isTargetFull)
        {
            alert('Silakan pilih posisi yang tidak terisi semua.')
        }
        else
        {
            
            // Mulai ke posisi targetnya
            if (this.state.tipePosisiTorpedo === "baris")
            {
                this.tembakBarisPenuh(this.state.targetPosisiTorpedo, "player");
            }
            else if (this.state.tipePosisiTorpedo === "kolom")
            {
                this.tembakKolomPenuh(this.state.targetPosisiTorpedo, "player")
            }
            else
            {
                alert('Kesalahan dalam pengelolahan data penembakan!');
            }


            this.setState({ 
                giliran_player: false, 
                showPopupSKill: false,
                tipePosisiTorpedo: 'baris',
                targetPosisiTorpedo: '' 
            });


            this.komputerYangNembak();
        }
    }




    tembakTorpedonya_AI()
    {
        // -------- Cek klom yang nullnya banyak ------------
        let countKolomNull = 0;
        let kolomKeBerapa = -1;


        let board_array = this.state.posisi_kapal_id;


        // Cari board yang nullnya banyak
        for (let j = 0; j < board_array[0].length; j++)
        {
            let hitungNullnya = 0;

            for (let i = 0; i < board_array.length; i++)
            {
                if (board_array[i][j] === null)
                {
                    hitungNullnya++; // count jadi ++
                }
            }

            // Bandingkan
            if (hitungNullnya > countKolomNull) {
                countKolomNull = hitungNullnya;
                kolomKeBerapa = j; // Cek lokasi kolomnya yg mana
            }
        }



        // Cek baris yang nullnya banyak
        let countBarisNull = 0;
        let barisKeBerapa = -1;

        for (let i = 0; i < board_array.length; i++)
        {
            let hitungNullnya = 0;

            for (let j = 0; j < board_array[i].length; j++)
            {
                if (board_array[i][j] === null)
                {
                    hitungNullnya++;
                }
            }

            if (hitungNullnya > countBarisNull)
            {
                countBarisNull = hitungNullnya;
                barisKeBerapa = i;
            }
        }


        // Cek penentuan AI nya nembak yang mana?
        // yang besasr null nya di tembak disitu
        let tipeYangDitembak = '';
        let posisiYangDitembak = '';

        // Random tipe yang ditembak
        if (countBarisNull > countKolomNull)
        {
            tipeYangDitembak = 'baris';
            posisiYangDitembak = barisKeBerapa;
        }
        else
        {
            tipeYangDitembak = 'kolom';
            posisiYangDitembak = kolomKeBerapa;
        }



        // Nah baru ditembak disini
        if (tipeYangDitembak === "kolom")
        {
            this.tembakKolomPenuh(posisiYangDitembak, "ai")
        }
        else if (tipeYangDitembak === "baris")
        {
            this.tembakBarisPenuh(posisiYangDitembak, "ai");
        }
        else
        {
            alert('Terjadi kesalahan saat menggunakan skill Torpedo!')
        }


        this.setState({ giliran_player: true })
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


    createMatrixMinmax = () =>
    {
        function generateRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const newMatrix = [];

        for (let i = 0; i < this.state.board_game_size; i++) 
        {
            const row = this.state.posisi_kapal_id[i];
            const newRow = [];

            for (let j = 0; j < row.length; j++) 
            {
                const value = row[j];

                if (value === "c" || value === "d" || value === "s") 
                {
                    const randomNum = generateRandomNumber(6, 10);
                    newRow.push(randomNum);
                } else if (value === null) {
                    const randomNum = generateRandomNumber(1, 10);
                    newRow.push(randomNum);
                } else {
                    newRow.push(value);
                }
            }

            newMatrix.push(newRow);
        }

        return newMatrix;
    }


    handleMulaiMainGame()
    {
        const matriks_baru = this.randomPosisiMatrixAI()

        var computerShots = [];
        for (var i = 0; i < 8; i++) {
            computerShots[i] = new Array(this.state.board_game_size).fill(0);
        }

        this.setState({
            is_play_game: true, 
            posisi_kapal_ai_id: matriks_baru,
            shotHistory: computerShots
        });

        const minmaxMatriks = this.createMatrixMinmax(matriks_baru);

        this.setState({
            is_play_game: true, 
            posisi_kapal_ai_id: matriks_baru,
            shotHistory: computerShots,
            posisi_kapal_minMax: minmaxMatriks
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
                    
                    this.pesanBerlangsungPlayer(array_baru, baris, kolom);


                    // Ganti ke 'x' kalau udh kena tembak
                    array_baru[baris][kolom] = 'x'
                }
                else
                {
                    array_baru[baris][kolom] = '-'
                    this.setState({ giliran_player: false });
                    this.komputerYangNembak();
                }
                    

                // Ganti state kalau ada perubahan jadi 'x'
                this.setState({ posisi_kapal_ai_id: array_baru });
            } 
        }
    }



    pesanBerlangsungPlayer(array_baru, baris, kolom)
    {
        const waktuDelayPesan = 2500;


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
                }.bind(this), waktuDelayPesan);
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
                }.bind(this), waktuDelayPesan);
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
                }.bind(this), waktuDelayPesan);
            }
        }
    }





    komputerYangNembak = () =>
    {

        setTimeout(() =>
        {
            const getRandomShot = () => 
            {
                // // Mengecek apakah semua posisi sudah ditembak
                let allShotsTaken = true;

                for (var i = 0; i < 8; i++) 
                {
                    for (var j = 0; j < 8; j++) {
                        if (this.state.shotHistory[i][j] === 0) 
                        {
                            allShotsTaken = false;
                            break;
                        }
                    }
                }

                // Jika semua posisi telah ditembak, kembalikan null
                if (allShotsTaken) {
                    return null;
                }



                // Pakai min max
                let posisiKapalMinMax = this.state.posisi_kapal_minMax;

                let maxValue = Number.NEGATIVE_INFINITY; // Inisialisasi dengan nilai terkecil
                let maxRow = -1;
                let maxCol = -1;

                for (let row = 0; row < posisiKapalMinMax.length; row++) 
                {
                    for (let col = 0; col < posisiKapalMinMax[row].length; col++) 
                    {
                        if (posisiKapalMinMax[row][col] > maxValue) 
                        {
                            maxValue = posisiKapalMinMax[row][col];
                            maxRow = row;
                            maxCol = col;
                        }
                    }
                }

                
                const row = maxRow;
                const col = maxCol;
                
                posisiKapalMinMax[row][col] = -1;
                this.setState({ posisi_kapal_minMax: posisiKapalMinMax });

                return {row, col}
            }


            const isHit = (row, col) =>
            {
                let kapalState = this.state.posisi_kapal_id;

                const waktuDelayPesan = 2500;

                const cekKapal = 
                kapalState[row][col] === "c" || 
                kapalState[row][col] === "d" || 
                kapalState[row][col] === "s";


                if (cekKapal)
                {

                    // Pesan Berlangsung
                    if (kapalState[row][col] === 'c')
                    {

                        this.setState((prevState) => ({
                            kapalIndukTotalTersedia_Player: prevState.kapalIndukTotalTersedia_Player - 1
                        }));


                        if (this.state.kapalIndukTotalTersedia_Player === 1)
                        {
                            this.setState({
                                pesanBerlangsung: '<b>Komputer</b> berhasil menenggelamkan kapal induk Anda.',
                            });

                            setTimeout(function()
                            {
                                this.setState({ pesanBerlangsung: '' });

                                // Main Lagi
                                this.komputerYangNembak();

                            }.bind(this), waktuDelayPesan);
                        }
                    }

                    // Cek buat kapal perang
                    if (kapalState[row][col] === 'd')
                    {

                        this.setState((prevState) => ({
                            kapalPerangTotalTersedia_Player: prevState.kapalPerangTotalTersedia_Player - 1
                        }));


                        if (this.state.kapalPerangTotalTersedia_Player === 1)
                        {
                            this.setState({
                                pesanBerlangsung: '<b>Komputer</b> berhasil menenggelamkan kapal perang Anda.',
                            });

                            setTimeout(function()
                            {
                                this.setState({ pesanBerlangsung: '' });

                                // Main Lagi
                                this.komputerYangNembak();

                            }.bind(this), waktuDelayPesan);
                        }
                    }


                    // Cek buat kapal selam
                    if (kapalState[row][col] === 's')
                    {
                        const kapalSelamTotalTersedia = this.state.kapalSelamTotalTersedia_Player - 1

                        this.setState({
                            kapalSelamTotalTersedia_Player: kapalSelamTotalTersedia
                        });


                        if (kapalSelamTotalTersedia === 0)
                        {
                            this.setState({
                                pesanBerlangsung: '<b>Komputer</b> berhasil menenggelamkan kapal selam Anda.',
                            });

                            setTimeout(function()
                            {
                                this.setState({ pesanBerlangsung: '' });

                                this.komputerYangNembak();

                            }.bind(this), waktuDelayPesan);
                        }
                    }


                    
                    kapalState[row][col] = 'x';
                    this.setState({ posisi_kapal_id: kapalState });
                }

                return cekKapal;
            }

            
            
            const continueShooting = (hitRow, hitCol) =>
            {
                let shotHistory = this.state.shotHistory;
                
                var directions = [
                    { row: -1, col: 0 }, // Atas
                    { row: 1, col: 0 }, // Bawah
                    { row: 0, col: -1 }, // Kiri
                    { row: 0, col: 1 }, // Kanan
                ];

                var nextShots = [];

                // Tembakan di sekitar kapal yang terkena tembakan
                for (var i = 0; i < directions.length; i++) 
                {
                    var newRow = hitRow + directions[i].row;
                    var newCol = hitCol + directions[i].col;

                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && shotHistory[newRow][newCol] === 0) 
                    {
                        nextShots.push({ row: newRow, col: newCol });
                    }
                }

                // Jika ada tembakan lanjutan, pilih secara acak satu tembakan
                if (nextShots.length > 0) 
                {
                    var randomIndex = Math.floor(Math.random() * nextShots.length);
                    var nextShot = nextShots[randomIndex];

                    // Tandai tembakan komputer
                    shotHistory[nextShot.row][nextShot.col] = 1; 
                    this.setState({ shotHistory: shotHistory })


                    if (isHit(nextShot.row, nextShot.col)) 
                    {
                        // Lanjutkan penembakan di sekitar kapal yang terkena tembakan
                        continueShooting(nextShot.row, nextShot.col);
                    }
                }
            }


            const tembak = () =>
            {
                let shot = getRandomShot();

                if (shot === null) {
                    console.log('Papan telah ditembak semua!');
                    return;
                }


                let komputerShot = this.state.shotHistory;
                komputerShot[shot.row][shot.col] = 1;

                if (isHit(shot.row, shot.col))
                {
                    continueShooting(shot.row, shot.col);
                }
                else
                {
                    let board_player = this.state.posisi_kapal_id;

                    if (board_player[shot.row][shot.col] !== 'x')
                    {
                        board_player[shot.row][shot.col] = '-';
                        this.setState({ posisi_kapal_id: board_player });
                    }
                    else tembak();
                }
            }


            tembak();
            this.setState({ giliran_player: true });
        }, 1000);
    }



    tampilanMenang()
    {
        return(
            <>
                <h1>Yee Menang!</h1>
            </>
        )
    }


    tampilanKalah()
    {
        return(
            <>
                <h1>Yee Kalah!</h1>
            </>
        )
    }



    isPlayGame()
    {
        
        return(
            <>
                {this.state.showPopupSKill ? (
                    <div className='popup-skill'>
                        <div className='content'>
                            <label className='mb-2'>Tembak pada bagian</label>

                            <select onChange={(e) => this.setState({tipePosisiTorpedo: e.target.value})} className='form-select'>
                                <option value="baris">Baris</option>
                                <option value="kolom">Kolom</option>
                            </select>

                            <br/>

                            <label className='mb-2'>Titik Lokasi (0-7)</label>
                            <input className='form-control' placeholder="0" maxLength={1} onChange={(e) => this.setState({targetPosisiTorpedo: e.target.value})}/><br/>

                            <button className='btn btn-secondary me-2' onClick={() => this.cancelPopupSkill()}>&laquo; Batalkan</button>
                            <button className='btn btn-primary' onClick={() => this.tembakTorpedonya_player()}>Tembak!</button>
                        </div>
                    </div>
                ) : ''}


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

                                            <div className='mx-0'>
                                                <div className='items'>
                                                    <div className={this.state.energiPlayer > 25 ? 'open' : 'disabled'}>
                                                        {this.state.energiPlayer > 25 ? (
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
            </>
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
            else if (this.state.kapalIndukTotalTersedia_Player === 0 &&
                this.state.kapalPerangTotalTersedia_Player === 0 &&
                this.state.kapalSelamTotalTersedia_Player === 0)
            {
                return(
                    <>
                        {this.tampilanKalah()}
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
                                <a href="/" className='back-button'>
                                    <i className="fa-solid fa-arrow-left"></i> <span>Kembali</span>
                                </a>
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
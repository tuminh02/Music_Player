//display list
//scroll row
//play song, pause song, seek song
//rotate cd
//next/previous
//random
//next/repeat when ended
//active song
//scroll active song into view
//play song when click


//tip de khong phai goi lai qua nhieu lan
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGEKEY = 'PLAYER';

const cd = $('.cd');
const heading = $('header h2');
const cdImg = $('.cd-thumb');
const audio = $('#audio');
const btnplay = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')




const app = {
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    currentIndex:0,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGEKEY))||{},
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGEKEY,JSON.stringify(this.config));
    },
    songs:[
        
            {          
            name:"Chim Sau",
            singer:"MCK",
            path:"assets/music/Chìm Sâu.mp3",
            image:"assets/img/chim-sau.png"
            },

            {          
            name:"Beautiful Girls",
            singer:"KingSton",
            path:"assets/music/Beautiful Girls.mp3",
            image:"assets/img/KingSton.png"
            },

            {          
            name:"Sky is the limit",
            singer:"Mark Ambor",
            path:"assets/music/Sky is the Limit.mp3",
            image:"assets/img/Sky-is-the-limit.png"
            },

            {          
            name:"Thu cuối",
            singer:"Yanbi",
            path:"assets/music/Thu Cuối.mp3",
            image:"assets/img/Thu-cuoi.png"
            },

            {          
            name:"Tình đắng như ly cà phê",
            singer:"MCK",
            path:"assets/music/Tình Đắng Như Ly Cà Phê.mp3",
            image:"assets/img/Tinh-dang-nhu-ly-ca-phe.png"
            },

            {          
            name:"YOU",
            singer:"AK49",
            path:"assets/music/YOU.mp3",
            image:"assets/img/You.png"
            },
            {          
                name:"YOU",
                singer:"AK49",
                path:"assets/music/YOU.mp3",
                image:"assets/img/You.png"
            },
            {          
                name:"YOU",
                singer:"AK49",
                path:"assets/music/YOU.mp3",
                image:"assets/img/You.png"
            },
            

    ],

    render: function(){
        //render list song
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })

       playlist.innerHTML = htmls.join(''); 
    },

    defineProperties:function(){
        //define phuong thuc currentsong vao object voi chuc nang tao thuoc tinh get ra bai hat dau tien (this.songs[this.currentIndex] )
        Object.defineProperty (this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex] 
            }
        })
    },

    handleEvent: function(){

        const cdWidth = cd.offsetWidth;

       // scroll event
        document.onscroll = function(){
            const scrolls = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrolls ;
            cd.style.width = newCdWidth> 0 ? newCdWidth : 0;
            cd.style.opacity = newCdWidth/cdWidth;

        }

        //xu ly rotate cd

        const rotateCd = cdImg.animate(
           [ {transform: "rotate(360deg)"}],
            {duration:10000,
            iterations: Infinity}
        )
            rotateCd.pause()

        //xu ly button play
        btnplay.onclick=function(){

            if(app.isPlaying){
                audio.pause(); 
            }
            else{
               audio.play();    
            }
            //khi nhac chay
            audio.onplay=function(){
                 app.isPlaying = true;              
                player.classList.add('playing');
                rotateCd.play()
            }
            //khi nhac dung
            audio.onpause=function(){
                app.isPlaying = false;              
               player.classList.remove('playing');
               rotateCd.pause();
           }

           //khi tien do bai hat thay doi
           audio.ontimeupdate=function(){
            if(audio.duration){//neu audio.duration khong bang Nan
                const timeSong = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = timeSong
            }
            
           }
           // xu ly khi tua song
           progress.onchange = function(e){//truyen vao event
            //lay ra target(% tua duoc) tinh ra so giay khi tua = tong thoi luong bai hat/100 * phan tram tua duoc 
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
           }

           //khi bai hat ket thuc nhay sang bai khac
           audio.onended = function(){
            if(app.isRepeat){
                audio.play();
            }else{
                nextBtn.click();

            }
           }
        }

        //click nextBtn
        nextBtn.onclick = function(){
            
            if(app.isRandom){
                app.RandomSong();
            }else{
                app.nextSong();
            }            
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        //click prevBtn
        prevBtn.onclick = function(){
           
            if(app.isRandom){
                app.RandomSong();
            }else{
                app.previousSong();
            }           
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        //click randomBtn, bat tat btn random
        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom
            app.setConfig('isRandom',app.isRandom)
            //toggle() chuyen doi qua lai,dung thi add sai thi remove
            randomBtn.classList.toggle('active',app.isRandom)
            
        }

        //bat tat repeat
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat',app.isRepeat)
            //toggle() chuyen doi qua lai,dung thi add sai thi remove
            repeatBtn.classList.toggle('active',app.isRepeat)
        }

        //play song when click
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            //xu ly khi click vao song
            if(songNode||e.target.closest('.option')){
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }            
            }
            //xu ly khi click vao option
            
        }

    },
    //tai bai hat dau tien hien thi ra UI khi bat dau trang
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdImg.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        
    },

    //load config

    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    //next song
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        
        this.loadCurrentSong();
    },

    //previous song
    previousSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        
        this.loadCurrentSong();
    },

    //Random song
    RandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex=newIndex;
        this.loadCurrentSong();
    },
    //hien thi bai hat len view
    scrollToActiveSong:function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
            behavior:'smooth',
            block:'nearest',
        })},300)
    },

    // place run methods
    start: function(){

        //gan cau hinh config vao ung dung
        this.loadConfig();
        //Dinh nghia/sua doi (defined/modified) cac thuoc tinh trong object
        this.defineProperties();
        //xu ly/lang nghe cac su kien 
        this.handleEvent();
        //tai bai hat dau tien hien thi ra UI khi bat dau trang
        this.loadCurrentSong();

        //render playlist
        this.render();
        // hien thi trang thai ban dau cua button
        randomBtn.classList.toggle('active',app.isRandom)
        repeatBtn.classList.toggle('active',app.isRepeat)
    }
}

app.start()
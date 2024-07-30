
const ImageSection = document.querySelector('.img-name-artist'),
mainAudio = document.querySelector('#mainaudio'),
playpausebtn = document.getElementById('pause'),
prevbtn = document.getElementById('prev'),
nextbtn = document.getElementById('next'),
trackline = document.querySelector('.track-line'),
trackingline = document.querySelector('.tracking'),
timer = document.querySelector('.timer'),
musicadd = document.querySelector('.musics'),
musicList = document.querySelector('.music-list'),
listIcon = document.querySelector('#musiclisticon img'),
closeBtn = document.querySelector('#closebtn'),
ordertype = document.querySelector('#typebtn');


let musicIndex = 1;
//load image,name,artist function
function loadImg(){
    ImageSection.innerHTML = `
        <img src="music/${allMusic[musicIndex - 1].img}.jpg">
        <h2>${allMusic[musicIndex - 1].name}</h2>
        <h4>${allMusic[musicIndex - 1].artist}</h4>
    `;
    mainAudio.src = `music/${allMusic[musicIndex - 1].src}.mp3`;
}

// function for playMusic
function playMusic(){
    playpausebtn.classList.add('paused');
    playpausebtn.innerHTML = `<i  class="fa-solid fa-pause"></i>`;
    ImageSection.querySelector('img').classList.add('rotate');
    mainAudio.play();
}
// function for pauseMusic
function pauseMusic(){
    playpausebtn.classList.remove('paused');
    playpausebtn.innerHTML = `<i  class="fa-solid fa-play"></i>`;
    ImageSection.querySelector('img').classList.remove('rotate');
    mainAudio.pause();

}

//function for previous music
function previous(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadImg();
    playMusic();
}

//function for next music
function next(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadImg();
    playMusic();
}
window.addEventListener('load',()=>{
    loadImg();
    playNow();
});
playpausebtn.addEventListener('click',()=>{
    let isMusicpaused = playpausebtn.classList.contains('paused');
    isMusicpaused ? pauseMusic() : playMusic();
})
prevbtn.addEventListener('click',previous);
nextbtn.addEventListener('click',next);

mainAudio.addEventListener('timeupdate',(e)=>{
    e.target.duration = 0;
    let width = (e.target.currentTime / e.target.duration) * 100;
    trackingline.style.width = `${width}%`;
    let currentMin = Math.floor((e.target.currentTime)/60);
    let currentsec = Math.floor((e.target.currentTime)%60);
    currentsec < 10 ? currentsec = `0${currentsec}`: currentsec = currentsec;
    document.querySelector('.start').innerHTML = `
    <span class="start">${currentMin}:${currentsec}</span>`
    mainAudio.addEventListener('loadeddata',()=>{
        let durationMin = Math.floor((e.target.duration)/60);
        let durationsec = Math.floor((e.target.duration)%60);
        durationsec < 10 ? durationsec = `0${durationsec}`: durationsec = durationsec;
        document.querySelector('.end').innerHTML = `
        <span class="end">${durationMin}:${durationsec}</span>`
        // document.querySelector('#duration').innerText = `${durationMin}:${durationsec}`
    })
})
trackline.addEventListener('click',(e)=>{
    let offset = e.offsetX;
    let trackwidth = trackline.clientWidth;
    mainAudio.currentTime = (offset / trackwidth)* mainAudio.duration;
    playMusic();
})


//adding songs into the music list
for(let i=0;i<allMusic.length;i++)
{
    let html = '';
    html =`<li li-index="${i+1}" class="music"> 
            <div class="detail">
                <img src="music/${allMusic[i].img}.jpg" alt="">
                <div>
                <h3>${allMusic[i].name}</h3>
                <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
            </div>
            <span id="${allMusic[i].src}"></span>
        </li>`
    musicadd.insertAdjacentHTML('beforeend',html);
    let liaudioTag = document.querySelector(`.${allMusic[i].src}`);
    let liaudioduration = document.querySelector(`#${allMusic[i].src}`);
    liaudioTag.addEventListener('loadeddata',()=>{
        let songdur = liaudioTag.duration;
        let durationMin = Math.floor(songdur/60);
        let durationsec = Math.floor(songdur%60);
        durationsec < 10 ? durationsec = `0${durationsec}`: durationsec = durationsec;
        liaudioduration.innerText = `${durationMin}:${durationsec}`;
        liaudioduration.setAttribute('t-duration',`${durationMin}:${durationsec}`)
    })
}
listIcon.addEventListener('click',()=>{
    musicList.classList.add('shown');
})
closeBtn.addEventListener('click',()=>{
    musicList.classList.remove('shown');
})
 

ordertype.addEventListener('click',()=>{
    let order = ordertype.querySelector('img').getAttribute('class');
    switch(order){
        case "repeatone":
            ordertype.innerHTML = `<img src="shuffle.png" class="shuffle" title="shuffled">`;
            break;
        case "shuffle":
            ordertype.innerHTML = `<img src="repeat.png" class="repeat" title="loop repeated">`;
            break;
        case "repeat":
            ordertype.innerHTML = `<img src="repeatone.png" class="repeatone" title="repeat one">`;
            break; 
    }
})

mainAudio.addEventListener('ended',()=>{
    let order = ordertype.querySelector('img').getAttribute('class');
    switch(order){
        case "repeatone":
            mainAudio.currentTime = 0;
            playMusic();
            break;
        case "shuffle":
            let randindex; 
            do{
                randindex = (Math.floor((Math.random())*allMusic.length))+1;
            }while(musicIndex == randindex)
            musicIndex = randindex;
            loadImg();
            playMusic();
            break;
        case "repeat":
            next();
            break; 
    }
})

const allLiTag = document.querySelectorAll('li');
function playNow(){
    for (let j = 0; j < allLiTag.length; j++) {
        let songDuration = allLiTag[j].querySelector('li span');
        if(allLiTag[j].classList.contains('playing')){
            allLiTag[j].classList.remove('playing');
            songDuration.innerText=  songDuration.getAttribute('t-duration');
        }
        if(allLiTag[j].getAttribute('li-index') == musicIndex){
            allLiTag[j].classList.add('playing');
            songDuration.innerHTML= '...';
        }   
        allLiTag[j].setAttribute("onclick","clicked(this)");
    }
}


function clicked(ele){
    let getindex = ele.getAttribute('li-index');
    musicIndex = getindex;
    loadImg();
    playMusic();
    playNow();
}
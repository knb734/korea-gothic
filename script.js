let clear = 0;
let progress = 1;
let 정답;
let 맞힌정답 = [];
let 오답한자 = [];
let 오답훈음 = [];
let 푼문제번호 = [];

const message = new SpeechSynthesisUtterance();
message.lang = 'en-UK';
message.pitch = 1;
message.rate = 1;
message.volume = 1;


const 입력창 = '<div id="div1"><input type="text" class="input"><button class="check">정답 확인</button><button class="unknown">모름</button><img src="right.png" alt="정답" class="right"><img src="wrong.jpeg" alt="오답" class="wrong"></div>';
// const 입력창 = '<div id="div1"><input type="text" class="input" style="font-size: 5vw; height: 10vw; width: 35vw;"><button class="check" style="font-size: 5vw">정답 확인</button><button class="unknown" style="font-size: 5vw;">모름</button><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8thit5dyK9T3sljabIz7WadrbDt8nJgCJ8aXHsxWR8A&s" alt="정답" class="right"style="width: 10vw; height: 10vw;"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cross_red_circle.svg/768px-Cross_red_circle.svg.png" alt="오답" class="wrong" style="width: 10vw; height: 10vw;"></div>';

function readOut(word) {
    message.text = word;
    window.speechSynthesis.speak(message);
}

function setBar() {
    document.querySelector('#bar').style.width = `${100*progress/한자.length}%`;
    document.querySelector('#progress').innerText = progress;
    document.querySelector('#bar-text .total').innerText = 한자.length;
}

function turnIntoArray(str) {
    let returnValue = [];
    for (let i = 0; i < str.split('|').length; i++) {
        returnValue.push(str.split('|')[i]);
    } // 문자 '|'을 기준으로 문자열을 잘라서 배열로 저장
    for (let j = 0; j < returnValue.length; j++) {
        if (returnValue[j].indexOf('/') > -1) {
            if (returnValue[j][0] === ' ') {
                returnValue[j] = returnValue[j].slice(1);
            }
            for (let k = 0; k < returnValue[j].split(' ')[0].split('/').length; k++) {
                returnValue.push(returnValue[j].split(' ')[0].split('/')[k] + returnValue[j].split(' ')[1]);
            }
            returnValue.splice(j, 1);
            j--;
        }
    }
    for (let l = 0; l < returnValue.length; l++) {
        returnValue[l] = returnValue[l].replaceAll(' ', '');
    }
    return returnValue;
}

function showStatistics() {
    if (bar.style.backgroundColor !== 'tomato' && (오답한자.length/한자.length*100).toFixed(1) <= 5) {
        clear = true;
    }
    if (오답한자.length/한자.length*100 === 0) {
        document.getElementById('statistics').style.display = 'none';
        document.getElementById('clear').style.display = 'block';
        if (clear) {
            document.querySelector('#clear span').style.display = 'inline';
        }
        document.onkeydown = function(e) {
            if (e.key === ' ') {
                window.location.reload();
            }
        }
    } else {
        document.getElementById('statistics').style.display = 'block';
        document.querySelector('#statistics .total').innerText = String(한자.length);
        document.querySelector('#right').innerText = String(한자.length - 오답한자.length);
        document.querySelector('#wrong').innerText = String(오답한자.length);
        document.querySelector('#right-percent').innerText = String(((한자.length - 오답한자.length)/한자.length*100).toFixed(1));
        document.querySelector('#wrong-percent').innerText = String((오답한자.length/한자.length*100).toFixed(1));
        document.querySelector('#bar').style.width = `100%`;
        document.onkeydown = function(e) {
            if (e.key === ' ') {
                한자 = 오답한자;
                훈음 = 오답훈음;
                오답한자 = [];
                오답훈음 = [];
                푼문제번호 = [];
                progress = 1;
                document.getElementById('statistics').style.display = 'none';
                bar.style.backgroundColor = 'tomato';
                quiz();
            }
        }
    }
}


function quiz() {
    // 이전 단계 설정 초기화
    맞힌정답 = [];    
    for (let h = 1; h <= document.querySelectorAll('#answer div').length; h++) {
        document.querySelector('#div' + String(h) + ' .input').disabled = false;
        document.querySelector('#div' + String(h) + ' .check').disabled = false;
        document.querySelector('#div' + String(h) + ' .unknown').disabled = false;
        document.querySelector('#div' + String(h) + ' .right').style.display = 'none';
        document.querySelector('#div' + String(h) + ' .wrong').style.display = 'none';
    }
    document.querySelector('#answer').innerHTML = 입력창;
    document.getElementById('message').style.display = 'none';
    document.getElementById('continue').style.display = 'none';
    document.onkeydown = function(e) {
        if (e.key === ' ') {

        }
    }
    document.getElementById('right-answer').style.display = 'none';
    document.getElementById('character').style.display = 'block';

    // 한자와 정답 불러오기
    while (true) {
        index = Math.floor(Math.random()*한자.length);
        if (!푼문제번호.includes(index)) {
            break;
        }
    }

    // 발음 들려주기
    readOut(한자[index]);

    document.querySelector('#character').innerText = 한자[index];
    진짜정답 = 훈음[index];
    // document.querySelector('#message').innerHTML = 진짜정답+'<br><br>Space 키를 눌러서 계속';
    document.querySelector('#right-answer').innerText = 진짜정답;
    정답 = turnIntoArray(진짜정답);

    

    // 훈음이 여러 개일 때 대비
    for (let i = 2; i <= 정답.length; i++) {
        document.querySelector('#answer').innerHTML = document.querySelector('#answer').innerHTML + 입력창.replaceAll('1', String(i));
    }

    for (let ia = 1; ia <= 정답.length; ia++) {
        if (!(document.querySelector('#div' + String(ia) + ' .input').disabled)) {
            document.querySelector('#div' + String(ia) + ' .input').select();
        }
    }

    setBar();

    

    // 정답이 입력되었을 때
    for (let j = 1; j <= 정답.length; j++) {
        document.querySelector('#div' + String(j) + ' .check').addEventListener('click', function(event) {
            let inputValue = document.querySelector('#div' + String(j) + ' .input').value;
            if (inputValue.replaceAll(' ', '') !== '') { // 입력값이 유효하면
                if (정답.includes(inputValue.replaceAll(' ', ''))) { // 정답인 경우
                    if (맞힌정답.includes(inputValue.replaceAll(' ', ''))) { // 이미 입력한 답인 경우
                        document.querySelector('#div' + String(j) + ' .input').value = '';
                        inputValue = '';
                        alert('중복입니다.');
                    } else { // 정답인 경우
                        document.querySelector('#div' + String(j) + ' .right').style.display = 'inline';
                        맞힌정답.push(inputValue.replaceAll(' ', ''));
                    }
                } else { // 오답인 경우
                    document.querySelector('#div' + String(j) + ' .wrong').style.display = 'inline';
                    오답한자.push(document.querySelector('#character').innerText);
                    오답훈음.push(진짜정답);
                }

                if (inputValue !== '') { // 정답이거나 오답이면
                    // 정답 입력 창 비활성화하기
                    document.querySelector('#div' + String(j) + ' .input').disabled = true;
                    document.querySelector('#div' + String(j) + ' .check').disabled = true;
                    document.querySelector('#div' + String(j) + ' .unknown').disabled = true;
    
                    // 모든 정답입력창에 답을 입력했다면
                    for (let k = 1; k <= 정답.length; k++) {
                        if (!document.querySelector('#div' + String(k) + ' .input').disabled) {
                            break;
                        }
                        if (k === 정답.length) {
                            푼문제번호.push(index);
                            progress++;
    
                            // 오답이 없으면 메시지 내용 변경
                            for (let l = 1; l <= 정답.length; l++) {
                                if (document.querySelector('#div' + String(l) + ' .wrong').style.display === 'inline') {
                                    break;
                                }
                                if (l === 정답.length) {
                                    document.getElementById('message').innerText = 'Space 키를 눌러서 계속'
                                };
                            }
    
                            // 메시지 출력, 다음 문제
                            if (window.innerWidth <= 700) {
                                document.getElementById('continue').style.display = 'block';
                            } else {
                                document.getElementById('message').style.display = 'block';
                            }
                            document.getElementById('right-answer').style.display = 'block';
                            document.getElementById('character').style.display = 'none';
                            document.onkeydown = function(e) {
                                if (e.key === ' ') {
                                    if (한자.length === 푼문제번호.length) {
                                        showStatistics();
                                    } else {
                                        quiz();
                                    }
                                }
                            }
                        };
                    }
    
                    for (let m = 1; m <= 정답.length; m++) {
                        if (!(document.querySelector('#div' + String(m) + ' .input').disabled)) {
                            document.querySelector('#div' + String(m) + ' .input').select();
                        }
                    }
                }
            } else {
                document.querySelector('#div' + String(j) + ' .input').value = '';
            }
        });

        document.querySelector('#div' + String(j) + ' .unknown').addEventListener('click', function(event) {
            document.querySelector('#div' + String(j) + ' .input').value = 'ㅤ';
            document.querySelector('#div' + String(j) + ' .check').click();
        });

        document.querySelector('#div' + String(j) + ' .input').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                document.querySelector('#div' + String(j) + ' .check').click();
            }
            if (event.key === '/') {
                document.querySelector('#div' + String(j) + ' .unknown').click();
            }
        });
    }
}

document.querySelector('#level-input button').addEventListener('click', function(event) {
    if (document.querySelector('#enter-level').value.replaceAll(' ', '') !== '') {
        const level = document.querySelector('#enter-level').value;
        // if (document.querySelector('#character').innerText === '例') {
        //     한자 = 한자[level];
        //     훈음 = 훈음[level];
        // } else {
        //     한자 = 단어.slice(200*(level-1), 200*level);
        //     훈음 = 뜻.slice(200*(level-1), 200*level);
        //     for (let i = 0; i < 200; i++){
        //         훈음[i] = 훈음[i].toString();
        //     }
        // }
        한자 = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        훈음 = ['월', '화', '수', '목', '금', '토', '일'];
        document.querySelector('h1').innerText = level + '단계';
        document.getElementById('level-input').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        quiz();
    }
});

document.querySelector('#enter-level').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.querySelector('#level-input button').click();
    }
});

document.querySelector('#mute').addEventListener('click', function(event) {
    const URLs = ['https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mute_Icon.svg/1200px-Mute_Icon.svg.png'];
    if (document.querySelector('#mute').src === URLs[0]) {
        document.querySelector('#mute').src = URLs[1];
        message.volume = 0;
    } else {
        document.querySelector('#mute').src = URLs[0];
        message.volume = 1;
    }
})

document.querySelector('#continue').addEventListener('click', function(event) {
    if (한자.length === 푼문제번호.length) {
        showStatistics();
    } else {
        quiz();
    }
});

document.querySelector('#statistics button').addEventListener('click', function(event) {
    한자 = 오답한자;
    훈음 = 오답훈음;
    오답한자 = [];
    오답훈음 = [];
    푼문제번호 = [];
    progress = 1;
    document.getElementById('statistics').style.display = 'none';
    bar.style.backgroundColor = 'tomato';
    quiz();
});

document.querySelector('#clear button').addEventListener('click', function(event) {
    window.location.reload();
});
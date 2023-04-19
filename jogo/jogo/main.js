//funcionamento do teclado

function Digitar(letra) {
  var txtarea = document.getElementById("write")
  var html = txtarea.value
  if ($(`#${letra}`).hasClass("disable")) return false;

  if (letra === "del") {
    $write.html(html.substr(0, html.length - 1));
    return false;
  } else if (letra === "try") {
    tryLetter()
    return false;
  } else if (letra === "guess") {
    guess()
    return false;
  }
  txtarea.value = txtarea.value + letra;
};

//mecanica do jogo

var letterWrong = []
var hangman = [head, body, leftArm, rightArm, leftLeg, rightLeg]

function tryLetter() {
  var $guess = $('#palavra');
  var $tries = $('#tries');
  var tried = $tries.html();
  var answer = $guess.attr("data-value")
  var update = ""
  var decodedAnswer = $guess.html();
  var txtarea = document.getElementById("write")
  var restart = document.getElementById("restart")
  if (txtarea.value.length > 1){
    alert("Você só pode dar palpite de uma letra por vez, se quiser dar um palpite da música toda, use o botão 'palpitar a música'")
    txtarea.value = ""
    return
  }
  if (answer.toLowerCase().includes(txtarea.value)){
    for (var i = 0; i < answer.length; i++) {
      if (answer[i].toLowerCase()===txtarea.value){
        update = update + answer[i]
      } else {
        update = update + decodedAnswer[i]
      }
    }
    $guess.html(update)
    $tries.html(tried+" "+txtarea.value)
    if (!update.includes("_")){
      restart.style.display = "flex";
      alert("Você ganhou!")
    }
  } else {
    if (!letterWrong.includes(txtarea.value)) {
      letterWrong.push(txtarea.value)
      $tries.html(tried+" "+txtarea.value)
      $(`#${txtarea.value}`).addClass("disable")
      hangman[(letterWrong.length-1)]()
      if (letterWrong.length === 6){
        alert("Você perdeu! A resposta era " + answer)
        restart.style.display = "flex";
      }
    }
  }
  txtarea.value = ""
}

function guess () {
  var txtarea = document.getElementById("write")
  var $guess = $('#palavra');
  var answer = $guess.attr("data-value")
  if (txtarea.value === answer.toLowerCase()) {
    alert("Você ganhou!")
  } else {
    var hangmanLose = [head(), body(), leftArm(), rightArm(), leftLeg(), rightLeg()]  
    alert("Você perdeu! A resposta era " + answer)
  }
  var restart = document.getElementById("restart")
  restart.style.display = "flex";
}

//requisições para a API do spotify trazer os dados do usuário

async function getArtists(access_token) {
  const response = await fetch(
    'https://api.spotify.com/v1/me/following?type=artist',
    {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    });
  const artists = await response.json()
  const getRandom = Math.floor(Math.random() * 20)
  var artist = artists.artists.items[getRandom]
  var artistName = artist.name
  var songName = await getArtistsInfo(access_token, artist.id)
  return {"song":songName, "artist":artistName}
}

async function getArtistsInfo(access_token, id) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks?market=BR`,
    {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    });
  const tracks = await response.json()
  const getRandom = Math.floor(Math.random() * 10)
  var song = tracks.tracks[getRandom]
  const regex = /^[a-zA-Z]+$/
  while (!regex.test(song.name)) {
    const getRandom = Math.floor(Math.random() * 10)
    var song = tracks.tracks[getRandom]
  }
  return song.name
}

//funções de desenhar o bonequinho na forca

function head() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.lineWidth = 5;
  context.beginPath();
  context.arc(100, 45, 20, 0, Math.PI * 2, true);
  context.closePath();
  context.stroke();
}

function body() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(100, 65);
  context.lineTo(100, 130);
  context.stroke();
}

function rightArm() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(100, 75);
  context.lineTo(60, 100);
  context.stroke();
}
function leftArm() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(100, 75);
  context.lineTo(140, 100);
  context.stroke();
}

function rightLeg() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(100, 130);
  context.lineTo(80, 190);
  context.stroke();
}
function leftLeg() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(100, 130);
  context.lineTo(125, 190);
  context.stroke();
}

function suporte() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.strokeStyle = '#444';
  context.lineWidth = 10;
  context.beginPath();
  context.moveTo(175, 225);
  context.lineTo(5, 225);
  context.moveTo(40, 225);
  context.lineTo(25, 5);
  context.lineTo(100, 5);
  context.lineTo(100, 25);
  context.stroke();
}

//funções que montam a tela inicial

function decodeMusic (string) {
  var decoded = ""
  for (var i = 0; i < string.length; i++) {
    (string[i] === " ") ? decoded = decoded + "-" : decoded = decoded + "_";
  }
  return decoded
}

async function showMusica(access_token) {
  var $guess = $('#palavra');
  var $tip = $('#tip');
  var musica = await getArtists(access_token);
  var decode = decodeMusic(musica.song)
  $guess.attr("data-value", musica.song)
  $guess.html(decode);
  $tip.html("Essa música é de: " + musica.artist);
  setModal();
}


function Restart () {
  window.location.reload()
}

function setModal () {
  var modal = document.querySelector(".modal");
  var btn = document.querySelector(".btn-open-modal");
  var span = document.querySelector(".close");
  modal.style.display = "block";

  btn.onclick = function() {
    modal.style.display = "block";
  }

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

window.onload = () => {
    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
    }

    var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if (error) {
      alert('There was an error during the authentication');
    } else {
        if (access_token) {
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                  $('#login').hide();
                  $('#loggedin').show();
                  $('#guessgame').show();
                  showMusica(access_token)
                  suporte()
                }
            });
        } else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();
            $('#guessgame').hide();
            $('#restart').hide();
        }

      document.getElementById('obtain-new-token').addEventListener('click', function() {
          $.ajax({
          url: '/refresh_token',
          data: {
              'refresh_token': refresh_token
          }
          }).done(function(data) {
          access_token = data.access_token;
          });
      }, false);
      }
};
function Digitar(letra) {
  var txtarea = document.getElementById("write")
  var html = txtarea.value
  if ($(`#${letra}`).hasClass("disable")) {
    return false
  }
  if (letra === "del") {
    $write.html(html.substr(0, html.length - 1));
    return false;
  }
  if (letra === "try") {
    tryLetter()
    return false;
  }
  if (letra === "guess") {
    guess()
    return false;
  }

  txtarea.value = txtarea.value + letra;

};

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
      alert("Você ganhou")
    }
  } else {
    if (!letterWrong.includes(txtarea.value)) {
      letterWrong.push(txtarea.value)
      $tries.html(tried+" "+txtarea.value)
      $(`#${txtarea.value}`).addClass("disable")
      hangman[(letterWrong.length-1)]()
      if (letterWrong.length === 6){
        alert("Você perdeu! A resposta era " + answer)
        var restart = document.getElementById("restart")
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
    var restart = document.getElementById("restart")
    restart.style.display = "flex";
  } else {
    alert("Você perdeu! A resposta era " + answer)
    var hangmanLose = [head(), body(), leftArm(), rightArm(), leftLeg(), rightLeg()]
    var restart = document.getElementById("restart")
    restart.style.display = "flex";
  }
}

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
  console.log(response)
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


async function showMusica(access_token) {
  var $guess = $('#palavra');
  var $tip = $('#tip');
  var musica = await getArtists(access_token);
  console.log(musica.song)
  var decode = decodeMusic(musica.song)
  $guess.attr("data-value", musica.song)
  $guess.html(decode);
  $tip.html("Essa música é de: " + musica.artist);
  setModal();
}

function decodeMusic (string) {
  var decoded = ""
  for (var i = 0; i < string.length; i++) {
    if (string[i] === " ") {
      decoded = decoded + "-"
    } else {
      decoded = decoded + "_"
    }
  }
  return decoded
}

function desenhaTela() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
}

function head() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.lineWidth = 5;
  context.beginPath();
  context.arc(100, 50, 25, 0, Math.PI * 2, true);
  context.closePath();
  context.stroke();
}

function body() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(100, 75);
  context.lineTo(100, 140);
  context.stroke();
}

function rightArm() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(100, 85);
  context.lineTo(60, 100);
  context.stroke();
}
function leftArm() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(100, 85);
  context.lineTo(140, 100);
  context.stroke();
}

function rightLeg() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(100, 140);
  context.lineTo(80, 190);
  context.stroke();
}
function leftLeg() {
  const canvas = document.getElementById("forca");
  const context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(100, 140);
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

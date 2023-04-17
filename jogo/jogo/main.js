function Digitar(letra) {
  var $write = $('#write');
  var html = $write.html();

  if (letra === "del") {
    $write.html(html.substr(0, html.length - 1));
    return false;
  }

  if (letra === "try") {
    tryLetter(html)
    return false;
  }

  if (letra === "guess") {
    guess(html)
    return false;
  }

  $write.html($write.html() + letra);

};

var letterWrong = []
var hangman = [head, body, leftArm, rightArm, leftLeg, rightLeg]

function tryLetter(letra) {
  var $guess = $('#palavra');
  var $tries = $('#tries');
  var tried = $tries.html();
  var answer = $guess.attr("data-value")
  var update = ""
  var decodedAnswer = $guess.html();
  console.log(decodedAnswer)
  var $write = $('#write');
  if (answer.toLowerCase().includes(letra)){
    for (var i = 0; i < answer.length; i++) {
      if (answer[i].toLowerCase()===letra){
        update = update + answer[i]
      } else {
        update = update + decodedAnswer[i]
      }
    }
    $guess.html(update)
    if (!update.includes("_")){
      alert("Você ganhou")
    }
  } else {
    letterWrong.push(letra)
    hangman[(letterWrong.length-1)]()
    if (letterWrong.length === 6){
      alert("Você perdeu!")
      $('#restart').show();
    }
  }
  $write.html("")
  $tries.html(tried+" "+letra)
}

function guess (palavra) {
  var $guess = $('#palavra');
  var answer = $guess.attr("data-value").toLowerCase()
  if (palavra === answer) {
    alert("Você ganhou")
  } else {
    alert("Você perdeu!")
    var hangmanLose = [head(), body(), leftArm(), rightArm(), leftLeg(), rightLeg()]
    $('#restart').show();
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
  const getRandom = Math.floor(Math.random() * 10)
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
  while (song.name.includes("-")) {
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
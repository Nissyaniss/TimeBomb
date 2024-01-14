const EventSrc = new EventSource('/lobby/events');
EventSrc.addEventListener('init', function (e) {
	const data = JSON.parse(e.data);
	document.getElementsByTagName('title')[0].innerHTML = data.lobby;
	document.getElementById('playerList.Code').innerHTML = data.lobby;
	let list = document.createElement('ul');
	list.id = 'playerList.List'
	for (const p of data.players) {
		let player = document.createElement('li');
		player.id = p.id;
		if (p.ready) {
			player.classList.add('ready');
		}
		else {
			player.classList.add('unready');
		}
		player.innerHTML = p.name;
		list.appendChild(player);
	};
	const players = Object.fromEntries(data.players.map(players => [players.id, players.name]));
	window.players = players;
	document.getElementById('playerList').appendChild(list);
});

EventSrc.addEventListener('join', function (e) {
	const data = JSON.parse(e.data);
	if (data.player.id in players) {
		return;
	}
	let player = document.createElement('li');
	player.id = data.player.id;
	player.innerHTML = data.player.name;
	player.classList.add('unready');
	document.getElementById('playerList.List').appendChild(player);
	players[data.player.id] = data.player.name;
});

EventSrc.addEventListener('leave', function (e) {
	const data = JSON.parse(e.data);
	if (!(data.player in players)) {
		return;
	}
	let player = document.getElementById(data.player);
	player.parentNode.removeChild(player);
	delete players[data.player];
});

let numberOfPlayersReady = 0;

EventSrc.addEventListener('ready', function (e) {
	const data = JSON.parse(e.data);
	if (!(data.player in players)) {
		return;
	}
	if (data.state) {
		let player = document.getElementById(data.player);
		player.classList.remove('unready');
		player.classList.add('ready');
		numberOfPlayersReady++;
	}
	else {
		let player = document.getElementById(data.player);
		player.classList.remove('ready');
		player.classList.add('unready');
		numberOfPlayersReady--;
	}
	if (numberOfPlayersReady == Object.keys(players).length) {
		console.log('All players are ready');
		document.getElementById('startButton').firstElementChild.removeAttribute('disabled');
	}
	else {
		document.getElementById('startButton').firstElementChild.setAttribute('disabled', '');
	}
});

let isReady = false;

function ready() {
	if (! isReady) {
		fetch('/lobby/ready?state=true', { method: 'GET' });
		document.getElementById('readyButton').firstElementChild.innerHTML = 'UnReady';
		isReady = true;
	}
	else {
		fetch('/lobby/ready?state=false', { method: 'GET' });
		document.getElementById('readyButton').firstElementChild.innerHTML = 'Ready';
		isReady = false;
	}
}

EventSrc.addEventListener('start', function (e) {
	window.location.replace = '/game.html';
});

function start() {
	fetch('/lobby/start', { method: 'GET' });
}

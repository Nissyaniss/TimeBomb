const EventSrc = new EventSource('/events');
EventSrc.addEventListener('init', function(e) {
	const data = JSON.parse(e.data);
	document.getElementsByTagName('title')[0].innerHTML = data.lobby;
	document.getElementById('playerList.Code').innerHTML = data.lobby;
	let list = document.createElement('ul');
	list.id = 'playerList.List'
	for (const p of data.players) {
		let player = document.createElement('li');
		player.id = p.id;
		player.innerHTML = p.name;
		list.appendChild(player);
	};
	const players = Object.fromEntries(data.players.map(players => [players.id, players.name]));
	window.players = players;
	document.getElementById('playerList').appendChild(list);
	if (Object.keys(players).length < 4) {
		document.getElementById('startButton').firstElementChild.innerHTML = `Start ${Object.keys(players).length} / 4`;
		document.getElementById('startButton').firstElementChild.classList.add('disabled');
	}
	else {
		document.getElementById('startButton').firstElementChild.classList.remove('disabled');
		document.getElementById('startButton').firstElementChild.innerHTML = `Start`;
	}
});

EventSrc.addEventListener('join', function(e) {
	const data = JSON.parse(e.data);
	console.log(Object.keys(players).length);
	if (data.player.id in players) {
		return;
	}
	let player = document.createElement('li');
	player.id = data.player.id;
	player.innerHTML = data.player.name;
	document.getElementById('playerList.List').appendChild(player);
	players[data.player.id] = data.player.name;
	if (Object.keys(players).length < 4) {
		document.getElementById('startButton').firstElementChild.innerHTML = `Start ${Object.keys(players).length} / 4`;
		document.getElementById('startButton').firstElementChild.classList.add('disabled');
	}
	else {
		document.getElementById('startButton').firstElementChild.classList.remove('disabled');
		document.getElementById('startButton').firstElementChild.innerHTML = `Start`;
	}
});

EventSrc.addEventListener('leave', function(e) {
	const data = JSON.parse(e.data);
	if (!(data.player in players)) {
		return;
	}
	let player = document.getElementById(data.player);
	player.parentNode.removeChild(player);
	delete players[data.player];
	if (Object.keys(players).length < 4) {
		document.getElementById('startButton').firstElementChild.innerHTML = `Start ${Object.keys(players).length} / 4`;
		document.getElementById('startButton').firstElementChild.classList.add('disabled');
	}
	else {
		document.getElementById('startButton').firstElementChild.classList.remove('disabled');
		document.getElementById('startButton').firstElementChild.innerHTML = `Start`;
	}
});
// === LOG IN USER ===
fetch('/api/session', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'XSRF-TOKEN': ``,
	},
	body: JSON.stringify({ credential: 'demo@user.io', password: 'password' }),
})
	.then(res => res.json())
	.then(data => console.log(data));

// === SIGN UP ===
fetch('/api/users', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'XSRF-TOKEN': '',
	},
	body: JSON.stringify({
		email: 'spidey@spider.man',
		username: 'Spidey',
		password: 'password',
	}),
})
	.then(res => res.json())
	.then(data => console.log(data));

// === CREATE A GROUP ===
fetch('/api/groups', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'XSRF-TOKEN': ``,
	},
	body: JSON.stringify({
		name: 'Evening Tennis on the Water',
		about:
			'Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.',
		type: 'In person',
		private: true,
		city: 'Augusta',
		state: 'GA',
	}),
})
	.then(res => res.json())
	.then(data => console.log(data));

// === EDIT A GROUP ===
fetch('/api/groups/1', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'XSRF-TOKEN': ``,
	},
	body: JSON.stringify({
		name: 'Evening Tennis on the Water',
		about:
			'Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.',
		type: 'In person',
		private: true,
		city: 'Augusta',
		state: 'GA',
	}),
})
	.then(res => res.json())
	.then(data => console.log(data));

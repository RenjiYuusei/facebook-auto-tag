class fb {
	static Alert(e, t) {
		let n = document.getElementById('notify');
		n.innerHTML = '';
		let o = document.createElement('div');
		o.classList.add('alert', e);
		let s = document.createElement('span');
		s.classList.add('alertClose'),
			(s.innerHTML = 'X'),
			(s.onclick = () => {
				(n.innerHTML = ''), (n.style.display = 'none');
			});
		let a = document.createElement('span');
		a.classList.add('alertText'),
			(a.innerHTML = t + '<br class="clear"/>'),
			o.appendChild(s),
			o.appendChild(a),
			n.appendChild(o),
			(n.style.display = 'block'),
			setTimeout(() => {
				(n.innerHTML = ''), (n.style.display = 'none');
			}, 2550);
	}
}
const fb_start = document.getElementById('wt-button'),
	fb_pause = document.getElementById('wt-reset'),
	fb_info = document.getElementById('wt-info'),
	fb_content = document.getElementById('wt-content'),
	fb_fast = document.getElementById('fast'),
	fb_history = document.getElementById('wt-history');
let fast_mod = !1;
fb_fast.addEventListener('change', () => {
	fast_mod = fb_fast.checked;
});

const SavefbHistory = info => {
	chrome.storage.local.get(['fb-history'], data => {
		let history = data['fb-history'] || [];
		if (!history.includes(info)) {
			history.push(info);
			chrome.storage.local.set({
				'fb-history': history,
			});
			updateHistorySelect(history);
		}
	});
};

const updateHistorySelect = history => {
	fb_history.innerHTML = '<option value="">-- Chọn thông tin --</option>';
	history.forEach(info => {
		const option = document.createElement('option');
		option.value = info;
		option.textContent = info;
		fb_history.appendChild(option);
	});
};

fb_history.addEventListener('change', () => {
	const selectedInfo = fb_history.value;
	if (selectedInfo) {
		fb_info.value = selectedInfo;
	}
});

const SavefbInfo = e => {
		chrome.storage.local.get(['fb-info'], t => {
			t['fb-info'] && t['fb-info'] === e
				? (chrome.storage.local.remove('fb-info'),
				  chrome.storage.local.set({
						'fb-info': e,
				  }))
				: chrome.storage.local.set({
						'fb-info': e,
				  });
		});
	},
	GetfbInfo = e => {
		chrome.storage.local.get(['fb-info'], t => {
			t['fb-info'] ? e(t['fb-info']) : e(null);
		});
	},
	SavefbContent = e => {
		chrome.storage.local.get(['fb-content'], t => {
			t['fb-content']
				? (chrome.storage.local.remove('fb-content'),
				  chrome.storage.local.set({
						'fb-content': e,
				  }))
				: chrome.storage.local.set({
						'fb-content': e,
				  });
		});
	},
	GetfbContent = e => {
		chrome.storage.local.get(['fb-content'], t => {
			t['fb-content'] ? e(t['fb-content']) : e(null);
		});
	};

function Cookies() {
	document.cookie.split(';').forEach(function (e) {
		document.cookie = e.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
	});
}
fb_start.addEventListener('click', () => {
	chrome.tabs.query(
		{
			active: !0,
			currentWindow: !0,
		},
		e => {
			const t = e[0].url;
			var n, o;
			if (!/^https:\/\/www\.facebook\.com\/messages\/t\/.+$/.test(t)) {
				fb.Alert('warning', 'Đang chuyển hướng đến trang Messenger...');
				setTimeout(() => {
					chrome.tabs.update(e[0].id, {
						url: 'https://www.facebook.com/messages/t/',
					});
				}, 5000);
				return;
			}

			const info = fb_info.value.trim();
			if ('' === info) return void alert('Thông tin không được để trống!');
			if (!/^\d+\|.+$/.test(info)) return void alert('Thông tin phải là định dạng: uid|fullname');
			if (fb_content.value.length > 999) return void alert('Nội dung không được vượt quá 300 ký tự.');
			const [a, c] = info.split('|'),
				r = fb_content.value
					.split(',')
					.map(e => e.trim())
					.filter(e => e);
			(Tag = !0),
				(o = info),
				SavefbHistory(info),
				chrome.storage.local.get(['fb-info'], e => {
					e['fb-info'] && e['fb-info'] === o
						? (chrome.storage.local.remove('fb-info'),
						  chrome.storage.local.set({
								'fb-info': o,
						  }))
						: chrome.storage.local.set({
								'fb-info': o,
						  });
				}),
				(n = fb_content.value),
				chrome.storage.local.get(['fb-content'], e => {
					e['fb-content']
						? (chrome.storage.local.remove('fb-content'),
						  chrome.storage.local.set({
								'fb-content': n,
						  }))
						: chrome.storage.local.set({
								'fb-content': n,
						  });
				}),
				Cookies(),
				Loop(a, c, r.length > 0 ? r : [''], e[0].id);
		}
	);
});
const Loop = async (e, t, n, o) => {
	let s = 0;
	for (; Tag; ) {
		s >= n.length && (s = 0),
			await chrome.scripting
				.executeScript({
					target: {
						tabId: o,
					},
					func: (e, t, n) =>
						(async (e, t, n) => {
							let o = t,
								s = e,
								a = document.querySelector('div[contenteditable="true"][role="textbox"][data-lexical-editor="true"]');
							if (a) {
								function c(e) {
									let t = new InputEvent('input', {
										inputType: 'insertText',
										data: e,
										bubbles: !0,
										cancelable: !0,
									});
									a.dispatchEvent(t), ((a.firstChild || a.appendChild(document.createElement('p'))).textContent += e);
								}
								a.focus(), (a.innerHTML = ''), c('@' + o), await new Promise(e => setTimeout(e, 150));
								let e = document.querySelector(`li[id="${s} name"] > div[role="presentation"]`);
								if (e) {
									e.click(), await new Promise(e => setTimeout(e, 150)), n && n.trim() && (c(' ' + n), await new Promise(e => setTimeout(e, 150)));
									let t = new KeyboardEvent('keydown', {
										bubbles: !0,
										cancelable: !0,
										key: 'Enter',
										keyCode: 13,
									});
									return a.dispatchEvent(t), !0;
								}
								return alert('Error code: 0x0000001'), !1;
							}
							return alert('Error code: 0x0000002'), !1;
						})(e, t, n),
					args: [e, t, n[s]],
				})
				.catch(e => (console.error('Error: ', e), [!1])),
			s++;
		const a = fast_mod ? 40 : 1000;
		await new Promise(e => setTimeout(e, a));
	}
};
fb_pause.addEventListener('click', () => {
	(Tag = !1), fb.Alert('success', 'Dừng auto tag thành công!');
}),
	chrome.runtime.onMessage.addListener((e, t, n) => {
		'notify' === e.type && alert(e.message);
	}),
	GetfbContent(e => {
		e && (fb_content.value = e);
	}),
	GetfbInfo(e => {
		e && (fb_info.value = e);
	});

// Load history on startup
chrome.storage.local.get(['fb-history'], data => {
	if (data['fb-history']) {
		updateHistorySelect(data['fb-history']);
	}
});

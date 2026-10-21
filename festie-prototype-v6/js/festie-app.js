/*
 * festie-app.js
 * Festie 프로토타입의 화면 상태와 동작 (디자인 캔버스 "Festie 피드백 반영"의 앱 컴포넌트 그대로)
 * 화면 마크업은 index.html 안의 <template id="festie-screens"> 에 있어요.
 */
window.FestieApp = (function () {
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var base = {
      screen: 'discover',
      added: false,
      genre: '전체',
      query: '', recent: ['핑크팬서리스', '올림픽공원', '록 페스티벌'], searchFrom: 'discover',
      detailFest: 'gmf', detailFrom: 'discover', notify: {},
      artistId: 'd1m4', artistFrom: 'detail',
      picks: {}, savedDays: {}, tteDay: 1, ttDay: 1, sheet: '',
      checked: {}, custom: [], draft: '',
      plExcluded: {}, plSheet: false, exportedTo: '',
      tkType: '', tkVendor: '', tkNumber: '', tkSaved: null,
      photos: [false, false, false, false, false, false, false],
      highlight: '', rating: 0, seen: {}, review: '',
      reportSaved: false, editingReport: false, reportBackup: null, cardDismissed: false, shareOpen: false, sharedMsg: '',
      toast: '', toastIcon: '✓',
      tGenres: { '인디': true, '록': true }, tArtists: { '페퍼톤스': true, '핑크팬서리스': true }, nick: '페스티벌 러버',
      liked: { '핑크팬서리스': true, '페퍼톤스': true, '잔나비': true, '혁오': true, '타일라': true, '실리카겔': true },
      alerts: { lineup: true, dday: true, stage: true, report: true, recommend: false },
      connected: {}, connectApp: '', tkQr: false, passFrom: 'ticket', dday: false,
      extra: [], prepEdit: false, removeKey: '', storyMode: 'story', history: false, recYear: '전체', noticesRead: false, scrollTo: '', kb: false, kbShift: false, kbEn: false, dashFrom: 'prep', push: false, pushShown: false
    };
    this.state = Object.assign(base, this.preset((props && props.start) || 'splash'));
  }

  preset(start) {
    var day1 = { d1m2: true, d1m3: true, d1m4: true };
    var both = { d1m2: true, d1m3: true, d1m4: true, d2s1: true, d2m3: true, d2m4: true };
    var someChecked = { e1: true, e2: true, e3: true, w1: true };
    var allChecked = { e1: true, e2: true, e3: true, e4: true, e5: true, w1: true, w2: true, w3: true, w4: true, c1: true, c2: true, c3: true, c4: true };
    var ticket = { type: '2일권', vendor: '인터파크 티켓', number: 'T2610170418', qr: true };
    var done = { added: true, picks: both, savedDays: { 1: true, 2: true }, checked: allChecked, exportedTo: 'Spotify', connected: { 'Spotify': true }, tkType: '2일권', tkVendor: '인터파크 티켓', tkNumber: 'T2610170418', tkSaved: ticket, tkQr: true };
    var filled = { photos: [true, false, true, true, false, true, false], highlight: '핑크팬서리스의 Boy’s a liar, 다 같이 떼창했다', rating: 5, seen: { d1m2: true, d1m4: true, d2s1: true, d2m4: true }, review: '해 질 녘 페퍼톤스로 시작해서 핑크팬서리스로 끝난 첫날. 둘째 날은 타일라의 Water 무대가 오래 남을 것 같다.' };
    function m() { var o = {}; for (var i = 0; i < arguments.length; i++) Object.assign(o, arguments[i]); return o; }
    switch (start) {
      case 'genre': return { genre: '인디' };
      case 'search': return { screen: 'search', kb: true };
      case 'searchResult': return { screen: 'search', query: '핑크팬서리스' };
      case 'detail': return { screen: 'detail' };
      case 'artist': return { screen: 'artist' };
      case 'prepEmpty': return { screen: 'prep' };
      case 'prepList': return { screen: 'prep', added: true, picks: day1, savedDays: { 1: true }, checked: someChecked };
      case 'dashStart': return { screen: 'dash', added: true };
      case 'tte': return { screen: 'tte', added: true, picks: { d1m2: true, d1m4: true } };
      case 'tteBlocked': return { screen: 'tte', added: true, picks: { d1m2: true, d1m4: true }, toast: '‘핑크팬서리스’ 공연과 시간이 겹쳐 담을 수 없어요', toastIcon: '!' };
      case 'tteSheet1': return { screen: 'tte', added: true, picks: day1, savedDays: { 1: true }, sheet: 'day1' };
      case 'tteOnlyDay1': return { screen: 'prep', added: true, picks: day1, savedDays: { 1: true }, toast: '1일차만 설정했어요 · 2일차는 준비하기에서 언제든 추가할 수 있어요', toastIcon: '✓' };
      case 'tte2': return { screen: 'tte', added: true, picks: { d1m2: true, d1m3: true, d1m4: true, d2s1: true }, savedDays: { 1: true }, tteDay: 2 };
      case 'tteSheetAll': return { screen: 'tte', added: true, picks: both, savedDays: { 1: true, 2: true }, tteDay: 2, sheet: 'all' };
      case 'tt': return { screen: 'tt', added: true, picks: both, savedDays: { 1: true, 2: true } };
      case 'dashMid': return { screen: 'dash', added: true, picks: day1, savedDays: { 1: true }, checked: someChecked };
      case 'check': return { screen: 'check', added: true, picks: day1, savedDays: { 1: true }, checked: someChecked };
      case 'playlist': return { screen: 'playlist', added: true, picks: both, savedDays: { 1: true, 2: true }, plExcluded: { 'd1m3-2': true } };
      case 'playlistSheet': return { screen: 'playlist', added: true, picks: both, savedDays: { 1: true, 2: true }, plSheet: true };
      case 'ticket': return { screen: 'ticket', added: true, picks: both, savedDays: { 1: true, 2: true }, tkType: '2일권', tkVendor: '인터파크 티켓' };
      case 'dashDone': return m(done, { screen: 'dash' });
      case 'summary': return m(done, { screen: 'summary' });
      case 'recordLocked': return { screen: 'record', added: true, picks: day1, savedDays: { 1: true }, checked: someChecked };
      case 'recordReady': return m(done, { screen: 'record', checked: someChecked });
      case 'reportEdit': return m(done, { screen: 'reportEdit' });
      case 'reportFilled': return m(done, filled, { screen: 'reportEdit' });
      case 'report': return m(done, filled, { screen: 'report', reportSaved: true });
      case 'reportEditing': return m(done, filled, { screen: 'reportEdit', reportSaved: true, editingReport: true, reportBackup: { photos: filled.photos.slice(), highlight: filled.highlight, rating: filled.rating, seen: Object.assign({}, filled.seen), review: filled.review } });
      case 'recordSaved': return m(done, filled, { screen: 'record', reportSaved: true });
      case 'my': return m(done, { screen: 'my' });
      // ----- 시작 · 알림 · 탐색 상태 -----
      case 'splash': return { screen: 'splash', tGenres: {}, tArtists: {} };
      case 'onboard': return { screen: 'onboard', tGenres: {}, tArtists: {} };
      case 'onboardPicked': return { screen: 'onboard', tGenres: { '인디': true, '록': true }, tArtists: { '페퍼톤스': true, '핑크팬서리스': true, '잔나비': true } };
      case 'notices': return m(done, { screen: 'notices', checked: someChecked });
      case 'genreEmpty': return { genre: '재즈' };
      case 'searchEmpty': return { screen: 'search', query: '블랙핑크' };
      case 'detailUnreleased': return { screen: 'detail', detailFest: 'sejong' };
      case 'detailAdded': return { screen: 'detail', detailFest: 'sejong', notify: { sejong: true }, extra: ['sejong'] };
      case 'artistAdded': return { screen: 'artist', artistId: 'd1m4', added: true, picks: { d1m4: true }, savedDays: { 1: true } };
      case 'artistBlocked': return { screen: 'artist', artistId: 'd1s4', added: true, picks: day1, savedDays: { 1: true } };
      // ----- 준비 상태 · 공연 당일 -----
      case 'prepMulti': return m(done, { screen: 'prep', checked: someChecked, extra: ['sejong'] });
      case 'prepRemove': return m(done, { screen: 'prep', checked: someChecked, extra: ['sejong'], prepEdit: true, removeKey: 'gmf' });
      case 'checkCustom': return { screen: 'check', added: true, picks: day1, savedDays: { 1: true }, checked: m(someChecked, { x1: true }), custom: [{ id: 'x1', label: '돗자리' }, { id: 'x2', label: '응원 타월' }], scrollTo: 'bottom' };
      case 'checkAll': return { screen: 'check', added: true, picks: day1, savedDays: { 1: true }, checked: allChecked, toast: '짐을 모두 챙겼어요', toastIcon: '✓' };
      case 'playlistDone': return { screen: 'playlist', added: true, picks: both, savedDays: { 1: true, 2: true }, exportedTo: 'Spotify', connected: { 'Spotify': true } };
      case 'connectSheet': return { screen: 'playlist', added: true, picks: both, savedDays: { 1: true, 2: true }, connectApp: 'Spotify' };
      case 'ticketQr': return { screen: 'ticket', added: true, picks: both, savedDays: { 1: true, 2: true }, tkType: '2일권', tkVendor: '인터파크 티켓', tkNumber: 'T2610170418', tkQr: true };
      case 'ticketSaved': return m(done, { screen: 'ticket' });
      case 'pushDday': return m(done, { screen: 'dash', push: true, pushShown: true });
      case 'today': return m(done, { screen: 'today', dday: true, checked: someChecked });
      case 'pass': return m(done, { screen: 'pass', dday: true, passFrom: 'today' });
      // ----- 기록 · 공유 · MY 상세 -----
      case 'reportInvalid': return m(done, { screen: 'reportEdit', rating: 4, highlight: '핑크팬서리스의 Boy’s a liar, 다 같이 떼창했다', toast: '대표 사진을 1장 이상 골라주세요', toastIcon: '!' });
      case 'shareSheet': return m(done, filled, { screen: 'report', reportSaved: true, shareOpen: true });
      case 'story': return m(done, filled, { screen: 'story', reportSaved: true, storyMode: 'story' });
      case 'recordLater': return m(done, { screen: 'record', cardDismissed: true, checked: someChecked });
      case 'recordHistory': return m(done, filled, { screen: 'record', reportSaved: true, history: true });
      case 'myProfile': return m(done, { screen: 'myProfile' });
      case 'myLikes': return m(done, { screen: 'myLikes' });
      case 'myNotify': return m(done, { screen: 'myNotify' });
      case 'myMusic': return m(done, { screen: 'myMusic' });
      case 'mySettings': return m(done, { screen: 'mySettings' });
      default: return {};
    }
  }

  componentDidMount() {
    var to = this.state.scrollTo;
    if (!to) return;
    setTimeout(function () {
      try {
        var main = document.querySelector('main');
        if (main) main.scrollTop = to === 'bottom' ? main.scrollHeight : main.scrollTop;
      } catch (e) {}
    }, 0);
  }

  componentWillUnmount() {
    if (this._toastTimer) clearTimeout(this._toastTimer);
    if (this._pushTimer) clearTimeout(this._pushTimer);
    if (this._pushHide) clearTimeout(this._pushHide);
  }

  renderVals() {
    var self = this;
    var st = this.state;
    var INK = '#0A0A0A', LAV = '#F3D9FF', MUTED = 'rgba(10,10,10,0.68)';

    // ---------- helpers ----------
    function toast(msg, icon, extra) {
      var p = Object.assign({ toast: msg, toastIcon: icon || '✓' }, extra || {});
      self.setState(p);
      if (self._toastTimer) clearTimeout(self._toastTimer);
      self._toastTimer = setTimeout(function () { self.setState({ toast: '' }); }, 2600);
    }
    function nav(screen, extra) {
      return function () {
        self.setState(Object.assign({ screen: screen, sheet: '', plSheet: false, shareOpen: false, toast: '' }, extra || {}));
        try { var m = document.querySelector('#screen-' + screen + ' main'); if (m) m.scrollTop = 0; } catch (e) {}
      };
    }
    function focusSearchSoon() {
      // iOS opens the keyboard only from a focus inside the tap: borrow a hidden field, then move focus to the real one.
      var proxy = null;
      try {
        proxy = document.createElement('input');
        proxy.setAttribute('aria-hidden', 'true');
        proxy.setAttribute('tabindex', '-1');
        proxy.style.cssText = 'position: fixed; top: 0; left: 0; width: 1px; height: 1px; opacity: 0; font-size: 16px; border: 0; padding: 0';
        document.body.appendChild(proxy);
        proxy.focus();
      } catch (e) { proxy = null; }
      var tries = 0;
      (function move() {
        var el = null;
        try { el = document.getElementById('festie-search'); } catch (e) {}
        if (el) { try { el.focus(); } catch (e) {} }
        if (!el && tries++ < 12) { setTimeout(move, 30); return; }
        if (proxy && proxy.parentNode) proxy.parentNode.removeChild(proxy);
      })();
    }
    function openSearch(from, q) {
      return function () {
        var query = q || '';
        if (query) {
          var rec = [query].concat(st.recent.filter(function (r) { return r !== query; })).slice(0, 6);
          self.setState({ screen: 'search', searchFrom: from, query: query, recent: rec, toast: '', kb: false });
        } else {
          self.setState({ screen: 'search', searchFrom: from, query: '', toast: '', kb: true, kbShift: false });
          focusSearchSoon();
        }
      };
    }
    function norm(s) { return String(s || '').toLowerCase().replace(/[\s·\-–]/g, ''); }
    function toMin(t) { var p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
    function kTime(t) {
      var p = t.split(':'), h = Number(p[0]);
      return (h < 12 ? '오전 ' : '오후 ') + (h > 12 ? h - 12 : h) + ':' + p[1];
    }
    function kRange(a, b) { return kTime(a) + ' – ' + kTime(b).replace(/^오[전후] /, ''); }
    function dur(m) { var h = Math.floor(m / 60), r = m % 60; return ((h ? h + '시간 ' : '') + (r ? r + '분' : '')).trim(); }

    // ---------- festivals ----------
    var FEST = {
      gmf: { ko: '그랜드 민트 페스티벌 2026', short: '그랜드 민트 페스티벌', en: 'Grand Mint Festival 2026', date: '10월 17–18일', dateLong: '10월 17일(토) – 18일(일)', city: '서울', venue: '서울 올림픽공원', genre: '인디', dday: 4, poster: 'assets/images/posters/grand-mint-festival.jpg', hot: 3120 },
      nol: { ko: '놀 페스티벌 2026', short: '놀 페스티벌', en: 'NOL Festival 2026', date: '10월 17–18일', dateLong: '10월 17일(토) – 18일(일)', city: '고양', venue: '경기 고양', genre: '팝', dday: 4, poster: 'assets/images/posters/nol-festival.jpg', hot: 1840 },
      inmufe: { ko: '인뮤페 2026', short: '인뮤페', en: 'INMUFE 2026', date: '10월 17–18일', dateLong: '10월 17일(토) – 18일(일)', city: '수원', venue: '경기 수원', genre: '인디', dday: 4, poster: 'assets/images/posters/inmufe.jpg', hot: 960 },
      sejong: { ko: '세종 보헤미안 뮤직 페스티벌', short: '세종 보헤미안', en: 'Sejong Bohemian Music Festival', date: '10월 30일 – 11월 1일', dateLong: '10월 30일(금) – 11월 1일(일)', city: '세종', venue: '세종', genre: '인디', dday: 17, poster: 'assets/images/posters/sejong-bohemian.jpg', hot: 1210 },
      wonderlivet: { ko: '원더리벳 2026', short: '원더리벳', en: 'Wonderlivet 2026', date: '11월 20–22일', dateLong: '11월 20일(금) – 22일(일)', city: '고양', venue: '경기 고양', genre: 'J-POP', dday: 38, poster: 'assets/images/posters/wonderlivet.jpg', hot: 2280 },
      hero: { ko: '히어로 록 페스티벌 2026', short: '히어로 록 페스티벌', en: 'Hero Rock Festival 2026', date: '12월 18–20일', dateLong: '12월 18일(금) – 20일(일)', city: '인천', venue: '인천', genre: '록', dday: 66, poster: 'assets/images/posters/hero-rock-festival.jpg', hot: 1530 },
      countdown: { ko: '카운트다운 판타지 2026–2027', short: '카운트다운 판타지', en: 'Countdown Fantasy 2026–2027', date: '12월 31일', dateLong: '12월 31일(목)', city: '고양', venue: '경기 고양', genre: '록', dday: 79, poster: 'assets/images/posters/countdown-fantasy.jpg', hot: 1390 }
    };
    var FEST_KEYS = ['gmf', 'nol', 'inmufe', 'sejong', 'wonderlivet', 'hero', 'countdown'];
    function openDetail(key, from) { return nav('detail', { detailFest: key, detailFrom: from }); }
    function festCard(key, from) {
      var f = FEST[key];
      return { key: key, open: openDetail(key, from), ko: f.ko, name: f.short, poster: f.poster, dday: 'D-' + f.dday, meta: f.date + ' · ' + f.city };
    }

    // ---------- lineup ----------
    var LINEUP = {
      1: {
        main: [['d1m1', '드래곤포니', '16:00', '16:50'], ['d1m2', '페퍼톤스', '17:20', '18:10'], ['d1m3', '잔나비', '18:40', '19:40'], ['d1m4', '핑크팬서리스', '20:20', '21:30']],
        s2: [['d1s1', '쏜애플', '16:10', '17:00'], ['d1s2', '데이식스', '17:30', '18:20'], ['d1s3', '터치드', '18:50', '19:50'], ['d1s4', '데이브레이크', '20:30', '21:40']]
      },
      2: {
        main: [['d2m1', '루시', '16:00', '16:50'], ['d2m2', '혁오', '17:20', '18:10'], ['d2m3', '씨엔블루', '18:40', '19:40'], ['d2m4', '타일라', '20:20', '21:30']],
        s2: [['d2s1', '넬', '16:10', '17:00'], ['d2s2', '엔플라잉', '17:30', '18:30'], ['d2s3', '실리카겔', '19:00', '20:00'], ['d2s4', '국카스텐', '20:40', '21:50']]
      }
    };
    var STAGE = { main: '민트 브리즈 스테이지', s2: '클럽 미드나잇 선셋' };
    var STAGE_ROLE = { main: '메인 스테이지', s2: '서브 스테이지' };
    var DAYS = { 1: { label: '1일차', date: '10월 17일(토)' }, 2: { label: '2일차', date: '10월 18일(일)' } };
    var SONGS = {
      '드래곤포니': ['POP UP', 'Not Out'],
      '페퍼톤스': ['CHANCE!', '행운을 빈다', 'Shine', 'FAST', 'New Hippie Generation', '21세기의 어떤 날'],
      '잔나비': ['주저하는 연인들을 위해', '뜨거운 여름밤은 가고 남은 건 볼품없지만', '꿈과 책과 힘과 벽', '가을밤에 든 생각'],
      '핑크팬서리스': ['Boy’s a liar', 'Pain', 'Just for me', 'Break It Off', 'Mosquito'],
      '실리카겔': ['NO PAIN', 'Tik Tak Tok', 'Desert Eagle'],
      '데이식스': ['한 페이지가 될 수 있게', '예뻤어', 'Zombie', 'Welcome to the Show'],
      '터치드': ['Highlight', 'Hi Bully', 'Fallen Angel', 'Dynamite', 'Last Day', 'Stand Up!'],
      '데이브레이크': ['들었다 놨다', '좋다', '꽃길만 걷게 해줄게'],
      '루시': ['개화', '아니 근데 진짜', '조깅'],
      '혁오': ['위잉위잉', 'TOMBOY', 'Hooka', 'LOVE YA!'],
      '씨엔블루': ['외톨이야', '직감', 'Can’t Stop'],
      '타일라': ['Water', 'Truth or Dare', 'ART', 'Jump', 'PUSH 2 START'],
      '넬': ['기억을 걷는 시간', 'Stay', '백야'],
      '엔플라잉': ['옥탑방', 'Blue Moon'],
      '쏜애플': ['시퍼런 봄', '아지랑이', '난 자꾸 말을 더듬고'],
      '국카스텐': ['거울', '붉은 밭', '꼬리']
    };
    function songsOf(name) { return SONGS[name] || ['[대표곡 1]', '[대표곡 2]', '[대표곡 3]']; }
    var ARTIST_IMG = {
      '핑크팬서리스': 'assets/images/artists/pinkpantheress.jpg', '타일라': 'assets/images/artists/tyla.jpg', '터치드': 'assets/images/artists/touched.jpg',
      '페퍼톤스': 'assets/images/artists/peppertones.jpg', '국카스텐': 'assets/images/artists/guckkasten.jpg', '데이식스': 'assets/images/artists/day6.jpg', '넬': 'assets/images/artists/nell.jpg',
      '드래곤포니': 'assets/images/artists/dragon-pony.jpg', '잔나비': 'assets/images/artists/jannabi.jpg', '쏜애플': 'assets/images/artists/thornapple.jpg', '데이브레이크': 'assets/images/artists/daybreak.jpg',
      '루시': 'assets/images/artists/lucy.jpg', '혁오': 'assets/images/artists/hyukoh.jpg', '씨엔블루': 'assets/images/artists/cnblue.jpg', '엔플라잉': 'assets/images/artists/n-flying.jpg', '실리카겔': 'assets/images/artists/silica-gel.jpg'
    };
    var PHOTO_SRC = ['assets/images/photos/photo-1.jpg', 'assets/images/photos/photo-2.jpg', 'assets/images/photos/photo-3.jpg', 'assets/images/photos/photo-4.jpg', 'assets/images/photos/photo-5.jpg', 'assets/images/photos/photo-6.jpg', 'assets/images/photos/photo-7.jpg'];
    function face(name) {
      var img = ARTIST_IMG[name];
      return { hasImg: !!img, img: img || '', noImg: !img, initial: name.charAt(0) };
    }

    var allSets = [], byId = {};
    [1, 2].forEach(function (d) {
      ['main', 's2'].forEach(function (k) {
        LINEUP[d][k].forEach(function (r, i) {
          var x = { id: r[0], day: d, stage: k, order: i, name: r[1], start: r[2], end: r[3], a: toMin(r[2]), b: toMin(r[3]) };
          allSets.push(x); byId[x.id] = x;
        });
      });
    });
    function overlaps(x, y) { return x.day === y.day && x.a < y.b && y.a < x.b; }
    function blockerOf(x) {
      if (st.picks[x.id]) return null;
      for (var i = 0; i < allSets.length; i++) {
        var y = allSets[i];
        if (y.id !== x.id && st.picks[y.id] && overlaps(x, y)) return y;
      }
      return null;
    }
    function picksOf(day) {
      return allSets.filter(function (x) { return x.day === day && !!st.picks[x.id]; }).sort(function (x, y) { return x.a - y.a; });
    }
    var savedPicks = allSets.filter(function (x) { return !!st.picks[x.id] && !!st.savedDays[x.day]; })
      .sort(function (x, y) { return x.day - y.day || x.a - y.a; });
    var nSaved = savedPicks.length;
    var anyDaySaved = !!(st.savedDays[1] || st.savedDays[2]);
    var bothSaved = !!(st.savedDays[1] && st.savedDays[2]);

    // playlist tracks
    var tracksAll = [];
    savedPicks.forEach(function (x) {
      songsOf(x.name).forEach(function (t, k) { tracksAll.push({ key: x.id + '-' + k, set: x, title: t, k: k }); });
    });
    var included = tracksAll.filter(function (t) { return !st.plExcluded[t.key]; }).length;

    // checklist
    var CATS = [
      { label: '필수', items: [['e1', '모바일 티켓'], ['e2', '신분증'], ['e3', '보조배터리 · 충전 케이블'], ['e4', '카드 · 현금'], ['e5', '이어플러그']] },
      { label: '옷 · 신발', items: [['w1', '편한 운동화'], ['w2', '우비'], ['w3', '얇은 겉옷'], ['w4', '모자']] },
      { label: '편의용품', items: [['c1', '선크림'], ['c2', '물티슈'], ['c3', '손선풍기'], ['c4', '휴대용 방석']] }
    ];
    if (st.custom.length) CATS.push({ label: '직접 추가', items: st.custom.map(function (c) { return [c.id, c.label]; }) });
    var packed = 0, packTotal = 0, unpacked = [];
    CATS.forEach(function (c) { c.items.forEach(function (r) { packTotal++; if (st.checked[r[0]]) packed++; else unpacked.push(r[1]); }); });
    var allPacked = packTotal > 0 && packed === packTotal;
    var exported = !!st.exportedTo;
    var ticketDone = !!st.tkSaved;

    // ---------- prep status ----------
    function chipOf(state) {
      if (state === 'done') return { chip: '설정 완료', chipBg: INK, chipFg: LAV };
      if (state === 'doing') return { chip: '진행 중', chipBg: 'rgba(10,10,10,0.12)', chipFg: INK };
      return { chip: '설정 전', chipBg: 'transparent', chipFg: INK };
    }
    function dayLine(d) {
      var p = picksOf(d);
      return st.savedDays[d] && p.length ? DAYS[d].label + ' ' + p.length + '팀' : DAYS[d].label + ' 설정 전';
    }
    var PARTS = [
      { key: 'timetable', title: '타임테이블', state: anyDaySaved && nSaved ? 'done' : 'todo',
        detail: anyDaySaved ? dayLine(1) + ' · ' + dayLine(2) : '보고 싶은 공연 고르기',
        open: nav(anyDaySaved ? 'tt' : 'tte', anyDaySaved ? { ttDay: st.savedDays[1] ? 1 : 2 } : { tteDay: 1 }) },
      { key: 'playlist', title: '플레이리스트', state: exported ? 'done' : (nSaved ? 'doing' : 'todo'),
        detail: exported ? included + '곡 · ' + st.exportedTo + '로 내보냄' : (nSaved ? included + '곡 준비됨 · 내보내기 전' : '타임테이블을 먼저 설정해요'),
        open: nav('playlist') },
      { key: 'checklist', title: '체크리스트', state: allPacked ? 'done' : (packed ? 'doing' : 'todo'),
        detail: allPacked ? packTotal + '개 모두 챙김' : (packed ? packTotal + '개 중 ' + packed + '개 챙김' : '챙길 것 ' + packTotal + '개'),
        open: nav('check') },
      { key: 'ticket', title: '티켓', state: ticketDone ? 'done' : 'todo',
        detail: ticketDone ? st.tkSaved.type + ' · ' + st.tkSaved.vendor : '예매한 티켓 등록하기',
        open: nav('ticket', ticketDone ? {} : {}) }
    ];
    var DDAY = st.dday ? 'D-DAY' : 'D-4';
    var doneCount = PARTS.filter(function (p) { return p.state === 'done'; }).length;
    var prepDone = st.added && doneCount === 4;
    // all 4 prep parts just got done → D-DAY push slides down a moment later
    if (this._lastDone === undefined) this._lastDone = prepDone;
    if (prepDone && !this._lastDone && !st.dday && !st.pushShown && !this._pushTimer) {
      this._pushTimer = setTimeout(function () {
        self._pushTimer = null;
        self.setState({ push: true, pushShown: true });
        self._pushHide = setTimeout(function () { self.setState({ push: false }); }, 9000);
      }, 1700);
    }
    this._lastDone = prepDone;
    // 기록(리포트)은 체크리스트를 다 챙기지 않아도 열림: 타임테이블 · 플레이리스트 · 티켓만 필수
    var recordOpen = st.added && PARTS.filter(function (p) { return p.key !== 'checklist' && p.state === 'done'; }).length === 3;
    var remaining = PARTS.filter(function (p) { return p.state !== 'done'; }).map(function (p) { return p.title; });

    // ---------- taste ----------
    var TASTE_GENRES = ['인디', '록', '팝', 'J-POP', '재즈', '힙합', '일렉트로닉', 'R&B'];
    var TASTE_ARTISTS = ['페퍼톤스', '잔나비', '핑크팬서리스', '혁오', '실리카겔', '데이식스', '넬', '타일라', '터치드', '루시', '드래곤포니', '국카스텐'];
    var OBJ = { '인디': '를', '록': '을', '팝': '을', 'J-POP': '을', '재즈': '를', '힙합': '을', '일렉트로닉': '을', 'R&B': '를' };
    var pickedGenres = TASTE_GENRES.filter(function (g) { return !!st.tGenres[g]; });
    var pickedArtists = TASTE_ARTISTS.filter(function (a) { return !!st.tArtists[a]; });
    function tog(field, key) {
      return function () {
        var o = Object.assign({}, self.state[field]);
        if (o[key]) delete o[key]; else o[key] = true;
        var p = {}; p[field] = o; self.setState(p);
      };
    }
    var taste = {
      genres: TASTE_GENRES.map(function (g) {
        var on = !!st.tGenres[g];
        return { label: g, pressed: on ? 'true' : 'false', bg: on ? INK : 'transparent', fg: on ? LAV : INK, pick: tog('tGenres', g) };
      }),
      artists: TASTE_ARTISTS.map(function (a) {
        var on = !!st.tArtists[a];
        return Object.assign({ name: a, on: on, pressed: on ? 'true' : 'false', ring: on ? '3px solid #0A0A0A' : '1.5px solid rgba(10,10,10,0.35)', weight: on ? 700 : 500, pick: tog('tArtists', a) }, face(a));
      }),
      genreCount: pickedGenres.length, artistCount: pickedArtists.length,
      cta: pickedGenres.length ? (pickedGenres.length + pickedArtists.length) + '개 고르고 시작하기' : '장르를 1개 이상 골라주세요',
      ctaBg: pickedGenres.length ? INK : 'rgba(10,10,10,0.4)',
      start: function () {
        if (!pickedGenres.length) { toast('좋아하는 장르를 1개 이상 골라주세요', '!'); return; }
        nav('discover')();
        toast('고른 취향으로 탐색 화면을 채웠어요');
      },
      skip: function () { nav('discover')(); toast('취향은 MY에서 언제든 고를 수 있어요'); },
      nick: st.nick,
      onNick: function (e) { self.setState({ nick: e.target.value }); },
      save: function () {
        if (!pickedGenres.length) { toast('좋아하는 장르를 1개 이상 골라주세요', '!'); return; }
        if (!(self.state.nick || '').trim()) { toast('닉네임을 입력해주세요', '!'); return; }
        nav('my')();
        toast('프로필을 저장했어요');
      }
    };
    var g0 = pickedGenres[0];
    var tasteKeys = !g0 ? ['gmf', 'wonderlivet', 'nol']
      : (g0 === '인디' ? ['sejong', 'inmufe', 'gmf'] : FEST_KEYS.filter(function (k) { return pickedGenres.indexOf(FEST[k].genre) >= 0; }));
    if (!tasteKeys.length) tasteKeys = ['gmf', 'wonderlivet', 'nol'];

    // ---------- discover ----------
    var GENRES = ['전체', '인디', '록', '팝', 'J-POP', '재즈', '힙합', '일렉트로닉', 'R&B', '포크'];
    function genreChips(cur, onPick) {
      return GENRES.map(function (g) {
        var on = g === cur;
        return { label: g, pressed: on ? 'true' : 'false', bg: on ? INK : 'transparent', fg: on ? LAV : INK, pick: onPick(g) };
      });
    }
    var filteredKeys = FEST_KEYS.filter(function (k) { return FEST[k].genre === st.genre; });
    var disc = {
      genres: genreChips(st.genre, function (g) { return function () { self.setState({ genre: g }); }; }),
      filtered: st.genre !== '전체',
      all: st.genre === '전체',
      genreLabel: st.genre,
      filteredSub: filteredKeys.length ? '다가오는 ' + st.genre + ' 페스티벌 ' + filteredKeys.length + '개' : '조건에 맞는 페스티벌이 없어요',
      filteredList: filteredKeys.map(function (k) { return festCard(k, 'discover'); }),
      filteredEmpty: st.genre !== '전체' && filteredKeys.length === 0,
      week: FEST_KEYS.filter(function (k) { return FEST[k].dday <= 7; }).map(function (k) { return festCard(k, 'discover'); }),
      tasteTitle: g0 ? g0 + OBJ[g0] + ' 좋아한다면' : '처음이라면 이런 페스티벌',
      tasteSub: g0 === '인디' ? '최근 담은 페스티벌과 비슷한 인디 페스티벌' : (g0 ? '고른 취향과 비슷한 페스티벌' : '지금 많이 담는 페스티벌부터 둘러봐요'),
      taste: tasteKeys.slice(0, 3).map(function (k) { return festCard(k, 'discover'); }),
      unread: !st.noticesRead,
      byVenue: function () { self.setState({ screen: 'search', searchFrom: 'discover', query: '', kb: false, toast: '' }); },
      upcoming: FEST_KEYS.filter(function (k) { return FEST[k].dday > 7; }).map(function (k) { return festCard(k, 'discover'); }),
      artists: ['핑크팬서리스', '타일라', '혁오', '잔나비', '실리카겔', '페퍼톤스', '드래곤포니'].map(function (n) {
        var x = allSets.filter(function (y) { return y.name === n; })[0];
        return Object.assign({ name: n, count: '그랜드 민트 ' + DAYS[x.day].label, open: openSearch('discover', n) }, face(n));
      }),
      venues: [['서울 송파구', '올림픽공원', '1개', '올림픽공원'], ['경기', '고양', '3개', '고양'], ['인천', '인천', '1개', '인천'], ['세종', '세종', '1개', '세종']].map(function (v, i) {
        return { region: v[0], name: v[1], count: v[2], open: openSearch('discover', v[3]),
          br: i % 2 === 0 ? '1.5px solid #0A0A0A' : '0', bb: i < 2 ? '1.5px solid #0A0A0A' : '0' };
      }),
      ranking: FEST_KEYS.slice().sort(function (a, b) { return FEST[b].hot - FEST[a].hot; }).slice(0, 5).map(function (k, i) {
        var f = FEST[k];
        return { rank: i + 1, open: openDetail(k, 'discover'), poster: f.poster, ko: f.ko, meta: f.genre + ' · ' + f.date + ' · ' + f.hot.toLocaleString('ko-KR') + '명이 담았어요', dday: 'D-' + f.dday };
      })
    };

    // ---------- search ----------
    var q = (st.query || '').trim();
    var nq = norm(q);
    function addRecent(term) {
      return [term].concat(st.recent.filter(function (r) { return r !== term; })).slice(0, 6);
    }
    function useTerm(term) { return function () { self.setState({ query: term, recent: addRecent(term), kb: false }); }; }

    // Hangul (2-beolsik) composer for the on-screen keyboard
    var HC = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ', HV = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
    var HJ = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    var VV = { 'ㅗㅏ': 'ㅘ', 'ㅗㅐ': 'ㅙ', 'ㅗㅣ': 'ㅚ', 'ㅜㅓ': 'ㅝ', 'ㅜㅔ': 'ㅞ', 'ㅜㅣ': 'ㅟ', 'ㅡㅣ': 'ㅢ' };
    var JJ = { 'ㄱㅅ': 'ㄳ', 'ㄴㅈ': 'ㄵ', 'ㄴㅎ': 'ㄶ', 'ㄹㄱ': 'ㄺ', 'ㄹㅁ': 'ㄻ', 'ㄹㅂ': 'ㄼ', 'ㄹㅅ': 'ㄽ', 'ㄹㅌ': 'ㄾ', 'ㄹㅍ': 'ㄿ', 'ㄹㅎ': 'ㅀ', 'ㅂㅅ': 'ㅄ' };
    function split(ch) {
      var c = ch.charCodeAt(0) - 0xAC00;
      if (c < 0 || c > 11171) return null;
      return { i: Math.floor(c / 588), v: Math.floor((c % 588) / 28), j: c % 28 };
    }
    function join(i, v, j) { return String.fromCharCode(0xAC00 + i * 588 + v * 28 + j); }
    function findPair(map, val) { for (var k in map) { if (map[k] === val) return k; } return null; }
    function typeJamo(str, t) {
      var last = str.slice(-1), head = str.slice(0, -1), p = split(last || ' ');
      var isV = HV.indexOf(t) >= 0;
      if (!isV) {
        if (p && p.j === 0 && HJ.indexOf(t) > 0) return head + join(p.i, p.v, HJ.indexOf(t));
        if (p && p.j > 0 && JJ[HJ[p.j] + t]) return head + join(p.i, p.v, HJ.indexOf(JJ[HJ[p.j] + t]));
        return str + t;
      }
      if (HC.indexOf(last) >= 0 && last) return head + join(HC.indexOf(last), HV.indexOf(t), 0);
      if (p && p.j === 0 && VV[HV[p.v] + t]) return head + join(p.i, HV.indexOf(VV[HV[p.v] + t]), 0);
      if (p && p.j > 0) {
        var jj = HJ[p.j], pair = findPair(JJ, jj);
        if (pair) return head + join(p.i, p.v, HJ.indexOf(pair.charAt(0))) + join(HC.indexOf(pair.charAt(1)), HV.indexOf(t), 0);
        if (HC.indexOf(jj) >= 0) return head + join(p.i, p.v, 0) + join(HC.indexOf(jj), HV.indexOf(t), 0);
      }
      return str + t;
    }
    function backJamo(str) {
      var last = str.slice(-1), head = str.slice(0, -1), p = split(last || ' ');
      if (!p) return head;
      if (p.j > 0) { var pair = findPair(JJ, HJ[p.j]); return head + join(p.i, p.v, pair ? HJ.indexOf(pair.charAt(0)) : 0); }
      var vp = findPair(VV, HV[p.v]);
      if (vp) return head + join(p.i, HV.indexOf(vp.charAt(0)), 0);
      return head + HC.charAt(p.i);
    }
    var KO_ROWS = [['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'], ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'], ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']];
    var KO_SHIFT = { 'ㅂ': 'ㅃ', 'ㅈ': 'ㅉ', 'ㄷ': 'ㄸ', 'ㄱ': 'ㄲ', 'ㅅ': 'ㅆ', 'ㅐ': 'ㅒ', 'ㅔ': 'ㅖ' };
    var EN_ROWS = [['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['z', 'x', 'c', 'v', 'b', 'n', 'm']];
    function kbKey(label, press, o) {
      o = o || {};
      return { label: label, aria: o.aria || label, press: press, flex: o.flex || 1, size: o.size || 22, weight: o.weight || 400,
        bg: o.bg || '#FFFFFF', fg: o.fg || '#0A0A0A' };
    }
    function typeKey(ch) {
      return function () {
        var s0 = self.state, out = s0.kbEn ? (s0.query || '') + ch : typeJamo(s0.query || '', ch);
        self.setState({ query: out, kbShift: false });
      };
    }
    var FN = '#ACB1BB';
    var rowsSrc = st.kbEn ? EN_ROWS : KO_ROWS;
    var kbRows = rowsSrc.map(function (r, ri) {
      var keys = r.map(function (k) {
        var ch = st.kbEn ? (st.kbShift ? k.toUpperCase() : k) : (st.kbShift && KO_SHIFT[k] ? KO_SHIFT[k] : k);
        return kbKey(ch, typeKey(ch));
      });
      if (ri === 2) {
        keys.unshift(kbKey('⇧', function () { self.setState({ kbShift: !self.state.kbShift }); }, { aria: 'Shift', flex: 1.45, bg: st.kbShift ? '#FFFFFF' : FN, size: 20 }));
        keys.push(kbKey('⌫', function () { var q0 = self.state.query || ''; self.setState({ query: self.state.kbEn ? q0.slice(0, -1) : backJamo(q0) }); }, { aria: '지우기', flex: 1.45, bg: FN, size: 20 }));
      }
      return { keys: keys, pad: ri === 1 ? 18 : 0 };
    });
    function commit() {
      var v = (self.state.query || '').trim();
      self.setState(v ? { kb: false, recent: addRecent(v) } : { kb: false });
    }
    kbRows.push({ pad: 0, keys: [
      kbKey(st.kbEn ? '한글' : 'ABC', function () { self.setState({ kbEn: !self.state.kbEn, kbShift: false }); }, { aria: st.kbEn ? '한글 자판' : '영문 자판', flex: 2.3, bg: FN, size: 15 }),
      kbKey(st.kbEn ? 'space' : '스페이스', function () { self.setState({ query: (self.state.query || '') + ' ' }); }, { flex: 5, size: 15 }),
      kbKey('검색', commit, { flex: 2.3, bg: '#0A0A0A', fg: '#F3D9FF', size: 15, weight: 700 })
    ] });
    var gmfNames = allSets.map(function (x) { return x.name; }).join('|');
    var festHits = !nq ? [] : FEST_KEYS.filter(function (k) {
      var f = FEST[k];
      var hay = norm([f.ko, f.en, f.venue, f.city, f.genre, f.genre + '페스티벌', f.date, k === 'gmf' ? gmfNames : ''].join('|'));
      return hay.indexOf(nq) !== -1;
    });
    var artistHits = !nq ? [] : allSets.filter(function (x) { return norm(x.name).indexOf(nq) !== -1; });
    var srch = {
      back: nav(st.searchFrom || 'discover'),
      query: st.query,
      onQuery: function (e) { self.setState({ query: e.target.value }); },
      onKey: function (e) {
        if (e.key === 'Enter') {
          var v = (e.target.value || '').trim();
          self.setState(v ? { recent: addRecent(v), kb: false } : { kb: false });
          try { e.target.blur(); } catch (er) {}
        }
      },
      hasQuery: !!q,
      idle: !q,
      clear: function () { self.setState({ query: '', kb: true }); focusSearchSoon(); },
      kbOpen: !!st.kb,
      kbRows: kbRows,
      openKb: function () { if (!self.state.kb) self.setState({ kb: true }); },
      places: ['올림픽공원', '고양', '인천', '수원', '세종'].map(function (p) { return { label: p, use: useTerm(p) }; }),
      hasRecent: st.recent.length > 0,
      clearRecent: function () { self.setState({ recent: [] }); },
      recent: st.recent.map(function (r) {
        return { label: r, use: useTerm(r), remove: function () { self.setState({ recent: self.state.recent.filter(function (x) { return x !== r; }) }); } };
      }),
      genres: genreChips('', function (g) { return g === '전체' ? function () { self.setState({ screen: 'discover', genre: '전체' }); } : useTerm(g); }),
      popular: ['그랜드 민트 페스티벌', '핑크팬서리스', '혁오', '올림픽공원', '잔나비', '록 페스티벌', '타일라', '실리카겔'].map(function (t, i) { return { rank: i + 1, label: t, use: useTerm(t) }; }),
      hasFests: festHits.length > 0,
      festCount: festHits.length,
      fests: festHits.map(function (k) {
        var c = festCard(k, 'search');
        c.meta = FEST[k].date + ' · ' + FEST[k].venue + ' · ' + FEST[k].genre;
        return c;
      }),
      hasArtists: artistHits.length > 0,
      artistCount: artistHits.length,
      artists: artistHits.map(function (x) {
        return Object.assign({ name: x.name, meta: '그랜드 민트 페스티벌 · ' + DAYS[x.day].label + ' ' + kTime(x.start),
          open: nav('artist', { artistId: x.id, artistFrom: 'search' }) }, face(x.name));
      }),
      noResult: !!q && festHits.length === 0 && artistHits.length === 0
    };

    // ---------- detail ----------
    var DF = FEST[st.detailFest] || FEST.gmf;
    var isGmf = st.detailFest === 'gmf';
    var lineupDays = isGmf ? [1, 2].map(function (d) {
      var sets = allSets.filter(function (x) { return x.day === d; }).sort(function (x, y) { return x.a - y.a; });
      return { label: DAYS[d].label + ' · ' + DAYS[d].date, artists: sets.map(function (x) {
        return Object.assign({ name: x.name, time: x.start, open: nav('artist', { artistId: x.id, artistFrom: 'detail' }) }, face(x.name));
      }) };
    }) : [];
    var notified = !!st.notify[st.detailFest];
    var det = {
      poster: DF.poster, ko: DF.ko, name: DF.en,
      back: nav({ search: 'search', prep: 'prep', notices: 'notices' }[st.detailFrom] || 'discover'),
      backLabel: { search: '검색', prep: '준비', notices: '알림' }[st.detailFrom] || '탐색',
      isGmf: isGmf, notGmf: !isGmf,
      inPrep: st.extra.indexOf(st.detailFest) >= 0,
      notifyLabel: notified ? '알림 신청됨' : '오픈 알림 받기',
      notifyIconFill: notified ? 'currentColor' : 'none',
      addLabel: st.extra.indexOf(st.detailFest) >= 0 ? '준비 탭에 있어요' : '준비 탭에 담기',
      add: function () {
        var k = self.state.detailFest;
        if (self.state.extra.indexOf(k) >= 0) { nav('prep')(); return; }
        nav('prep', { extra: self.state.extra.concat([k]) })();
        toast('준비 탭에 담았어요 · 라인업이 공개되면 타임테이블부터 시작해요');
      },
      dday: 'D-' + DF.dday,
      tags: DF.genre + ' · ' + DF.city + (isGmf ? ' · 2일 · 16팀' : ''),
      dateShort: DF.dateLong, venue: DF.venue,
      lineupCount: isGmf ? '16팀' : '',
      hasLineup: isGmf, noLineup: !isGmf,
      days: lineupDays,
      info: [
        { ic: { calendar: true }, label: '일정', value: DF.dateLong, sub: isGmf ? '이틀 동안 진행해요' : '' },
        { ic: { pin: true }, label: '장소', value: DF.venue, sub: isGmf ? '88잔디마당 · 올림픽홀 일대' : '세부 장소는 추후 공개' },
        { ic: { clock: true }, label: '공연 시간', value: isGmf ? '오후 4:00 – 10:00' : '추후 공개', sub: isGmf ? '입장은 오후 2시부터' : '' },
        { ic: { ticket: true }, label: '티켓', value: isGmf ? '1일권 · 2일권' : '추후 공개', sub: isGmf ? '인터파크 티켓, YES24 티켓에서 예매' : '' }
      ],
      cta: isGmf ? (st.added ? '준비하기로 이동' : '준비 시작하기') : (notified ? '오픈 알림 신청 완료' : '라인업 오픈 알림 받기'),
      start: isGmf ? function () {
        var was = self.state.added;
        nav('dash', { added: true, dashFrom: 'prep' })();
        if (!was) toast('준비 탭에 담았어요 · 하나씩 준비해봐요');
      } : function () {
        var n = Object.assign({}, self.state.notify);
        n[self.state.detailFest] = !n[self.state.detailFest];
        toast(n[self.state.detailFest] ? '라인업이 공개되면 알려드릴게요' : '알림을 해제했어요', '✓', { notify: n });
      }
    };

    // ---------- artist (in this festival) ----------
    var AX = byId[st.artistId] || byId.d1m4;
    var stageSets = allSets.filter(function (x) { return x.day === AX.day && x.stage === AX.stage; }).sort(function (x, y) { return x.a - y.a; });
    var idx = stageSets.indexOf(AX);
    var prev = stageSets[idx - 1], next = stageSets[idx + 1];
    var clashes = allSets.filter(function (y) { return y.id !== AX.id && overlaps(AX, y); });
    var axPicked = !!st.picks[AX.id];
    var axBlocker = blockerOf(AX);
    var art = Object.assign({}, face(AX.name), {
      back: { search: nav('search'), my: nav('myLikes'), notices: nav('notices'), today: nav('today') }[st.artistFrom] || nav('detail', { detailFest: 'gmf' }),
      backLabel: { my: '찜한 아티스트', notices: '알림', today: '오늘' }[st.artistFrom] || '그랜드 민트 페스티벌',
      liked: !!st.liked[AX.name],
      heartFill: st.liked[AX.name] ? 'currentColor' : 'none',
      likeText: st.liked[AX.name] ? '찜했어요' : '찜하기',
      likeBg: st.liked[AX.name] ? '#0A0A0A' : '#F3D9FF',
      likeFg: st.liked[AX.name] ? '#F3D9FF' : '#0A0A0A',
      likeRing: st.liked[AX.name] ? '#F3D9FF' : '#0A0A0A',
      likeLabel: st.liked[AX.name] ? AX.name + ' 찜 해제' : AX.name + ' 찜하기',
      like: function () {
        var o = Object.assign({}, self.state.liked);
        if (o[AX.name]) { delete o[AX.name]; toast(AX.name + ' 찜을 해제했어요', '✓', { liked: o }); }
        else { o[AX.name] = true; var c = AX.name.charCodeAt(AX.name.length - 1); var j = (c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28) ? '을' : '를'; toast(AX.name + j + ' 찜했어요 · MY에서 모아볼 수 있어요', '✓', { liked: o }); }
      },
      dayChip: DAYS[AX.day].label + ' · ' + DAYS[AX.day].date,
      name: AX.name,
      rows: [
        { label: '시간', value: kRange(AX.start, AX.end), sub: dur(AX.b - AX.a) + ' 공연' },
        { label: '무대', value: STAGE[AX.stage], sub: STAGE_ROLE[AX.stage] },
        { label: '순서', value: STAGE_ROLE[AX.stage] + ' ' + (idx + 1) + '번째' + (next ? '' : ' · 마지막 무대'),
          sub: (prev ? '앞 무대 ' + prev.name + ' ' + kTime(prev.start) : '첫 무대예요') + (next ? ' · 다음 무대 ' + next.name + ' ' + kTime(next.start) : '') }
      ].map(function (r, i) { r.bt = i === 0 ? '0' : '1px solid rgba(10,10,10,0.2)'; return r; }),
      hasClash: clashes.length > 0,
      noClash: clashes.length === 0,
      clashes: clashes.map(function (y) {
        return { name: y.name, meta: STAGE[y.stage] + ' · ' + kRange(y.start, y.end), state: st.picks[y.id] ? '내 타임테이블' : '시간 겹침' };
      }),
      songs: songsOf(AX.name).map(function (t, k) { return { no: k < 9 ? '0' + (k + 1) : String(k + 1), title: t }; }),
      cta: !st.added ? '준비를 시작하면 타임테이블에 담을 수 있어요' : (axPicked ? '내 타임테이블에서 빼기' : (axBlocker ? '‘' + axBlocker.name + '’ 공연과 시간이 겹쳐요' : DAYS[AX.day].label + ' 타임테이블에 담기')),
      ctaBg: !st.added ? 'rgba(10,10,10,0.1)' : (axPicked ? 'rgba(10,10,10,0.12)' : (axBlocker ? 'rgba(10,10,10,0.35)' : INK)),
      ctaOff: !st.added ? 'true' : 'false',
      ctaCursor: !st.added ? 'not-allowed' : 'pointer',
      ctaSize: !st.added ? '15px' : '17px',
      ctaFg: !st.added ? 'rgba(10,10,10,0.55)' : (axPicked ? INK : LAV),
      toggle: function () {
        var s = self.state;
        if (!s.added) { toast('페스티벌 상세에서 준비를 먼저 시작해 주세요', '!'); return; }
        if (s.picks[AX.id]) {
          var n = Object.assign({}, s.picks); delete n[AX.id];
          toast(AX.name + ' 공연을 타임테이블에서 뺐어요', '✓', { picks: n });
          return;
        }
        var b = blockerOf(AX);
        if (b) { toast('‘' + b.name + '’ 공연과 시간이 겹쳐 담을 수 없어요', '!'); return; }
        var n2 = Object.assign({}, s.picks); n2[AX.id] = true;
        var sd = Object.assign({}, s.savedDays); sd[AX.day] = true;
        toast(DAYS[AX.day].label + ' 타임테이블에 담았어요', '✓', { picks: n2, savedDays: sd, added: true });
      }
    });

    // ---------- prep home ----------
    function askRemove(k) { return function () { self.setState({ removeKey: k }); }; }
    var prepCards = [];
    if (st.added) prepCards.push({ key: 'gmf', poster: FEST.gmf.poster, name: '그랜드 민트 페스티벌 2026', meta: '10월 17–18일 · 올림픽공원',
      dday: DDAY, chip: '준비 ' + doneCount + '/4', open: st.dday ? nav('today', { dashFrom: 'prep' }) : nav('dash', { dashFrom: 'prep' }), remove: askRemove('gmf') });
    st.extra.forEach(function (k) {
      var f = FEST[k];
      prepCards.push({ key: k, poster: f.poster, name: f.ko, meta: f.date + ' · ' + f.city, dday: 'D-' + f.dday, chip: '라인업 공개 전',
        open: openDetail(k, 'prep'), remove: askRemove(k) });
    });
    prepCards.forEach(function (c) { c.normal = !st.prepEdit; c.editing = !!st.prepEdit; c.removeLabel = c.name + ' 준비 그만두기'; });
    var rk = st.removeKey, rf = rk === 'gmf' ? null : FEST[rk];
    var prepCount = prepCards.length;
    var prep = {
      added: prepCount > 0,
      empty: prepCount === 0,
      cards: prepCards,
      editLabel: st.prepEdit ? '완료' : '편집',
      toggleEdit: function () { self.setState({ prepEdit: !self.state.prepEdit }); },
      confirmOpen: !!rk,
      confirmTitle: rk ? (rk === 'gmf' ? '그랜드 민트 페스티벌 2026' : (rf ? rf.ko : '')) + ' 준비를 그만둘까요?' : '',
      confirmBody: rk === 'gmf' ? (nSaved ? '담아둔 타임테이블 ' + nSaved + '팀, 체크리스트, 티켓 정보가 함께 지워져요' : '체크리스트와 티켓 정보가 함께 지워져요') : '라인업 오픈 알림도 함께 꺼져요',
      cancelRemove: function () { self.setState({ removeKey: '' }); },
      confirmRemove: function () {
        var k = self.state.removeKey;
        if (k === 'gmf') {
          toast('그랜드 민트 페스티벌 준비를 그만뒀어요', '✓', { removeKey: '', added: false, picks: {}, savedDays: {}, checked: {}, custom: [], plExcluded: {}, exportedTo: '', tkType: '', tkVendor: '', tkNumber: '', tkSaved: null, tkQr: false, dday: false, prepEdit: self.state.extra.length > 0 });
        } else {
          var n = Object.assign({}, self.state.notify); delete n[k];
          var ex = self.state.extra.filter(function (x) { return x !== k; });
          toast((FEST[k] ? FEST[k].short : '') + ' 준비를 그만뒀어요', '✓', { removeKey: '', extra: ex, notify: n, prepEdit: (ex.length + (self.state.added ? 1 : 0)) > 0 && self.state.prepEdit });
        }
      },
      headline: prepCount === 0 ? '아직 준비 중인 페스티벌이 없어요' : (prepCount > 1 ? '다가오는 페스티벌이 ' + prepCount + '개 있어요' : (prepDone ? '준비를 모두 마쳤어요!' : '다가오는 페스티벌이 1개 있어요')),
      sub: prepCount === 0 ? '가고 싶은 페스티벌을 먼저 담아볼까요?' : (!st.added ? '라인업이 공개되면 타임테이블부터 시작해요' : (prepDone ? '공연이 끝나면 기록 탭에서 리포트를 만들어요' : '남은 준비 · ' + remaining.join(', '))),
      poster: FEST.gmf.poster,
      dday: DDAY,
      progress: doneCount + '/4',
      addFestival: openSearch('prep')
    };

    // ---------- dashboard ----------
    var dash = {
      back: nav(st.dashFrom === 'my' ? 'my' : 'prep'),
      backLabel: st.dashFrom === 'my' ? 'MY' : '준비',
      isToday: !!st.dday,
      dday: DDAY,
      headline: prepDone ? '준비를 모두 마쳤어요' : '남은 준비 ' + (4 - doneCount) + '개',
      done: doneCount,
      pct: doneCount * 25,
      tiles: PARTS.map(function (p, i) {
        var o = Object.assign({ title: p.title, detail: p.detail, open: p.open, ic: {} }, chipOf(p.state));
        o.ic[p.key] = true;
        o.br = i % 2 === 0 ? '1.5px solid #0A0A0A' : '0';
        o.bb = i < 2 ? '1.5px solid #0A0A0A' : '0';
        return o;
      })
    };

    // ---------- timetable edit ----------
    var D = st.tteDay;
    var dayAll = allSets.filter(function (x) { return x.day === D; });
    var dayPicked = picksOf(D);
    function cell(x) {
      var p = !!st.picks[x.id];
      var blk = blockerOf(x);
      return {
        name: x.name, time: x.start + '–' + x.end,
        aria: x.name + ' ' + kRange(x.start, x.end) + (blk ? ', ' + blk.name + ' 공연과 시간이 겹침' : ''),
        top: x.a - 16 * 60 + 9, h: x.b - x.a - 2,
        bg: p ? INK : (blk ? 'transparent' : '#FBF3FF'),
        fg: p ? LAV : (blk ? 'rgba(10,10,10,0.45)' : INK),
        sub: p ? 'rgba(243,217,255,0.8)' : (blk ? 'rgba(10,10,10,0.45)' : 'rgba(10,10,10,0.68)'),
        border: p ? '1.5px solid #0A0A0A' : (blk ? '1.5px dashed rgba(10,10,10,0.4)' : '1.5px solid #0A0A0A'),
        picked: p, open: !p && !blk, blocked: !!blk,
        pressed: p ? 'true' : 'false',
        toggle: function () {
          var s = self.state;
          if (s.picks[x.id]) {
            var n = Object.assign({}, s.picks); delete n[x.id];
            self.setState({ picks: n });
            return;
          }
          var b = blockerOf(x);
          if (b) { toast('‘' + b.name + '’ 공연과 시간이 겹쳐 담을 수 없어요', '!'); return; }
          var n2 = Object.assign({}, s.picks); n2[x.id] = true;
          self.setState({ picks: n2, toast: '' });
        }
      };
    }
    var hours = [];
    for (var h = 16; h <= 22; h++) hours.push({ top: 8 + (h - 16) * 60, label: h + ':00' });
    function namesOf(day) { return picksOf(day).map(function (x) { return x.name; }).join(' · '); }
    var tte = {
      back: nav('dash'),
      days: [1, 2].map(function (d) {
        var on = d === D;
        var locked = d === 2 && !st.savedDays[1];
        return {
          label: DAYS[d].label + ' · ' + DAYS[d].date.replace(/\(.\)/, ''),
          sub: st.savedDays[d] ? '담기 완료' : (on ? '고르는 중' : (locked ? '1일차 다음에 설정' : '설정 전')),
          selected: on ? 'true' : 'false',
          bg: on ? INK : 'transparent',
          fg: on ? LAV : (locked ? 'rgba(10,10,10,0.5)' : INK),
          br: d === 1 ? '1.5px solid #0A0A0A' : '0',
          pick: function () {
            if (locked) { toast('1일차를 먼저 타임테이블에 담아주세요', '!'); return; }
            self.setState({ tteDay: d, toast: '' });
          }
        };
      }),
      hours: hours,
      main: dayAll.filter(function (x) { return x.stage === 'main'; }).map(cell),
      sub: dayAll.filter(function (x) { return x.stage === 's2'; }).map(cell),
      count: dayPicked.length,
      dayLabel: DAYS[D].label,
      summary: dayPicked.length ? dayPicked.map(function (x) { return x.name; }).join(' → ') : '아직 고른 공연이 없어요',
      cta: DAYS[D].label + ' 타임테이블에 담기' + (dayPicked.length ? ' (' + dayPicked.length + ')' : ''),
      ctaBg: dayPicked.length ? INK : 'rgba(10,10,10,0.4)',
      save: function () {
        var s = self.state, d = s.tteDay;
        if (!picksOf(d).length) { toast('보고 싶은 공연을 1개 이상 골라주세요', '!'); return; }
        var sd = Object.assign({}, s.savedDays); sd[d] = true;
        self.setState({ savedDays: sd, sheet: d === 1 && !sd[2] ? 'day1' : 'all', toast: '', added: true });
      },
      sheetDay1: st.sheet === 'day1',
      sheetAll: st.sheet === 'all',
      day1Names: namesOf(1) + ' · ' + picksOf(1).length + '팀',
      allNames: '1일차 ' + namesOf(1) + '\n2일차 ' + namesOf(2),
      goDay2: function () { self.setState({ sheet: '', tteDay: 2 }); },
      onlyDay1: function () {
        nav('prep')();
        toast('1일차만 설정했어요 · 2일차는 준비하기에서 언제든 추가할 수 있어요');
      },
      closeSheet: function () { self.setState({ sheet: '' }); },
      viewMine: nav('tt', { ttDay: 1 }),
      toDash: nav('dash')
    };

    // ---------- my timetable ----------
    var TD = st.ttDay;
    var ttPicks = st.savedDays[TD] ? picksOf(TD) : [];
    var ttRows = [];
    ttPicks.forEach(function (s, i) {
      ttRows.push({ isSet: true, isGap: false, name: s.name, stage: STAGE[s.stage], start: s.start, end: s.end, text: '' });
      var nx = ttPicks[i + 1];
      if (nx) {
        var free = nx.a - s.b;
        var move = nx.stage === s.stage ? '같은 무대' : STAGE[nx.stage] + '로 이동';
        ttRows.push({ isSet: false, isGap: true, text: (free > 0 ? dur(free) + ' 여유' : '바로 이어서') + ' · ' + move });
      }
    });
    var tt = {
      edit: nav('tte', { tteDay: TD === 2 && !st.savedDays[1] ? 1 : TD }),
      days: [1, 2].map(function (d) {
        var on = d === TD;
        return { label: DAYS[d].label + ' · ' + DAYS[d].date, selected: on ? 'true' : 'false', bg: on ? INK : 'transparent', fg: on ? LAV : INK,
          br: d === 1 ? '1.5px solid #0A0A0A' : '0', pick: function () { self.setState({ ttDay: d }); } };
      }),
      has: ttPicks.length > 0,
      empty: ttPicks.length === 0,
      span: ttPicks.length ? ttPicks[0].start + ' – ' + ttPicks[ttPicks.length - 1].end : '',
      count: ttPicks.length,
      rows: ttRows,
      dayLabel: DAYS[TD].label
    };

    // ---------- checklist ----------
    function addItem() {
      var v = (self.state.draft || '').trim();
      if (!v) return;
      self.setState(function (s) { return { custom: s.custom.concat([{ id: 'u' + (s.custom.length + 1), label: v }]), draft: '' }; });
    }
    var left = packTotal - packed;
    var chk = {
      headline: left === 0 ? '다 챙겼어요! 이제 즐기기만 하면 돼요' : (packed === 0 ? '챙길 것 ' + packTotal + '개, 하나씩 체크해봐요' : packed + '개 챙겼어요 · ' + left + '개 남았어요'),
      pct: packTotal ? Math.round(packed / packTotal * 100) : 0,
      done: packed, total: packTotal,
      cats: CATS.map(function (c) {
        var cd = 0;
        var items = c.items.map(function (r) {
          var on = !!st.checked[r[0]];
          if (on) cd++;
          return {
            label: r[1], checkedAttr: on ? 'true' : 'false',
            box: on ? INK : 'transparent',
            color: on ? 'rgba(10,10,10,0.5)' : INK,
            deco: on ? 'line-through' : 'none',
            toggle: function () {
              var n = Object.assign({}, self.state.checked); n[r[0]] = !n[r[0]];
              var willAll = true;
              CATS.forEach(function (cc) { cc.items.forEach(function (rr) { if (!n[rr[0]]) willAll = false; }); });
              if (willAll) toast('짐을 모두 챙겼어요', '✓', { checked: n });
              else self.setState({ checked: n });
            }
          };
        });
        return { label: c.label, done: cd, total: items.length, items: items };
      }),
      draft: st.draft,
      onDraft: function (e) { self.setState({ draft: e.target.value }); },
      onKey: function (e) { if (e.key === 'Enter') addItem(); },
      add: addItem
    };

    // ---------- playlist ----------
    var multiDay = bothSaved && picksOf(1).length && picksOf(2).length;
    var pl = {
      has: nSaved > 0,
      empty: nSaved === 0,
      status: exported ? st.exportedTo + '로 내보냈어요' : nSaved + '팀 셋리스트',
      included: included,
      groups: savedPicks.map(function (x) {
        return {
          artist: x.name,
          when: (multiDay ? DAYS[x.day].label + ' · ' : '') + kTime(x.start) + ' · ' + STAGE[x.stage],
          tracks: songsOf(x.name).map(function (t, k) {
            var key = x.id + '-' + k;
            var on = !st.plExcluded[key];
            return {
              no: k < 9 ? '0' + (k + 1) : String(k + 1), title: t,
              on: on ? 'true' : 'false', box: on ? INK : 'transparent',
              color: on ? INK : 'rgba(10,10,10,0.45)', deco: on ? 'none' : 'line-through',
              toggle: function () {
                var e = Object.assign({}, self.state.plExcluded); e[key] = !e[key];
                self.setState({ plExcluded: e });
              }
            };
          })
        };
      }),
      cta: exported ? '다른 앱으로도 내보내기' : included + '곡 음악 앱으로 내보내기',
      openSheet: function () {
        if (!included) { toast('내보낼 곡을 1곡 이상 선택해주세요', '!'); return; }
        self.setState({ plSheet: true });
      },
      sheetOpen: !!st.plSheet,
      closeSheet: function () { self.setState({ plSheet: false }); },
      targets: [['Spotify', 'Spotify 계정에 새 플레이리스트로 저장'], ['Apple Music', 'Apple Music 보관함에 추가'], ['YouTube Music', 'YouTube Music 재생목록으로 저장'], ['멜론', '멜론 내 플레이리스트로 저장']].map(function (t) {
        return { label: t[0], desc: (self.state.connected[t[0]] ? '연결됨 · ' : '') + t[1], pick: function () {
          if (!self.state.connected[t[0]]) { self.setState({ plSheet: false, connectApp: t[0] }); return; }
          toast(t[0] + '에 플레이리스트를 저장했어요', '✓', { plSheet: false, exportedTo: t[0] });
        } };
      })
    };
    var WA = { 'Spotify': '와', 'Apple Music': '과', 'YouTube Music': '과', '멜론': '과' };
    var conn = {
      open: !!st.connectApp,
      app: st.connectApp,
      title: st.connectApp ? st.connectApp + WA[st.connectApp] + ' 연결할까요?' : '',
      cta: st.connectApp + ' 연결하고 내보내기',
      confirm: function () {
        var a = self.state.connectApp; var c = Object.assign({}, self.state.connected); c[a] = true;
        toast(a + '에 연결하고 ' + included + '곡을 저장했어요', '✓', { connectApp: '', connected: c, exportedTo: a });
      },
      cancel: function () { self.setState({ connectApp: '' }); }
    };

    // ---------- ticket ----------
    var TK_TYPES = [['1일권 · 10월 17일', '토요일'], ['1일권 · 10월 18일', '일요일'], ['2일권', '10월 17–18일']];
    var TK_VENDORS = ['인터파크 티켓', 'YES24 티켓', '멜론티켓', '기타'];
    var tkReady = !!(st.tkType && st.tkVendor);
    var tk = {
      saved: ticketDone,
      vendorLabel: ticketDone ? st.tkSaved.vendor : '',
      typeLabel: ticketDone ? st.tkSaved.type : '',
      numberLabel: ticketDone ? (st.tkSaved.number || '미입력') : '',
      types: TK_TYPES.map(function (t) {
        var on = st.tkType === t[0];
        return { label: t[0], sub: t[1], pressed: on ? 'true' : 'false', bg: on ? INK : 'transparent', fg: on ? LAV : INK,
          pick: function () { self.setState({ tkType: t[0] }); } };
      }),
      vendors: TK_VENDORS.map(function (v) {
        var on = st.tkVendor === v;
        return { label: v, pressed: on ? 'true' : 'false', bg: on ? INK : 'transparent', fg: on ? LAV : INK,
          pick: function () { self.setState({ tkVendor: v }); } };
      }),
      number: st.tkNumber,
      onNumber: function (e) { self.setState({ tkNumber: e.target.value }); },
      cta: ticketDone ? '티켓 정보 수정하기' : '티켓 등록하기',
      ctaBg: tkReady ? INK : 'rgba(10,10,10,0.4)',
      save: function () {
        var s = self.state;
        if (!s.tkType) { toast('권종을 골라주세요', '!'); return; }
        if (!s.tkVendor) { toast('예매처를 골라주세요', '!'); return; }
        nav('dash')();
        toast(s.tkQr ? '티켓과 입장 QR을 저장했어요' : '티켓을 등록했어요', '✓', { tkSaved: { type: s.tkType, vendor: s.tkVendor, number: (s.tkNumber || '').trim(), qr: !!s.tkQr } });
      },
      qrDraft: !!st.tkQr, noQrDraft: !st.tkQr,
      loadQr: function () { toast('입장 QR을 불러왔어요', '✓', { tkQr: true, tkNumber: self.state.tkNumber || 'T2610170418' }); },
      removeQr: function () { self.setState({ tkQr: false }); },
      savedQr: ticketDone && !!st.tkSaved.qr,
      savedNoQr: ticketDone && !st.tkSaved.qr,
      openPass: nav('pass', { passFrom: 'ticket' })
    };

    // ---------- ticket pass (full-screen QR) ----------
    var hasPass = ticketDone && !!st.tkSaved.qr;
    var pass = {
      has: hasPass, none: !hasPass,
      type: ticketDone ? st.tkSaved.type : '',
      when: ticketDone ? (st.tkSaved.type === '2일권' ? '10월 17일(토) – 18일(일)' : st.tkSaved.type.replace('1일권 · ', '') + ' 하루') : '',
      vendor: ticketDone ? st.tkSaved.vendor : '',
      number: ticketDone ? (st.tkSaved.number || '미입력') : '',
      close: nav(st.passFrom || 'ticket'),
      closeLabel: st.passFrom === 'today' ? '오늘' : '티켓',
      toTicket: nav('ticket')
    };

    // ---------- today (D-DAY mode) ----------
    var NOW = 17 * 60 + 40;
    var todayPicks = st.savedDays[1] ? picksOf(1) : [];
    var liveSet = todayPicks.filter(function (x) { return x.a <= NOW && NOW < x.b; })[0];
    var nextSet = todayPicks.filter(function (x) { return x.a > NOW; })[0];
    var today = {
      hasLive: !!liveSet, noLive: !liveSet,
      liveName: liveSet ? liveSet.name : '', liveStage: liveSet ? STAGE[liveSet.stage] : '',
      liveTime: liveSet ? kRange(liveSet.start, liveSet.end) : '',
      livePct: liveSet ? Math.round((NOW - liveSet.a) / (liveSet.b - liveSet.a) * 100) : 0,
      liveLeft: liveSet ? (liveSet.b - NOW) + '분 남았어요' : '',
      hasNext: !!nextSet,
      nextName: nextSet ? nextSet.name : '', nextMeta: nextSet ? kTime(nextSet.start) + ' · ' + STAGE[nextSet.stage] : '',
      nextIn: nextSet ? dur(nextSet.a - NOW) + ' 후' : '',
      rows: todayPicks.map(function (x) {
        var past = x.b <= NOW, live = x.a <= NOW && NOW < x.b;
        return { name: x.name, time: kTime(x.start), stage: STAGE[x.stage], state: past ? '끝남' : (live ? '지금' : dur(x.a - NOW) + ' 후'),
          color: past ? 'rgba(243,217,255,0.45)' : LAV, weight: live ? 700 : 500, live: live, notLive: !live,
          deco: past ? 'line-through' : 'none', open: nav('artist', { artistId: x.id, artistFrom: 'today' }) };
      }),
      pack: unpacked.length ? '남은 짐 ' + unpacked.length + '개 · ' + unpacked.slice(0, 2).join(', ') + (unpacked.length > 2 ? ' 외' : '') : '짐을 모두 챙겼어요',
      hasPass: hasPass,
      ticketLine: ticketDone ? st.tkSaved.type + ' · ' + (st.tkSaved.qr ? '입장 QR 저장됨' : 'QR 미등록') : '티켓을 아직 등록하지 않았어요',
      openPass: nav(hasPass ? 'pass' : 'ticket', { passFrom: 'today' }),
      toDash: nav('dash'), toCheck: nav('check'), toTt: nav('tt', { ttDay: 1 })
    };

    // ---------- summary (infographic) ----------
    var R = 2 * Math.PI * 30;
    function partChip(i) { return chipOf(PARTS[i].state); }
    var segShades = [INK, 'rgba(10,10,10,0.45)'];
    var sum = {
      dday: DDAY,
      headline: prepDone ? '준비를 모두 마쳤어요' : '남은 준비 · ' + remaining.join(', '),
      done: doneCount,
      ring: (R * doneCount / 4).toFixed(1) + ' ' + R.toFixed(1),
      tt: Object.assign({ open: PARTS[0].open, days: [1, 2].map(function (d) {
        var p = st.savedDays[d] ? picksOf(d) : [];
        var span = p.length ? p[0].start + '–' + p[p.length - 1].end : '';
        return {
          label: DAYS[d].label + ' · ' + DAYS[d].date,
          meta: p.length ? p.length + '팀 · ' + span : '',
          has: p.length > 0, empty: p.length === 0,
          blocks: p.map(function (x, i) { return { no: i + 1, left: ((x.a - 960) / 360 * 100).toFixed(2), width: ((x.b - x.a) / 360 * 100).toFixed(2) }; }),
          legend: p.map(function (x, i) { return (i + 1) + ' ' + x.name; }).join('   ')
        };
      }) }, partChip(0)),
      pl: Object.assign({ open: PARTS[1].open,
        count: nSaved ? included : 0,
        segs: savedPicks.map(function (x, i) {
          var n = songsOf(x.name).filter(function (t, k) { return !st.plExcluded[x.id + '-' + k]; }).length;
          return { flex: n, bg: segShades[i % 2] };
        }).filter(function (g) { return g.flex > 0; }),
        sub: !nSaved ? '타임테이블을 설정하면 만들어져요' : (nSaved + '팀 셋리스트' + (tracksAll.length - included ? ' · ' + (tracksAll.length - included) + '곡 뺌' : '') + (exported ? ' · ' + st.exportedTo : ' · 내보내기 전'))
      }, partChip(1)),
      chk: Object.assign({ open: PARTS[2].open, done: packed, total: packTotal,
        cats: CATS.map(function (c) {
          var d = c.items.filter(function (r) { return !!st.checked[r[0]]; }).length;
          return { label: c.label, done: d, total: c.items.length, pct: c.items.length ? Math.round(d / c.items.length * 100) : 0 };
        })
      }, partChip(2)),
      tk: Object.assign({ open: PARTS[3].open,
        type: ticketDone ? st.tkSaved.type : '아직 등록하지 않았어요',
        sub: ticketDone ? st.tkSaved.vendor + ' · 예매번호 ' + (st.tkSaved.number || '미입력') + (st.tkSaved.qr ? ' · 입장 QR 저장됨' : '') : '예매한 티켓을 등록해 두면 당일 바로 꺼내볼 수 있어요',
        action: ticketDone ? '수정' : '등록',
        actionLabel: ticketDone ? '티켓 정보 수정하기' : '티켓 등록하기'
      }, partChip(3))
    };

    // ---------- record ----------
    var seenCount = savedPicks.filter(function (x) { return !!st.seen[x.id]; }).length;
    var PAST = [
      { year: '2026', name: '인천 펜타포트 락 페스티벌 2026', meta: '8월 7–9일 · 인천 송도', rating: 4, cover: PHOTO_SRC[2] },
      { year: '2026', name: '서울재즈페스티벌 2026', meta: '5월 23–24일 · 올림픽공원', rating: 5, cover: PHOTO_SRC[4] },
      { year: '2025', name: '그랜드 민트 페스티벌 2025', meta: '10월 18–19일 · 올림픽공원', rating: 4, cover: PHOTO_SRC[5] }
    ];
    var hist = !!st.history;
    function pastOpen() { toast('프로토타입에서는 그랜드 민트 페스티벌 2026 리포트만 열어볼 수 있어요', '!'); }
    var recRows = (st.reportSaved || recordOpen) ? [{
      year: '2026', name: '그랜드 민트 페스티벌 2026', meta: '10월 17–18일 · 올림픽공원',
      poster: hist && st.reportSaved ? rep0cover() : FEST.gmf.poster,
      state: st.reportSaved ? '리포트 완성 · 별점 ' + st.rating + '점' : '리포트 작성 전',
      open: nav(st.reportSaved ? 'report' : 'reportEdit')
    }] : [];
    function rep0cover() { var k = st.photos.indexOf(true); return PHOTO_SRC[k < 0 ? 0 : k]; }
    if (hist) PAST.forEach(function (p) { recRows.push({ year: p.year, name: p.name, meta: p.meta, poster: p.cover, state: '리포트 완성 · 별점 ' + p.rating + '점', open: pastOpen }); });
    var shownRows = recRows.filter(function (r) { return st.recYear === '전체' || r.year === st.recYear; });
    var rec = {
      history: hist,
      years: ['전체', '2026', '2025'].map(function (y) {
        var on = st.recYear === y;
        return { label: y, pressed: on ? 'true' : 'false', bg: on ? INK : 'transparent', fg: on ? '#FFFACD' : INK, pick: function () { self.setState({ recYear: y }); } };
      }),
      yearBars: [['2025', 1], ['2026', 3]].map(function (y) { return { year: y[0], count: y[1] + '개', width: Math.round(y[1] / 3 * 100) }; }),
      stats: [
        { label: '다녀온 페스티벌', value: hist ? '4' : (st.reportSaved ? '1' : '0'), size: 30 },
        { label: '본 아티스트', value: hist ? String(seenCount + 19) : (st.reportSaved ? String(seenCount) : '0'), size: 30 },
        { label: '많이 간 장르', value: st.reportSaved ? '인디' : '—', size: 22 },
        { label: '다녀온 도시', value: hist ? '서울 · 인천' : (st.reportSaved ? '서울' : '—'), size: 22 }
      ].map(function (s, i) { s.br = i % 2 === 0 ? '1.5px solid #0A0A0A' : '0'; s.bb = i < 2 ? '1.5px solid #0A0A0A' : '0'; return s; }),
      showCard: recordOpen && !st.reportSaved && !st.cardDismissed,
      dismiss: function () { self.setState({ cardDismissed: true }); },
      cardArtists: nSaved,
      cardTracks: included,
      locked: !recordOpen && !st.reportSaved,
      tasks: [PARTS[0], PARTS[1], PARTS[3], PARTS[2]].map(function (p) {
        var d = p.state === 'done', opt = p.key === 'checklist';
        return { label: p.title + (p.key === 'playlist' ? ' 내보내기' : (p.key === 'ticket' ? ' 등록' : (opt ? ' 챙기기' : ' 설정'))),
          state: d ? '완료' : (opt ? '선택 · ' + packed + '/' + packTotal : '남음'),
          dot: d ? INK : 'transparent', ring: opt && !d ? 'dashed' : 'solid',
          color: d || opt ? 'rgba(10,10,10,0.55)' : INK, weight: d || opt ? 400 : 700 };
      }),
      goPrep: nav(st.added ? 'dash' : 'discover'),
      hasRows: st.reportSaved || recordOpen,
      total: shownRows.length + '개',
      rows: shownRows
    };

    // ---------- report edit ----------
    var firstOn = st.photos.indexOf(true);
    var stars = [1, 2, 3, 4, 5].map(function (n) {
      return { color: n <= st.rating ? INK : 'rgba(10,10,10,0.2)', checked: n === st.rating ? 'true' : 'false', label: n + '점',
        pick: function () { self.setState({ rating: n }); } };
    });
    var red = {
      photoCount: st.photos.filter(Boolean).length,
      photos: st.photos.map(function (on, k) {
        return { src: PHOTO_SRC[k], on: on, cover: on && k === firstOn, pressed: on ? 'true' : 'false',
          label: '사진 ' + (k + 1) + (on ? ' 선택됨' : ''), border: on ? '2px solid #0A0A0A' : '1.5px solid rgba(10,10,10,0.25)', opacity: on ? '1' : '0.55',
          toggle: function () { var nx = self.state.photos.slice(); nx[k] = !nx[k]; self.setState({ photos: nx }); } };
      }),
      highlight: st.highlight, hlLen: st.highlight.length,
      onHighlight: function (e) { self.setState({ highlight: e.target.value }); },
      rating: st.rating, stars: stars,
      seenCount: seenCount,
      artists: savedPicks.map(function (x) {
        var on = !!st.seen[x.id];
        return { name: x.name, meta: DAYS[x.day].label + ' · ' + kTime(x.start) + ' · ' + STAGE[x.stage],
          pressed: on ? 'true' : 'false', nameColor: on ? INK : 'rgba(10,10,10,0.55)', box: on ? INK : 'transparent',
          toggle: function () { var n = Object.assign({}, self.state.seen); n[x.id] = !n[x.id]; self.setState({ seen: n }); } };
      }),
      review: st.review, rvLen: st.review.length,
      onReview: function (e) { self.setState({ review: e.target.value }); },
      title: st.editingReport ? '리포트 수정하기' : '리포트 만들기',
      saveLabel: st.editingReport ? '수정 완료' : '리포트 저장하기',
      draftNote: st.editingReport ? '저장된 리포트 수정 중' : '임시 저장됨',
      cancel: function () {
        var s = self.state;
        if (s.editingReport && s.reportBackup) nav('report', Object.assign({ editingReport: false, reportBackup: null }, s.reportBackup))();
        else nav('record')();
      },
      save: function () {
        var s = self.state;
        if (!s.photos.some(Boolean)) { toast('대표 사진을 1장 이상 골라주세요', '!'); return; }
        if (!s.rating) { toast('별점을 남겨주세요', '!'); return; }
        var was = s.editingReport;
        nav('report', { reportSaved: true, sharedMsg: '', editingReport: false, reportBackup: null })();
        toast(was ? '리포트를 수정했어요' : '리포트를 저장했어요');
      }
    };

    // ---------- report ----------
    var chosen = [];
    st.photos.forEach(function (on, k) { if (on) chosen.push(PHOTO_SRC[k]); });
    var rep = {
      cover: chosen.length ? chosen[0] : PHOTO_SRC[0],
      photoCount: chosen.length,
      highlight: st.highlight || '오늘 밤을 한 줄로 남겨보세요',
      stars: stars, rating: st.rating,
      moments: chosen.map(function (src, k) { return { src: src, span: k === 0 ? 'grid-column: span 2; grid-row: span 2; ' : '' }; }),
      noPhotos: chosen.length === 0,
      seenCount: seenCount, artistTotal: nSaved,
      artists: savedPicks.map(function (x) {
        return Object.assign({ name: x.name, opacity: st.seen[x.id] ? '1' : '0.35' }, face(x.name));
      }),
      review: st.review || '아직 감상을 남기지 않았어요',
      reviewColor: st.review ? INK : 'rgba(10,10,10,0.55)',
      shared: !!st.sharedMsg, sharedMsg: st.sharedMsg,
      openShare: function () { self.setState({ shareOpen: true }); },
      edit: function () {
        var s = self.state;
        nav('reportEdit', { editingReport: true, reportBackup: { photos: s.photos.slice(), highlight: s.highlight, rating: s.rating, seen: Object.assign({}, s.seen), review: s.review } })();
      },
      sheetOpen: !!st.shareOpen,
      closeShare: function () { self.setState({ shareOpen: false }); },
      targets: [['인스타그램 스토리', '스토리용 세로 카드로 바로 올리기', '인스타그램 스토리에 공유했어요'], ['카카오톡', '친구에게 리포트 링크 보내기', '카카오톡으로 보냈어요'], ['이미지 저장', '리포트 카드를 앨범에 저장', '이미지를 앨범에 저장했어요'], ['링크 복사', '리포트 링크 복사하기', '링크를 복사했어요']].map(function (t) {
        return { label: t[0], desc: t[1], pick: function () {
          if (t[0] === '인스타그램 스토리' || t[0] === '이미지 저장') { nav('story', { storyMode: t[0] === '이미지 저장' ? 'save' : 'story' })(); return; }
          toast(t[2], '✓', { shareOpen: false, sharedMsg: t[2] });
        } };
      })
    };

    // ---------- story card (share) ----------
    var story = {
      cover: rep.cover, highlight: st.highlight || '오늘 밤을 한 줄로 남겨보세요',
      syms: [1, 2, 3, 4, 5].map(function (n) { return { color: n <= st.rating ? '#0A0A0A' : 'rgba(10,10,10,0.2)' }; }),
      seen: '본 무대 ' + seenCount + '팀 · 사진 ' + rep.photoCount + '장',
      back: nav('report'),
      cta: st.storyMode === 'save' ? '이미지 저장하기' : '인스타그램 스토리에 올리기',
      act: function () {
        var msg = self.state.storyMode === 'save' ? '이미지를 앨범에 저장했어요' : '인스타그램 스토리에 공유했어요';
        nav('report', { sharedMsg: msg })();
        toast(msg);
      }
    };

    // ---------- notices ----------
    var notices = {
      back: nav('discover'),
      fresh: [
        { tag: 'D-DAY', title: '오늘은 그랜드 민트 페스티벌!', body: '티켓 QR과 오늘 볼 무대를 한 화면에 모아뒀어요', time: '방금', open: nav('today', { dday: true, added: true, picks: Object.keys(st.picks).length ? st.picks : { d1m2: true, d1m3: true, d1m4: true }, savedDays: Object.keys(st.savedDays).length ? st.savedDays : { 1: true } }) },
        { tag: '라인업 공개', title: '세종 보헤미안 뮤직 페스티벌 라인업 공개', body: '알림을 신청한 페스티벌의 라인업이 나왔어요', time: '2시간 전', open: nav('detail', { detailFest: 'sejong', detailFrom: 'notices' }) }
      ],
      old: [
        { tag: 'D-1', title: '내일이에요, 짐은 다 챙겼나요?', body: '체크리스트에 남은 짐을 확인해 보세요', time: '어제', open: nav(st.added ? 'check' : 'prep') },
        { tag: '무대 30분 전', title: '핑크팬서리스 무대가 곧 시작해요', body: '오후 8:20 · 민트 브리즈 스테이지', time: '어제', open: nav('artist', { artistId: 'd1m4', artistFrom: 'notices' }) },
        { tag: '취향 추천', title: (g0 || '인디') + OBJ[g0 || '인디'] + ' 좋아한다면 · 인뮤페 2026', body: '고른 취향과 비슷한 페스티벌이 열려요', time: '3일 전', open: nav('detail', { detailFest: 'inmufe', detailFrom: 'notices' }) }
      ]
    };

    // ---------- MY sub pages ----------
    var LIKE_ORDER = ['핑크팬서리스', '페퍼톤스', '잔나비', '혁오', '타일라', '실리카겔', '데이식스', '넬', '터치드', '루시', '드래곤포니', '국카스텐', '쏜애플', '데이브레이크', '씨엔블루', '엔플라잉'];
    var likedNames = LIKE_ORDER.filter(function (n) { return !!st.liked[n]; });
    var likes = {
      count: likedNames.length + '명',
      has: likedNames.length > 0, empty: likedNames.length === 0,
      rows: likedNames.map(function (n) {
        var x = allSets.filter(function (y) { return y.name === n; })[0];
        return Object.assign({ name: n, meta: '그랜드 민트 ' + DAYS[x.day].label + ' · ' + kTime(x.start) + ' · ' + STAGE_ROLE[x.stage],
          open: nav('artist', { artistId: x.id, artistFrom: 'my' }),
          label: n + ' 찜 해제',
          unlike: function () { var o = Object.assign({}, self.state.liked); delete o[n]; toast(n + ' 찜을 해제했어요', '✓', { liked: o }); } }, face(n));
      })
    };
    var ALERTS = [['lineup', '라인업 공개', '알림을 신청한 페스티벌의 라인업이 나오면 알려드려요'], ['dday', 'D-day 알림', 'D-7 · D-1 · 당일 아침에 준비 상황을 알려드려요'], ['stage', '무대 시작 30분 전', '내 타임테이블에 담은 무대가 곧 시작할 때'], ['report', '공연 후 리포트', '공연이 끝나면 리포트 만들기를 알려드려요'], ['recommend', '취향 추천', '고른 취향에 맞는 새 페스티벌이 열리면']];
    var alertsOn = ALERTS.filter(function (a) { return !!st.alerts[a[0]]; }).length;
    var alerts = {
      rows: ALERTS.map(function (a) {
        var on = !!st.alerts[a[0]];
        return { label: a[1], desc: a[2], on: on ? 'true' : 'false', track: on ? INK : 'transparent', knob: on ? LAV : INK, justify: on ? 'flex-end' : 'flex-start',
          toggle: function () { var o = Object.assign({}, self.state.alerts); o[a[0]] = !o[a[0]]; self.setState({ alerts: o }); } };
      })
    };
    var MUSIC_APPS = [['Spotify', '연결하면 플레이리스트를 바로 저장해요'], ['Apple Music', '보관함에 플레이리스트로 추가해요'], ['YouTube Music', '재생목록으로 저장해요'], ['멜론', '내 플레이리스트로 저장해요']];
    var connectedNames = MUSIC_APPS.filter(function (a) { return !!st.connected[a[0]]; }).map(function (a) { return a[0]; });
    var music = {
      rows: MUSIC_APPS.map(function (a) {
        var on = !!st.connected[a[0]];
        return { name: a[0], status: on ? '연결됨' + (st.exportedTo === a[0] ? ' · 페스티벌 플레이리스트 1개' : '') : a[1],
          btn: on ? '연결 해제' : '연결하기', btnBg: on ? 'transparent' : INK, btnFg: on ? INK : LAV, weight: on ? 700 : 500,
          act: function () {
            var c = Object.assign({}, self.state.connected);
            if (c[a[0]]) { delete c[a[0]]; toast(a[0] + ' 연결을 해제했어요', '✓', { connected: c }); }
            else { c[a[0]] = true; toast(a[0] + WA[a[0]] + ' 연결했어요', '✓', { connected: c }); }
          } };
      })
    };
    function notOpen() { toast('프로토타입에서는 열리지 않는 페이지예요', '!'); }
    var settings = {
      data: [
        { label: '기록 보관', value: '이 기기에 저장 중', open: function () { toast('로그인 없이 이 기기에 기록을 저장하고 있어요'); }, arrow: false },
        { label: '백업 파일 내보내기', value: '', open: function () { toast('백업 파일을 저장했어요'); }, arrow: true }
      ],
      app: [
        { label: '처음 화면 다시 보기', value: '', open: nav('splash'), arrow: true },
        { label: '이용약관', value: '', open: notOpen, arrow: true },
        { label: '개인정보 처리방침', value: '', open: notOpen, arrow: true },
        { label: '오픈소스 라이선스', value: '', open: notOpen, arrow: true },
        { label: '앱 버전', value: '1.0.0', open: function () { toast('최신 버전이에요'); }, arrow: false }
      ]
    };

    // ---------- my ----------
    function soon() { toast('프로토타입에서는 준비 중인 메뉴예요', '!'); }
    var my = {
      tasteLine: pickedGenres.length ? pickedGenres.slice(0, 2).join(' · ') + ' 페스티벌을 좋아해요' : '아직 취향을 고르지 않았어요',
      nick: st.nick,
      soon: nav('myProfile'),
      openNext: nav(st.dday ? 'today' : 'dash', { dashFrom: 'my' }),
      stats: [
        { label: '준비 중', value: st.added && !st.reportSaved ? '1' : '0', open: nav(st.added ? 'prep' : 'discover') },
        { label: '다녀온 곳', value: st.reportSaved ? '1' : '0', open: nav('record') },
        { label: '리포트', value: st.reportSaved ? '1' : '0', open: nav(st.reportSaved ? 'report' : 'record') }
      ].map(function (s, i) { s.br = i < 2 ? '1.5px solid #0A0A0A' : '0'; return s; }),
      hasNext: !!st.added,
      dday: DDAY,
      progress: doneCount + '/4',
      tags: pickedGenres.concat(pickedArtists).map(function (t) { return { label: t }; }),
      noTags: pickedGenres.length + pickedArtists.length === 0,
      menu: [
        { ic: { heart: true }, label: '찜한 아티스트', value: likedNames.length + '명', open: nav('myLikes') },
        { ic: { bell: true }, label: '알림 설정', value: alertsOn + '개 켜짐', open: nav('myNotify') },
        { ic: { music: true }, label: '연결된 음악 앱', value: connectedNames.length ? connectedNames.join(', ') : '없음', open: nav('myMusic') },
        { ic: { gear: true }, label: '설정', value: '', open: nav('mySettings') }
      ]
    };

    // ---------- screens / ui ----------
    var SCREENS = ['discover', 'search', 'detail', 'artist', 'prep', 'dash', 'tte', 'tt', 'check', 'playlist', 'ticket', 'summary', 'record', 'reportEdit', 'report', 'my',
      'splash', 'onboard', 'notices', 'today', 'pass', 'story', 'myProfile', 'myLikes', 'myNotify', 'myMusic', 'mySettings'];
    var is = {};
    SCREENS.forEach(function (s) { is[s] = st.screen === s; });
    var CTA_SCREENS = { detail: 1, artist: 1, tte: 1, ticket: 1, reportEdit: 1, onboard: 1, story: 1, myProfile: 1 };
    var BARE_SCREENS = { search: 1, splash: 1, notices: 1, pass: 1 };
    var ui = {
      hasToast: !!st.toast,
      hasPush: !!st.push,
      openPush: function () {
        if (self._pushHide) clearTimeout(self._pushHide);
        nav('today', { dday: true, push: false })();
      },
      toast: st.toast,
      toastIcon: st.toastIcon || '✓',
      toastBottom: BARE_SCREENS[st.screen] ? 28 : (CTA_SCREENS[st.screen] ? 104 : 106)
    };

    return {
      is: is, ui: ui,
      go: {
        discover: nav('discover'),
        search: openSearch('discover'),
        prep: nav('prep'),
        dash: nav('dash'),
        summary: nav('summary'),
        record: nav('record'),
        reportEdit: nav('reportEdit', { editingReport: false }),
        my: nav('my'),
        tte: nav('tte', { tteDay: st.savedDays[1] ? (st.savedDays[2] ? 1 : 2) : 1 }),
        onboard: nav('onboard'),
        notices: nav('notices', { noticesRead: true }),
        today: nav('today'),
        my: nav('my')
      },
      disc: disc, srch: srch, det: det, art: art, prep: prep, dash: dash, tte: tte, tt: tt, chk: chk, pl: pl, tk: tk, sum: sum, rec: rec, red: red, rep: rep, my: my,
      taste: taste, conn: conn, pass: pass, today: today, story: story, notices: notices, likes: likes, alerts: alerts, music: music, settings: settings
    };
  }
}
  return Component;
})();

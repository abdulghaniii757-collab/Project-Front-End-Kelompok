const nama = document.getElementById('nama');
const berat = document.getElementById('berat');
const tinggi = document.getElementById('tinggi');
const hasil = document.getElementById('hasil');
const error = document.getElementById('error');
let satuan = 'metric';

document.getElementById('btnMetric').onclick = function() {
  pilihSatuan('metric');
};

document.getElementById('btnImperial').onclick = function() {
  pilihSatuan('imperial');
};

function pilihSatuan(s) {
  satuan = s;
  const tombolMetric = document.getElementById('btnMetric');
  const tombolImperial = document.getElementById('btnImperial');
  const unitBerat = document.getElementById('unitBerat');
  const unitTinggi = document.getElementById('unitTinggi');

  tombolMetric.classList.toggle('aktif', s === 'metric');
  tombolImperial.classList.toggle('aktif', s === 'imperial');

  if (s === 'metric') {
    unitBerat.textContent = 'kg';
    unitTinggi.textContent = 'cm';
    berat.min = 2;
    berat.max = 300;
    berat.placeholder = '60';
    tinggi.min = 40;
    tinggi.max = 200;
    tinggi.placeholder = '165';
  } else {
    unitBerat.textContent = 'lbs';
    unitTinggi.textContent = 'in';
    berat.min = 5;
    berat.max = 660;
    berat.placeholder = '130';
    tinggi.min = 18;
    tinggi.max = 200;
    tinggi.placeholder = '20';
  }

  berat.value = '';
  tinggi.value = '';
  hasil.style.display = 'none';
  error.style.display = 'none';
}

// Mencegah user mengetik berat atau tinggi di luar batas max
berat.oninput = function() {
  if (parseFloat(berat.value) > parseFloat(berat.max)) {
    berat.value = berat.max;
  }
};

tinggi.oninput = function() {
  if (parseFloat(tinggi.value) > parseFloat(tinggi.max)) {
    tinggi.value = tinggi.max;
  }
};

document.getElementById('btnHitung').onclick = function() {
  const n = nama.value.trim() || 'Tanpa Nama';
  const b = parseFloat(berat.value);
  const t = parseFloat(tinggi.value);

  if (!b || !t || b <= 0 || t <= 0) {
    error.textContent = 'Isi nama, berat & tinggi dengan valid.';
    error.style.display = 'block';
    hasil.style.display = 'none';
    return;
  }

  const minBerat = parseFloat(berat.min);
  const maxBerat = parseFloat(berat.max);
  const minTinggi = parseFloat(tinggi.min);
  const maxTinggi = parseFloat(tinggi.max);
  const unitBerat = satuan === 'metric' ? 'kg' : 'lbs';
  const unitTinggi = satuan === 'metric' ? 'cm' : 'in';

  if (b < minBerat || b > maxBerat) {
    error.textContent = 'Berat badan harus di antara ' + minBerat + ' dan ' + maxBerat + ' ' + unitBerat + '.';
    error.style.display = 'block';
    hasil.style.display = 'none';
    return;
  }

  if (t < minTinggi || t > maxTinggi) {
    error.textContent = 'Tinggi badan harus di antara ' + minTinggi + ' dan ' + maxTinggi + ' ' + unitTinggi + '.';
    error.style.display = 'block';
    hasil.style.display = 'none';
    return;
  }

  error.style.display = 'none';

  let bmi;
  let tinggiMeter;

  if (satuan === 'imperial') {
    bmi = (b / (t * t)) * 703;
    tinggiMeter = t * 0.0254;
  } else {
    tinggiMeter = t / 100;
    bmi = b / (tinggiMeter * tinggiMeter);
  }

  let label;
  let warna;

  if (bmi < 18.5) {
    label = 'Kekurangan berat badan';
    warna = '#6fa8dc';
  } else if (bmi < 25) {
    label = 'Normal';
    warna = '#5fd67a';
  } else if (bmi < 30) {
    label = 'Kelebihan berat badan';
    warna = '#e0b64f';
  } else {
    label = 'Obesitas';
    warna = '#e0654f';
  }

  document.getElementById('angkaBmi').textContent = bmi.toFixed(1);
  document.getElementById('labelKategori').textContent = label;
  document.getElementById('labelKategori').style.background = warna;

  const idealMin = (18.5 * tinggiMeter * tinggiMeter).toFixed(1);
  const idealMax = (24.9 * tinggiMeter * tinggiMeter).toFixed(1);

  if (satuan === 'imperial') {
    const idealMinLbs = (idealMin * 2.20462).toFixed(1);
    const idealMaxLbs = (idealMax * 2.20462).toFixed(1);
    document.getElementById('beratIdeal').textContent = 'Berat ideal: ' + idealMinLbs + '-' + idealMaxLbs + ' lbs';
  } else {
    document.getElementById('beratIdeal').textContent = 'Berat ideal: ' + idealMin + '-' + idealMax + ' kg';
  }

  hasil.style.display = 'block';

  const riwayat = JSON.parse(localStorage.getItem('riwayatBmi') || '[]');
  riwayat.unshift({ nama: n, bmi: bmi.toFixed(1), label: label });
  localStorage.setItem('riwayatBmi', JSON.stringify(riwayat.slice(0, 5)));
  renderRiwayat();
};

nama.onkeydown = tekanEnter;
berat.onkeydown = tekanEnter;
tinggi.onkeydown = tekanEnter;

function tekanEnter(event) {
  if (event.key === 'Enter') {
    document.getElementById('btnHitung').click();
  }
}

document.getElementById('btnReset').onclick = function() {
  nama.value = '';
  berat.value = '';
  tinggi.value = '';
  hasil.style.display = 'none';
  error.style.display = 'none';
};

document.getElementById('btnHapusRiwayat').onclick = function() {
  localStorage.removeItem('riwayatBmi');
  renderRiwayat();
};

function renderRiwayat() {
  const riwayat = JSON.parse(localStorage.getItem('riwayatBmi') || '[]');
  const daftar = document.getElementById('daftarRiwayat');
  let isi = '';

  for (let i = 0; i < riwayat.length; i++) {
    isi += '<li><strong>' + riwayat[i].nama + '</strong>: ' + riwayat[i].bmi + ' kg/m2 - ' + riwayat[i].label + '</li>';
  }

  if (isi === '') {
    isi = '<p style="color:var(--muted);font-size:13px">Belum ada riwayat.</p>';
  }

  daftar.innerHTML = isi;
}

renderRiwayat();
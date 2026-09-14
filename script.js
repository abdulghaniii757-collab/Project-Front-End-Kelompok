const $ = (id) => document.getElementById(id);
const nama = $('nama'), berat = $('berat'), tinggi = $('tinggi'), hasil = $('hasil'), error = $('error');
let satuan = 'metric';

const KATEGORI = [
  { batas: 18.5, label: 'Kekurangan berat badan', warna: '#6fa8dc' },
  { batas: 25,   label: 'Normal', warna: '#5fd67a' },
  { batas: 30,   label: 'Kelebihan berat badan', warna: '#e0b64f' },
  { batas: Infinity, label: 'Obesitas', warna: '#e0654f' },
];
const klasifikasi = (bmi) => KATEGORI.find(k => bmi < k.batas);

$('btnMetric').onclick = () => pilihSatuan('metric');
$('btnImperial').onclick = () => pilihSatuan('imperial');

function pilihSatuan(s) {
  satuan = s;
  $('btnMetric').classList.toggle('aktif', s === 'metric');
  $('btnImperial').classList.toggle('aktif', s === 'imperial');
  $('unitBerat').textContent = s === 'metric' ? 'kg' : 'lbs';
  $('unitTinggi').textContent = s === 'metric' ? 'cm' : 'in';
  
  if (s === 'metric') {
    berat.min = 3;
    berat.max = 300;
    berat.placeholder = "60";
  } else {
    // 3 kg = ~6.6 lbs, 300 kg = ~661 lbs
    berat.min = 7;
    berat.max = 660;
    berat.placeholder = "130";
  }
  
  berat.value = '';
  tinggi.value = '';
  hasil.style.display = 'none';
  error.style.display = 'none';
}

// Mencegah user mengetik berat di luar batas min/max
berat.oninput = () => {
  const val = parseFloat(berat.value);
  const max = parseFloat(berat.max);
  if (val > max) berat.value = max;
};

$('btnHitung').onclick = () => {
  const n = nama.value.trim() || 'Tanpa Nama';
  const b = parseFloat(berat.value), t = parseFloat(tinggi.value);
  
  if (!b || !t || b <= 0 || t <= 0) { 
    error.textContent = 'Isi nama, berat & tinggi dengan valid.';
    error.style.display = 'block'; 
    hasil.style.display = 'none'; 
    return; 
  }

  const minBerat = parseFloat(berat.min);
  const maxBerat = parseFloat(berat.max);

  if (b < minBerat || b > maxBerat) {
    error.textContent = `Berat badan harus di antara ${minBerat} dan ${maxBerat} ${satuan === 'metric' ? 'kg' : 'lbs'}.`;
    error.style.display = 'block';
    hasil.style.display = 'none';
    return;
  }

  error.style.display = 'none';

  let bmi = 0;
  let tinggiMeter = 0;

  if (satuan === 'imperial') {
    bmi = (b / (t * t)) * 703;
    tinggiMeter = t * 0.0254;
  } else {
    tinggiMeter = t / 100;
    bmi = b / (tinggiMeter * tinggiMeter);
  }

  const kat = klasifikasi(bmi);

  $('angkaBmi').textContent = bmi.toFixed(1);
  $('labelKategori').textContent = kat.label;
  $('labelKategori').style.background = kat.warna;

  const idealMin = (18.5 * tinggiMeter * tinggiMeter).toFixed(1);
  const idealMax = (24.9 * tinggiMeter * tinggiMeter).toFixed(1);
  
  if (satuan === 'imperial') {
    const idealMinLbs = (idealMin * 2.20462).toFixed(1);
    const idealMaxLbs = (idealMax * 2.20462).toFixed(1);
    $('beratIdeal').textContent = `Berat ideal: ${idealMinLbs}–${idealMaxLbs} lbs`;
  } else {
    $('beratIdeal').textContent = `Berat ideal: ${idealMin}–${idealMax} kg`;
  }

  hasil.style.display = 'block';

  const riwayat = JSON.parse(localStorage.getItem('riwayatBmi') || '[]');
  riwayat.unshift({ nama: n, bmi: bmi.toFixed(1), label: kat.label });
  localStorage.setItem('riwayatBmi', JSON.stringify(riwayat.slice(0, 5)));
  renderRiwayat();
};

[nama, berat, tinggi].forEach(el => el.onkeydown = (e) => {
  if (e.key === 'Enter') $('btnHitung').click();
});

$('btnReset').onclick = () => { 
  nama.value = ''; 
  berat.value = ''; 
  tinggi.value = ''; 
  hasil.style.display = 'none'; 
  error.style.display = 'none';
};

$('btnHapusRiwayat').onclick = () => { 
  localStorage.setItem('riwayatBmi', '[]'); 
  renderRiwayat(); 
};

function renderRiwayat() {
  const riwayat = JSON.parse(localStorage.getItem('riwayatBmi') || '[]');
  $('daftarRiwayat').innerHTML = riwayat.map(r => `<li><strong>${r.nama}</strong>: ${r.bmi} kg/m² — ${r.label}</li>`).join('') || '<p style="color:var(--muted);font-size:13px">Belum ada riwayat.</p>';
}

renderRiwayat();
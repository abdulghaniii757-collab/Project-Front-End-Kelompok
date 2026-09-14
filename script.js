const $ = (id) => document.getElementById(id);
const berat = $('berat'), tinggi = $('tinggi'), hasil = $('hasil'), error = $('error');
let satuan = 'metric';

const KATEGORI = [
  { batas: 18.5, label: 'Kekurangan berat badan', warna: '#6fa8dc' },
  { batas: 25,   label: 'Normal', warna: '#5fd67a' },
  { batas: 30,   label: 'Kelebihan berat badan', warna: '#e0b64f' },
  { batas: Infinity, label: 'Obesitas', warna: '#e0654f' },
];
const klasifikasi = (bmi) => KATEGORI.find(k => bmi < k.batas);

const keMetric = (b, t) => satuan === 'imperial'
  ? { kg: b * 0.453592, cm: t * 2.54 }
  : { kg: b, cm: t };

$('btnMetric').onclick = () => pilihSatuan('metric');
$('btnImperial').onclick = () => pilihSatuan('imperial');
function pilihSatuan(s) {
  satuan = s;
  $('btnMetric').classList.toggle('aktif', s === 'metric');
  $('btnImperial').classList.toggle('aktif', s === 'imperial');
  $('unitBerat').textContent = s === 'metric' ? 'kg' : 'lbs';
  $('unitTinggi').textContent = s === 'metric' ? 'cm' : 'in';
}

$('btnHitung').onclick = () => {
  const b = parseFloat(berat.value), t = parseFloat(tinggi.value);
  if (!b || !t || b <= 0 || t <= 0) { error.style.display = 'block'; hasil.style.display = 'none'; return; }
  error.style.display = 'none';

  const m = keMetric(b, t);
  const tm = m.cm / 100;
  const bmi = m.kg / (tm * tm);
  const kat = klasifikasi(bmi);

  $('angkaBmi').textContent = bmi.toFixed(1);
  $('labelKategori').textContent = kat.label;
  $('labelKategori').style.background = kat.warna;
  $('beratIdeal').textContent = `Berat ideal: ${(18.5*tm*tm).toFixed(1)}–${(24.9*tm*tm).toFixed(1)} kg`;
  hasil.style.display = 'block';

  const riwayat = JSON.parse(localStorage.getItem('riwayatBmi') || '[]');
  riwayat.unshift({ bmi: bmi.toFixed(1), label: kat.label });
  localStorage.setItem('riwayatBmi', JSON.stringify(riwayat.slice(0, 5)));
  renderRiwayat();
};

[berat, tinggi].forEach(el => el.onkeydown = (e) => {
  if (e.key === 'Enter') $('btnHitung').click();
});

$('btnReset').onclick = () => { berat.value = ''; tinggi.value = ''; hasil.style.display = 'none'; };

$('btnHapusRiwayat').onclick = () => { localStorage.setItem('riwayatBmi', '[]'); renderRiwayat(); };

function renderRiwayat() {
  const riwayat = JSON.parse(localStorage.getItem('riwayatBmi') || '[]');
  $('daftarRiwayat').innerHTML = riwayat.map(r => `<li>${r.bmi} kg/m² — ${r.label}</li>`).join('') || '<p style="color:var(--muted);font-size:13px">Belum ada riwayat.</p>';
}

renderRiwayat();
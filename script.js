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

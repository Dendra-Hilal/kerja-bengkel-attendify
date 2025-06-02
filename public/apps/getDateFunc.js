function getIndonesianDate(date = new Date()) {
  const day = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const dayName = day[date.getDay()];
  const dateDay = date.getDate();
  const monthName = month[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${dateDay} ${monthName} ${year}`;
}

module.exports = getIndonesianDate;
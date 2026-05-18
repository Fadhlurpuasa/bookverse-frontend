export const rupiah = (value = 0) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export const shortText = (text = '', length = 130) =>
  text.length > length ? `${text.slice(0, length)}...` : text;

export const getBookImage = (book) =>
  book?.coverUrl || `https://placehold.co/420x600/f3efe4/201b13?text=${encodeURIComponent(book?.title || 'BookVerse')}`;

export const unwrap = (response) => response?.data?.data ?? response?.data;

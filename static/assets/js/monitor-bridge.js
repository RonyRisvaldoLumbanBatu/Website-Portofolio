// ---------- Di dalam monitor ruang 3D ----------
// Ruang 3D (induk iframe) butuh gerak mouse & tombol dari sini untuk menggerakkan kameranya.
// Hanya dikirim ke origin yang sama, supaya situs lain yang menyematkan halaman ini tidak bisa menyadap ketikan.
if (window.parent !== window) {
  ['mousemove', 'mousedown', 'mouseup', 'keydown', 'keyup'].forEach(type =>
    addEventListener(type, e =>
      parent.postMessage({ type, clientX: e.clientX, clientY: e.clientY, key: e.key }, location.origin)));
}

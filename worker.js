addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Mendefinisikan URL target dari API yang akan dipanggil
  const apiUrl = 'https://explorer.theqrl.org/api/miningstats';

  // Memeriksa apakah metode request adalah 'OPTIONS', jika ya, maka ini adalah preflight request
  if (request.method === 'OPTIONS') {
    // Membuat response untuk preflight request
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Mengambil data dari API target
  const response = await fetch(apiUrl);

  // Mengambil body dari response
  const responseBody = await response.text();

  // Membuat response baru dengan body dan header CORS
  return new Response(responseBody, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
}

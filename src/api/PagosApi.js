/* solo GET PARA PAGOS
*/
const API_URL = "http://localhost:8032/api/pagos";

export async function getPagos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

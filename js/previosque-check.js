/** PREVIOSQUE
 *  previosque-check.js
 *
 *  Autor: Rodrigo Menezes
 *         rodrigo@rapidlight.io
 *
 *  Detecta se a página que está sendo visualizada no Quiosque
 *  corresponde a uma lista de arquivos. Se sim, envia mensagem
 *  para background.js solicitando a injeção dos arquivos principais
 *  da extensão.
 */

var h1 = document.querySelector('h1');
if (typeof h1 !== 'undefined' && h1.innerHTML === 'Arquivos') {
	chrome.runtime.sendMessage('injectPreviosqueFiles');
}
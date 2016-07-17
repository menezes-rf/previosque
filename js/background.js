/** PREVIOSQUE
 *  background.js
 *
 *  Autor: Rodrigo Menezes
 *         rodrigo@rapidlight.io
 */

/*
 *  Função para injeção da folha de estilos e script principal da
 *  extensão na aba informada.
 */
function injectPreviosqueFiles(tabId, docViewerEnabled) {

	/*
	 *  Cria objeto que conterá extensões de tipos de arquivos suportados
	 *  e seus tipos MIME correspondentes.
	 */
	var supportedFileTypes = {};

	/*
	 *  Não é necessário qualquer complemento para visualizar arquivos
	 *  destes tipos diretamente no navegador.
	 */
	supportedFileTypes['txt']  = 'text/plain';
	supportedFileTypes['bmp']  = 'image/bmp';
	supportedFileTypes['jpg']  = 'image/jpeg';
	supportedFileTypes['jpeg'] = 'image/jpeg';
	supportedFileTypes['png']  = 'image/png';
	supportedFileTypes['gif']  = 'image/gif';
	supportedFileTypes['pdf']  = 'application/pdf';

	/*
	 *  Se a extensão Editor do Office estiver instalada, o navegador
	 *  poderá exibir também arquivos doc, docx, xls, xlsx, ppt, pps,
	 *  pptx e ppsx.
	 */
	if (docViewerEnabled) {
		supportedFileTypes['doc']  = 'application/msword';
		supportedFileTypes['docx'] = 'application/msword';
		supportedFileTypes['xls']  = 'application/vnd.ms-excel';
		supportedFileTypes['xlsx'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		supportedFileTypes['ppt']  = 'application/vnd.ms-powerpoint';
		supportedFileTypes['pps']  = 'application/vnd.ms-powerpoint';
		supportedFileTypes['pptx'] = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
		supportedFileTypes['ppsx'] = 'application/vnd.openxmlformats-officedocument.presentationml.slideshow';
	}

	/*
	 *  Injeta folha de estilos e script principal da extensão na
	 *  página, enviando uma mensagem à aba em seguida, informando
	 *  os tipos de arquivos que podem ser visualizados diretamente
	 *  no navegador.
	 */
	chrome.tabs.insertCSS(tabId, { 'file': 'css/previosque.css' });
	chrome.tabs.executeScript(tabId, { 'file': 'js/previosque.js' }, function() {
		chrome.tabs.sendMessage(tabId, { 'supportedFileTypes': supportedFileTypes });
	});
}

/*
 *  Verifica se a extensão Editor do Office encontra-se instalada e
 *  ativa, passando o resultado para a função callback.
 */
function checkForDocViewer(callback) {
	chrome.management.get('gbkeegbaiigmenfmjfclcdgdpimamgkj', function(extensionInfo) {
		if (typeof chrome.runtime.lastError === 'undefined' && extensionInfo.enabled) {
			callback(true);
			return;
		}
		callback(false);
	});
}

/*
 *  Ao receber a mensagem 'injectPreviosqueFiles', chama a função
 *  correspondente, informando se a extensão Editor do Office
 *  encontra-se instalada e ativa.
 */
function processMessage(request, sender, sendResponse) {
	if (request === 'injectPreviosqueFiles' && sender.tab) {
		checkForDocViewer(function(docViewerPresent) {
			injectPreviosqueFiles(sender.tab.id, docViewerPresent);
		});
	}
}

/*
 *  Abre página de boas vindas.
 */
function openWelcomePage(object) {
	chrome.tabs.create({ 'url': 'html/welcome.html' });
}

/*
 *  Indica função para processamento das mensagens recebidas.
 */
chrome.runtime.onMessage.addListener(processMessage);

/*
 *  Indica função para execução após a instalação da extensão.
 */
chrome.runtime.onInstalled.addListener(openWelcomePage);
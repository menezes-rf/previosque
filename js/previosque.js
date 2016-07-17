/** PREVIOSQUE
 *  previosque-check.js
 *
 *  Autor: Rodrigo Menezes
 *         rodrigo@rapidlight.io
 */

/*
 *  Declaração da variável que armazenará o objeto contendo as
 *  extensões e tipos MIME de arquivos que podem ser visualizados
 *  diretamente pelo navegador.
 */
 var supportedFileTypes;

/*
 *  Extrai a extensão do nome do arquivo.
 */
function filenameToExt(filename) {
	var split = filename.split('.');
	return split[split.length - 1];
}

/*
 *  Identifica o tipo MIME a partir do nome do arquivo.
 */
function getFileMIMEType(filename) {
	return supportedFileTypes[filenameToExt(filename)];
}

/*
 *  Identifica se o arquivo é suportado a partir de seu nome.
 */
function isFileTypeSupported(filename) {
	return (typeof getFileMIMEType(filename) !== 'undefined');
}

/*
 *  Cria e insere na página os elementos da extensão.
 */
function createPreviosqueUI() {
	var  progress = document.createElement('div');
	var container = document.createElement('div');

	progress.setAttribute('id', 'previosque-progress');
	progress.style.display = 'none';

	container.classList.add('content-container');

	console.log(progress);
	console.log(container);

	document.body.appendChild(progress);
	progress.appendChild(container);

	var div;
	var classes = ['filename', 'percentage', 'bar'];
	for (i in classes) {
		div = document.createElement('div');
		div.classList.add(classes[i]);
		container.appendChild(div);
		console.log(classes[i]);
	}

	var indicator = document.createElement('div');
	indicator.classList.add('indicator');

	console.log(indicator);

	var bar = document.querySelector('#previosque-progress .bar');
	console.log(bar);
	bar.appendChild(indicator);

	var a, filename, button;
	var anchors = document.querySelectorAll('.arq2_nome a');
	for (var i = 0; i < anchors.length; i++) {
		a = anchors[i];
		filename = a.innerHTML;
		if (isFileTypeSupported(filename)) {
			var button = document.createElement('a');
			button.innerHTML = 'pré-visualizar';
			button.setAttribute('href', a.href);
			button.dataset.filename = filename;
			button.classList.add('previosque-button');
			button.addEventListener('click', previosqueButtonClicked);
			a.parentNode.parentNode.insertBefore(button, a.parentNode.nextSibling);
		}
	}
}

/*
 *  Ao receber a mensagem contendo os tipos de arquivos que podem
 *  ser visualizados diretamente no navegador, chama a função que
 *  cria os elementos da extensão.
 */
function processMessage(request, sender, sendResponse) {
	if (typeof request === 'object' && typeof request.supportedFileTypes === 'object') {
		supportedFileTypes = request.supportedFileTypes;
		createPreviosqueUI();
	}
}

/*
 *  Exibe o indicador de progresso da transferência do arquivo.
 */
function showProgress(filename) {
	var progress = document.querySelector('#previosque-progress');
	var filename_div = progress.querySelector('.filename');
	var percentage = progress.querySelector('.percentage');
	var indicator = progress.querySelector('.indicator');
	filename_div.innerText = filename;
	percentage.innerText = '0';
	indicator.style.width = '0%';
	progress.style.display = '';
}

/*
 *  Atualiza o indicador de progresso da transferência do arquivo.
 */
function updateProgress(value) {
	var progress = document.querySelector('#previosque-progress');
	var percentage = progress.querySelector('.percentage');
	var indicator = progress.querySelector('.indicator');
	percentage.innerText = value;
	indicator.style.width = value + '%';
}

/*
 *  Oculta o indicador de progresso da transferência do arquivo.
 */
function hideProgress() {
	var progress = document.querySelector('#previosque-progress');
	progress.style.display = 'none';
}

/*
 *  Atualiza o indicador de progresso de transferência do arquivo.
 */
function fileTransferProgress(e) {
	if (e.lengthComputable) {
		updateProgress(Math.round((e.loaded / e.total) * 100));
	}	
}

/*
 *  Chamada ao término da transferência do arquivo.
 */
function fileTransferComplete(e, filename) {
	hideProgress();
	if (e.target.status === 200) {
		var blob = new Blob([e.currentTarget.response], { 'type': getFileMIMEType(filename) });
		window.open(URL.createObjectURL(blob));
		return;
	}
	alert('Ocorreu um erro ao carregar o arquivo. Por favor, atualize a página e tente novamente.');
}

/*
 *  Inicia transferência do arquivo.
 */
function openFile(filename, url) {
	showProgress(filename);
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	request.addEventListener('progress', fileTransferProgress);
	request.addEventListener('load', function(e) { fileTransferComplete(e, filename); });
	request.send();
}

/*
 *  Processa clique no botão pré-visualizar.
 */
function previosqueButtonClicked(e) {
	e.preventDefault();
	openFile(e.target.dataset.filename, e.target.getAttribute('href'));
}

/*
 *  Indica função para processamento das mensagens recebidas.
 */
chrome.runtime.onMessage.addListener(processMessage);
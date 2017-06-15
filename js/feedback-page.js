(function(mui, window, document, undefined) {
	mui.init();
	var get = function(id) {
		return document.getElementById(id);
	};
	var qsa = function(sel) {
		return [].slice.call(document.querySelectorAll(sel));
	};
	var ui = {
		imageList: get('image-list'),
		submit: get('submit')
	};
	ui.clearForm = function() {
		ui.question.value = '';
		ui.contact.value = '';
		ui.imageList.innerHTML = '';
		ui.newPlaceholder();
	};
	ui.getFileInputArray = function() {
		return [].slice.call(ui.imageList.querySelectorAll('input[type="file"]'));
	};
	ui.getFileInputIdArray = function() {
		var fileInputArray = ui.getFileInputArray();
		var idArray = [];
		fileInputArray.forEach(function(fileInput) {
			if(fileInput.value != '') {
				idArray.push(fileInput.getAttribute('data-src'));
			}
		});
		return idArray;
	};
	var imageIndexIdNum = 0;

	ui.newPlaceholder = function() {
		var fileInputArray = ui.getFileInputArray();
		if(fileInputArray &&
			fileInputArray.length > 0 &&
			fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
			return;
		}
		imageIndexIdNum++;
		var placeholder = document.createElement('div');
		placeholder.setAttribute('class', 'image-item space');
		var closeButton = document.createElement('div');
		closeButton.setAttribute('class', 'image-close');
		closeButton.innerHTML = 'X';
		closeButton.addEventListener('tap', function(event) {
			event.stopPropagation();
			event.cancelBubble = true;
			setTimeout(function() {
				ui.imageList.removeChild(placeholder);
			}, 0);
			return false;
		}, false);
		var fileInput = document.createElement('input');
		fileInput.setAttribute('type', 'file');
		fileInput.setAttribute('accept', 'image/*');
		fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
		fileInput.addEventListener('change',
			function(event) {
				var file = fileInput.files[0];
				if(file) {

					try {
						// 弹出系统等待对话框
						var w = plus.nativeUI.showWaiting("正在上传请稍候...");
						//执行上传操作
						var xhr = new XMLHttpRequest();
						xhr.open("post", "http://www.ldustu.com/index.php?s=/Home/Article/uploadImg.html", true);
						xhr.onreadystatechange = function() {
							if(xhr.readyState == 4) {
								var res = eval('(' + xhr.responseText + ')');
								if(res.success == true) {
									var reader = new FileReader();
									reader.onload = function() { //处理 android 4.1 兼容问题
										var base64 = reader.result.split(',')[1];
										var dataUrl = 'data:image/png;base64,' + base64;
										placeholder.style.backgroundImage = 'url(' + dataUrl + ')';

									}
									fileInput.setAttribute('data-src', res.file_path);
									reader.readAsDataURL(file);
									placeholder.classList.remove('space');
									ui.newPlaceholder();
									//关闭等待
									w.close();
								} else {
									mui.toast(res.msg);
								};
							};
						};
						//表单数据 
						var fd = new FormData();
						fd.append("upload_file", file);
						//执行发送 
						xhr.send(fd);
					} catch(e) {
						console.log(e);
					}

				}
			}, false);
		placeholder.appendChild(closeButton);
		placeholder.appendChild(fileInput);
		ui.imageList.appendChild(placeholder);
	};
	ui.newPlaceholder();
	ui.submit.addEventListener('tap', function(event) {
		var data = {
			images: ui.getFileInputIdArray(),
			content: get('content').value,
			contact: get('contact').value,
		};
		if(data.content == '') {
			mui.toast('请填写内容');
			return;
		}
		if(data.images.length > 6) {
			mui.toast('最多上传六张图片');
			return;
		}
		if(data.contact == '') {
			mui.toast('请填写联系方式');
			return;
		}
		mui.ajax('http://api.ldustu.com/api/feedback/store', {
			data: data,
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			//headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
			success: function(res) {
				if(res.code == 200) {
					get('content').value = '';
					get('contact').value = '';
					mui.toast('谢谢你的建议')
					mui.back();
				} else {
					mui.toast(res.message)
					return false;
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.alert('服务器错误');
			}
		});
	})
})(mui, window, document, undefined);
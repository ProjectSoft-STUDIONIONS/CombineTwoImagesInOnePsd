// Copyright 2008 - all. WEB GROUP ProjectSoft and STUDIONIONS.
// Combine two images in one PSD
// https://demiart.ru/forum/index.php?showtopic=261967
// Develop by ProjectSoft

/**
* @@@BUILDINFO@@@ CombineTwoImagesInOnePsd.jsx 
*/

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
	<name>Объеденение изображений по суфиксу имени</name>
	<about>
Скрипт объеденения изображений по суфиксу имени.
Разработчик: ProjectSoft
https://demiart.ru/forum/index.php?showtopic=261967

Copyright 2008 - all. WEB GROUP «ProjectSoft and STUDIONIONS».  All rights reserved.
	</about>
	<category>0ps_combinetwoimagesinonepsd</category>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/

#target photoshop
#strict on

app.bringToFront();



app.displayDialogs = DialogModes.NO;

var prefix = "-1",
	dialogMain = new Window("dialog"),
	settingsPanel = dialogMain.add("panel", undefined, "Опции"),
	groupSettings = settingsPanel.add("group"),
	help_01 = groupSettings.add('statictext'),
	group_01 = groupSettings.add("group"),
	staticTextFolder_01 = group_01.add('edittext', undefined, undefined, {multiline:false, readonly:true}),
	selectFolder_01 = group_01.add("button"),
	help_02 = groupSettings.add('statictext'),
	group_02 = groupSettings.add("group"),
	staticTextFolder_02 = group_02.add('edittext', undefined, undefined, {multiline:false, readonly:true}),
	selectFolder_02 = group_02.add("button"),
	suffixGroup = groupSettings.add("group"),
	sfxText = suffixGroup.add("statictext"),
	sfxVal = suffixGroup.add("edittext", undefined, "-1", {multiline:false, readonly:false}),
	help_03 = groupSettings.add('statictext'),
	group_03 = groupSettings.add("group"),
	staticTextFolder_03 = group_03.add('edittext', undefined, undefined, {multiline:false, readonly:true}),
	selectFolder_03 = group_03.add("button"),
	groupProgress = settingsPanel.add("group"),
	progress = groupProgress.add("progressbar", undefined, 100, 100),
	groupButton = settingsPanel.add("group"),
	btnStart = groupButton.add('button'),
	btnCancel = groupButton.add('button'),
	main = function(){
		dialogMain.cancelElement = btnCancel;
		dialogMain.center();
		dialogMain.show();
	},
	enabledButton = function(){
		btnStart.enabled = (staticTextFolder_01.text != "" && staticTextFolder_02.text != "" && staticTextFolder_03.text != "");
	},
	selectFolderDialog = function(stText, titleDialog, id){
		var defaultFolder = stText.text,
			folder = new Folder(defaultFolder);
		if (!folder.exists) {
			defaultFolder = "~";
		}
		var selFolder = Folder.selectDialog(titleDialog, defaultFolder),
			files = [];
		if ( selFolder != null ) {
			defaultFolder = selFolder.fsName;
			switch(id){
				case 1:
				case 2:
					files = getFilesInFolder(defaultFolder);
					if(files.length <= 0){
						stText.helpTip = stText.text = "";
						enabledButton();
						alert("Не найдено фалов для обработки", "Ошибка", true);
						return;
					}
					break;	
			}
			stText.helpTip = stText.text = defaultFolder;
		}
		enabledButton();
	},
	getFilesInFolder = function(path){
		var maskFiles = /\.(jpg|jpeg|png)$/i,
			tmpFolder = Folder(path),
			files = tmpFolder.getFiles(maskFiles);
		return files;
	},
	processFunction = function(){
		var folderAdd = staticTextFolder_02.text+"/",
			folderSave = staticTextFolder_03.text+"/",
			files = getFilesInFolder(staticTextFolder_01.text),
			length = files.length,
			result = [];
		prefix = sfxVal.text;
		btnStart.enabled = btnCancel.enabled = selectFolder_01.enabled = selectFolder_02.enabled = selectFolder_03.enabled = false;
		if(length){
			for (var i = 0; i < length; i++) {
				if (files[i] instanceof File) {
					var nameFile = files[i].name,
						ext = nameFile.substring( nameFile.indexOf("."), nameFile.length),
						name = nameFile.substring(0 , nameFile.indexOf(".")),
						fimprt = File(folderAdd + name + prefix + ext);
					if(fimprt.exists){
						try{
							var docRef = app.open(files[i]),
								aDesc_01 = new ActionDescriptor(),
								aDesc_02 = new ActionDescriptor(),
								idPlase = charIDToTypeID("Plc "),
								idIndentifer = charIDToTypeID("Idnt"),
								idNull = charIDToTypeID("null"),
								idHorizontal = charIDToTypeID("Hrzn"),
								idVertical = charIDToTypeID("Vrtc"),
								idPixel = charIDToTypeID("#Pxl"),
								idOffset = charIDToTypeID("Ofst"),
								idWidth = charIDToTypeID("Wdth"),
								idHeight = charIDToTypeID("Hght"),
								idPercent = charIDToTypeID("#Prc"),
								idLinked = charIDToTypeID("Lnk ");
							
							aDesc_01.putInteger( idIndentifer, 44 );
							aDesc_01.putPath( idNull, fimprt );
							aDesc_02.putUnitDouble( idHorizontal, idPixel, -0.000000 );
							aDesc_02.putUnitDouble( idVertical, idPixel, -0.000000 );
							
							aDesc_01.putObject( idOffset, idOffset, aDesc_02 );
							aDesc_01.putUnitDouble( idWidth, idPercent, 100 );
							aDesc_01.putUnitDouble( idHeight, idPercent, 100 );
							aDesc_01.putBoolean( idLinked, false );
							
							executeAction( idPlase, aDesc_01, DialogModes.NO );
							
							docRef.saveAs(new File(folderSave + name + '.psd'));
							
							docRef.close();
							docRef = null;
						}catch(e){
							result.push(nameFile + " -> Ошибка открытия файла\n");
						}
					}else{
						result.push(nameFile + " -> " + name + prefix + ext + " (не найден)\n");
					}
				}
				progress.value = ((i+1)*100) / length;
			}
			if(result.length){
				alert(result.join("\n"), "Возникли следующие ошибки", true)
			}else{
				alert("Объединение файлов закончено");
			}
		}else{
			alert("Не найдено файлов для обработки", "Ошибка", true);
		}
		progress.value = 0;
		btnCancel.enabled = selectFolder_01.enabled = selectFolder_02.enabled = selectFolder_03.enabled = true;
		staticTextFolder_01.text = staticTextFolder_02.text = staticTextFolder_03.text = "";
	};

dialogMain.text = "Объединять два изображение в один PSD";
dialogMain.alignChildren = "fill";

settingsPanel.orientation = 'column';
settingsPanel.alignChildren = 'fill';
settingsPanel.alignment = 'fill';
settingsPanel.borderStyle = 'sunken';

groupSettings.orientation = "column";
groupSettings.alignChildren = 'fill';
groupSettings.alignment = 'fill';

help_01.text = "Выберите директорию с исходными изображениями";

group_01.orientation = "row";
group_01.alignChildren = "left";
group_01.alignment = "fill";

staticTextFolder_01.text = "";
staticTextFolder_01.helpTip = "";
staticTextFolder_01.preferredSize = [300, 16];

selectFolder_01.text = "Выбрать...";

help_02.text = "Выберите директорию с изображениями для объединения";

group_02.orientation = "row";
group_02.alignChildren = "left";
group_02.alignment = "fill";

staticTextFolder_02.text = "";
staticTextFolder_02.helpTip = "";
staticTextFolder_02.preferredSize = [300, 16];

selectFolder_02.text = "Выбрать...";

suffixGroup.orientation = "row";
suffixGroup.alignChildren = "right";
suffixGroup.alignment = "fill";

sfxText.text = "Суффикс к имени файла:";

sfxVal.preferredSize = [300, 16];

help_03.text = "Выберите директорию для сохранения";

group_03.orientation = "row";
group_03.alignChildren = "left";
group_03.alignment = "fill";

staticTextFolder_03.text = "";
staticTextFolder_03.helpTip = "";
staticTextFolder_03.preferredSize = [300, 16];

selectFolder_03.text = "Выбрать...";

groupProgress.orientation = "column";
groupProgress.alignChildren = "fill";

groupButton.orientation = 'row';
groupButton.alignChildren = 'right';
groupButton.alignment = 'right';
btnStart.text = 'Старт';
btnCancel.text = 'Отмена';
btnStart.enabled = false;
progress.value = 0;
selectFolder_01.onClick = function(){
	selectFolderDialog(staticTextFolder_01, "Выберите директорию с исходными изображениями", 1);
};
selectFolder_02.onClick = function(){
	selectFolderDialog(staticTextFolder_02, "Выберите директорию с изображениями для объединения", 2);
};
selectFolder_03.onClick = function(){
	selectFolderDialog(staticTextFolder_03, "Выберите директорию для сохранения", 3);
};
btnStart.onClick = function(){
	processFunction();
};
main();
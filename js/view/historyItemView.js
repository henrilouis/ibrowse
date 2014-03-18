var HistoryItemView = function(container,model,item)
{
	var linkBox = $("<div class='linkBox'>");
	var link = $("<a>");

	var baseUrlBox = $("<div class='baseUrlBox'>")
	var url = item[1][i].url;
	var timeRange = item[0][i];
	var baseUrl = $('<a>').prop('href',url).prop('hostname');

	var faviconBox = $("<div class='faviconBox'>");
	var favicon = $("<img>");
		favicon.prop('src',"chrome://favicon/http://"+baseUrl);

	var removeButton = $("<span class='removeUrl glyphicon glyphicon-remove'>");

	if(item[1][i].title != "")
	{
		link.html(item[1][i].title);
	}
	else
	{
		link.html(url);
	}
	link.prop("href",url);
	link.prop("target","_blank");

	faviconBox.append(favicon);
	linkBox.append(link);
	baseUrlBox.append(baseUrl);

	this.url = url;
	this.removeButton = removeButton;
	this.timeRange = timeRange;
	this.container = container;

	container.append(faviconBox);
	container.append(linkBox);
	container.append(removeButton);
	container.append(baseUrlBox);
}
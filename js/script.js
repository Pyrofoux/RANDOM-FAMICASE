function qs(s){return document.getElementById(s)};
function dc(s){return document.createElement(s)};
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min};

var tableIndex   = [53,58,78,63,79,89,112,149,162,165,250,261];
var lastInfo;

var 
fam = qs("fam"),
load = qs("load"),
link = qs("link"),
trans = qs("trans");

fam.onload = 
function()
{
	loader(true);
};

function genUrl()
{
	var yearInput = parseInt(qs("year").value);
		
	var yearIndex;
	if(yearInput < 0)
	{
		yearIndex = rand(0,tableIndex.length-1); // Get a random year, or a fixed one;
	}
	else
	{
		yearIndex = yearInput;
	}
	
	var imgIndex = rand(1,tableIndex[yearIndex]);
	var yearUrl  = (yearIndex+8).toString();
	
	if(yearUrl.length < 2)
	{
		yearUrl = "0"+yearUrl;
	}
	
	var imgUrl, pageUrl;
	
	var year = yearIndex+2008;
	
	// Calculating the image and page url, see note on bottom
	if(year < 2017)
	{
		imgUrl  = imgIndex.toString();
		pageUrl = imgIndex.toString(); 
	}
	else if(year == 2017)
	{
		imgUrl = imgIndex.toString();
		while(imgUrl.length < 3)
		{
			imgUrl = "0"+imgUrl;
		}
		
		pageUrl = imgIndex.toString();
		while(pageUrl.length < 3)
		{
			pageUrl = "0"+pageUrl;
		}
		
	}
	else if(year > 2017)
	{
		imgUrl = imgIndex.toString();
		while(imgUrl.length < 2)
		{
			imgUrl = "0"+imgUrl;
		}
		imgUrl += "_sample";
		
		pageUrl = imgIndex.toString();
		while(pageUrl.length < 3)
		{
			pageUrl = "0"+pageUrl;
		}
		
		
	}
	
	return {
				imgUrl :"http://famicase.com/"+yearUrl+"/softs/"+imgUrl+".jpg",
				pageUrl:"http://famicase.com/"+yearUrl+"/softs/"+pageUrl+".html",
				year:year,
				index:imgIndex
			};
}

function change(urls)
{
	loader(false);
	fam.src = urls.imgUrl;
	link.href = urls.pageUrl;
	trans.href = "http://www.microsofttranslator.com/bv.aspx?from=&to=en&a="+encodeURI(urls.pageUrl);
	
	lastInfo = urls;
	
}

function loader(show)
{
	if(!show)
	{
		fam.style.display = "none";
		load.style.display = "inline-block";
	}
	else
	{
		fam.style.display = "inline-block";
		load.style.display = "none";
	}
}



function randomize(data)
{
	
	var rand = genUrl();
	change(rand);
}

function save()
{
	var list = getList();
	
	//Check if not already in list
	
	for(var i in list)
	{
		if(list[i].imgUrl == lastInfo.imgUrl)
		{
			return false;
		}
	}
	
	list.unshift(lastInfo);
	setList(list);
	
	refreshList();
}

function removeFromList(id)
{
	var list = getList();
	
	list.splice(id,1);
	setList(list);
	refreshList();
}

function getList()
{
	var list = Lockr.get('saved-list');
	
	if(typeof list != "object")
	{
		return [];
	}
	
	return list;
}

function setList(save)
{
	Lockr.set('saved-list', save);
}

function refreshList()
{
	var list = getList();
	
	var parent = qs("list");
	
	parent.innerHTML = "";
	list.map(function(element, id)
	{
		var li = dc("li");
		
		
		var label = dc("span");
		label.innerHTML = `#${element.index} (${element.year})`;
		label.className = "list-element";
		// label.dataId = id;
		label.onclick = function()
		{
			change(getList()[id]);
		}
		
		 var cross = dc("span");
		 cross.innerHTML = " ❌"
		 // cross.dataId = id;
		 cross.className = "list-element";
		 cross.onclick = function()
		 {
			removeFromList(id);
		 }
		 
		 parent.appendChild(li);
		 li.appendChild(label);
		 li.appendChild(cross);
	});
	
}

randomize();
refreshList();

/*
	RULES :
	
	Years always have 2 digits : 08, 09, 10, 11 ...
	
	Index of images are calculated diffrently for each year :
	- 2008 to 2016 	: 1		 	 2 		   3		 12		   123 
	- 2017			: 001		 002	   003		 012       123
	- 2018 to 2019	: 01_sample  02_sample 03_sample 12_sample 123_sample
	
	Index of html pages too :
	- 2008 to 2016 	: 01		 02 	   03		 12		   123
	- 2017 to 2019	: 001		 002	   003		 012       123
	
*/
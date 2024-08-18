function qs(s){return document.getElementById(s)};
function dc(s){return document.createElement(s)};
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min};

var tableIndex   = [23,30,46,53,58,78,63,79,89,112,149,162,165,250,261,270,253,253,252,250];
var lastInfo;
var startingYear = 2005;

var
fam = qs("fam"),	 			//case image
load = qs("load"), 		 //loading gif
link = qs("source_link"), 		//link to original
trans = qs("translation_link"); //link to translation

fam.onload =
function()
{
	loader(true);
};


// Generate URLS to image file and official html page
function genUrl()
{
	var yearInput = parseInt(qs("year").value);

	var yearIndex;

	 // Get a random year, or a fixed one;
	if(yearInput == -1)
	{
		yearIndex = rand(0,tableIndex.length-1);
	}
	else if(yearInput == -2)
	{
		// Avoiding first 3 years small images
		yearIndex = rand(3,tableIndex.length-1);
	}
	else
	{
		//yearIndex = 0 to ...14
		//yearUrl = 05 to ...20
		yearIndex = yearInput;
	}

	var imgIndex = rand(1,tableIndex[yearIndex]);
	var yearUrl  = (yearIndex+startingYear-2000).toString();

	yearUrl = minimumDigits(yearUrl,2);

	var imgUrl, pageUrl;

	var year = yearIndex+startingYear;

// Calculating the image and page url, see note on bottom

//Creating hotlinks for images >= 2008
if(year >= 2008)
{
		if(year < 2017)
		{
			imgUrl  = imgIndex.toString();

			pageUrl = imgIndex.toString();
			pageUrl = minimumDigits(pageUrl, 2);
		}
		else if(year == 2017)
		{
			imgUrl = imgIndex.toString();
			imgUrl = minimumDigits(imgUrl, 3);

			pageUrl = imgIndex.toString();
			pageUrl = minimumDigits(pageUrl, 3);

		}
		else if(year > 2017 && year <= 2018)
		{
			imgUrl = imgIndex.toString();
			imgUrl = minimumDigits(imgUrl, 2);
			imgUrl += "_sample";

			pageUrl = imgIndex.toString();
			pageUrl = minimumDigits(pageUrl, 3);

		}
		else if(year >= 2019 && year <= 2020)
		{
			imgUrl = imgIndex.toString();
			imgUrl = minimumDigits(imgUrl, 3);
			imgUrl += "_sample";

			pageUrl = imgIndex.toString();
			pageUrl = minimumDigits(pageUrl, 3);

		}
		else if(year >= 2021)
		{
			imgUrl = imgIndex.toString();
			imgUrl = minimumDigits(imgUrl, 3);

			pageUrl = imgIndex.toString();
			pageUrl = minimumDigits(pageUrl, 3);
		}

		return {
					imgUrl :"http://famicase.com/"+yearUrl+"/softs/"+imgUrl+".jpg",
					pageUrl:"http://famicase.com/"+yearUrl+"/softs/"+pageUrl+".html",
					year:year,
					index:imgIndex
				};
	}
	else // local link for images from 2005 to 2007
	{

			imgUrl = imgIndex.toString();
			imgUrl = "("+imgUrl+")";

			return {
						imgUrl :"./img/"+year+"/"+imgUrl+".png",
						pageUrl:null,
						year:year,
						index:imgIndex
					};

	}
}

// Change visible links URLS
function change(urls)
{
	loader(false);

	fam.src = urls.imgUrl;

	if(urls.pageUrl === null)
	{ // No official page URL (for 2005 to 2007)

		link.href = "";
		trans.href = "";
		enableLinks(false);
	}
	else
	{
		link.href = urls.pageUrl;

		// older Bing translation
		//trans.href = "http://www.microsofttranslator.com/bv.aspx?from=&to=en&a="+encodeURI(urls.pageUrl);

		//current Google translation
		trans.href = link.href.replace("http://","https://").replace("famicase.com","famicase-com.translate.goog")+"?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=fr&_x_tr_pto=wapp";

		enableLinks(true)
	}

	lastInfo = urls;

}

// Show or hide loader gif
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

function enableLinks(enable)
{
	if(enable)
	{
		link.className = "";
		trans.className = "";
	}
	else
	{
		link.className = "disabledLink";
		trans.className = "disabledLink";
	}
}


// Randomize button event
function randomize(data)
{
	var randURL = genUrl();
	change(randURL);
}

//
function minimumDigits(_value, digits)
{
	value= _value+""

	while(value.length < digits)
	{
		value = "0"+value;
	}
	return value
}



// Save list manipulation functions
function save()
{
	var list = getList();

	//Check if saved item is not already in list
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


// Key press event
document.body.onkeyup = function(e){
  if (e.key == " " || e.code == "Space" || e.keyCode == 32 || e.key == "r"){
    randomize();
	}
}



randomize();
refreshList();

/*
	RULES :

	Years always have 2 digits : 08, 09, 10, 11 ...

	Index of images are calculated diffrently for each year :
	- 2005 to 2008	: stored by art name
	- 2008 to 2016 	: 1		 	 	2 		   	3		 	12		   		123
	- 2017			: 001		 	002	   		003		 	012       		123
	- 2018			: 01_sample 	02_sample 	03_sample 	12_sample 		123_sample
	- 2019 to 2020	: 01_sample   	02_sample 	03_sample 	012_sample		123_sample
	- 2021 to 2023	: 001		 	002	   		003		 	012       		123

	Index of html pages too :
	- 2008 to 2016 	: 01		 02 	   03		 	12		  123
	- 2017 to 2024	: 001		 002	   003		 	012       123

*/

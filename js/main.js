//self executing anonymous function
(function () {
	"use strict";
	console.log("SEAF has fired");

	////// variables ////// 
	var filterSliders = document.querySelectorAll(".slider");
	var img = document.querySelector("#filterImage");
	var imgUploader = document.querySelector("#imgUploader");
	var filterVals = document.querySelectorAll(".filterSection p");
	var filterCurrVals = [];

	// units maps filters with non-default unit (%) to its respective unit
	var units = {};
	units["blur"] = "px";
	units["hue-rotate"] = "deg";

	// filterStyles holds filter style updates
	var filterStyles = [];

	// filterDefaults maps filters to (non-zero) default values, in accordance to mdn filter documentation
	var filterDefaults = {};
	filterDefaults["brightness"] = 100;
	filterDefaults["contrast"] = 100;
	filterDefaults["opacity"] = 100;
	filterDefaults["saturate"] = 100;

	////// functions ////// 
	function applyFilters(e) {
		var val = e.currentTarget.value;
		var filter = e.currentTarget.id;
		var currFilterStyle = "";
		img.style["filter"] = "";
		filterCurrVals[filter] = val;

		// set value for just updated filter, 
		// while maintaining previous filters (via for loop and filterStyles array)
		for (var i = 0; i < filterSliders.length; i++) {
			var currFilter = filterSliders[i].id;
			var currFilterVal = filterCurrVals[currFilter];

			// set needed unit for current filter
			var unit = getUnit(currFilter);

			// if filter used before, update
			if (!isUndefined(currFilterVal)) {
				img.style["filter"] += currFilter + "(" + currFilterVal + unit + ")";
				filterStyles[currFilter] = currFilter + "(" + currFilterVal + unit + ")";

				// update filter value displayed
				filterVals[i].textContent = currFilterVal + " " + unit;
			}

			// add other previously applied filters
			if (!isUndefined(filterStyles[currFilter]))
				currFilterStyle += " " + filterStyles[currFilter];
			img.style["filter"] += currFilterStyle[currFilter];
		}
	}

	function uploadImg(e) {
		var userImg = this.files[0];

		// if image exists, set up file reader and load event (that updates img attributes)
		if (!isUndefined(userImg)) {
			var imgReader = new FileReader();
			imgReader.addEventListener("load", function (e) {
				img.setAttribute("src", e.target.result);
				img.setAttribute("alt", "User-uploaded image");
			});

			// read file to trigger load event
			imgReader.readAsDataURL(userImg);
		}
	}

	function isUndefined(i) { return i === undefined; }
	function defaultOrZero(val) { return isUndefined(val) ? 0 : val; }

	// returns appropriate unit for current filter
	function getUnit(filter) {
		var unit = units[filter];
		return isUndefined(unit) ? "%" : unit;
	}

	// SEAF to set slider defaults
	(function resetFilters() {
		// set sliders and values displayed to their respective default values
		for (var i = 0; i < filterVals.length; i++) {
			// filterSliders[i].id returns filter name for ith filter
			var currFilter = filterSliders[i].id;
			var currDefault = filterDefaults[currFilter];

			// set defaults to 0 if not defined in currDefault
			filterVals[i].textContent = defaultOrZero(currDefault) + " " + getUnit(currFilter);
			filterSliders[i].value = defaultOrZero(currDefault);
		}
	})();

	////// listeners ////// 	
	for (var i = 0; i < filterSliders.length; i++) {
		filterSliders[i].addEventListener("change", applyFilters, false);
	}
	imgUploader.addEventListener("change", uploadImg, false);
})();
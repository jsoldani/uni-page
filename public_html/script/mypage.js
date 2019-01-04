$(document).ready(function () {
	// Display active tab from hash 
	if(!window.location.hash) window.location.hash = "#home";
	$('[href="' + window.location.hash + '"]').tab('show');

	// Fill tabs with data
	$.getJSON("resources/publications.json", (data) => { loadPublicationList(data) });
	$.getJSON("resources/program-committees.json", (data) => { loadProgramCommitteesList(data) });
	$.getJSON("resources/research-projects.json", (data) => { loadProjectList(data) });
	$.getJSON("resources/students-theses.json", (data) => { loadStudentsThesesList(data) });
	$.getJSON("resources/teaching.json", (data) => { loadTeachingList(data) });
});

/*
 * This function fills the list of publications.
 * [Usage: body.onload]
 */
function loadPublicationList(publications) {
    var pubList = $('#publication-list')[0];
	var prevYear = -1;
    
	// For each type in which a paper has been published
    $.each(publications, function (i, pub) {
        // If year changes, add new year entry
		if(pub.year && pub.year != prevYear) {
			prevYear = pub.year;
			var newYear = document.createElement('div');
			newYear.className = "list-group-item disabled";
			newYear.innerHTML = "<b>" + pub.year + "</b>";
			pubList.appendChild(newYear);
		}
		
		// Creating publication entry
        var p = document.createElement('div');
		p.className = "list-group-item";

        // Adding "authors"
        p.innerHTML += " " + pub.author + ". ";

		p.innerHTML += "<br>"
			
        // Adding "title"
        var title = document.createElement('span');
        if (pub.url) {
			title = document.createElement('a');
            title.href = pub.url;
            title.target = "_blank";
        }
		title.innerHTML = " <b>" + pub.title + ".</b>";
		p.appendChild(title);

		pubList.appendChild(p);
		
		// If a paper is submitted, it is displayed separately
		// (with only authors and title)
		if (pub.status == "Submitted") return;
		
		
		p.appendChild(document.createElement("br"));
		
		// Adding "where" and "year"
		if (pub.where) p.innerHTML += pub.where;
		if (pub.type == "Journal" && pub.year) p.innerHTML += ", " + pub.year;
		
		// Adding space
		p.innerHTML += "&nbsp;&nbsp;";

		// Creating label for publication type
		var typeLabel = document.createElement('span');
		typeLabel.textContent = pub.type;
		switch (pub.type) {
			case "Journal":
				typeLabel.className = "label label-danger";			
				break;
			case "In proceedings":
				typeLabel.className = "label label-primary";
				break;
			default:
				typeLabel.className = "label label-default";
				break;
		}
		p.appendChild(typeLabel);
		
		// Adding "status"
		if(pub.status) {
			var stat = document.createElement('span');
			stat.textContent = pub.status;
			stat.className = "label label-info";
			p.appendChild(stat);
		}
		// Adding "bestpaper"
		if (pub.bestpaper) p.innerHTML += " <span class='label label-success'>Best paper 🏆</span>"

		
		p.appendChild(document.createElement("br"));
		
		// Adding "bib"
		if (pub.bib) {
			var bib = document.createElement("a");
			var bibAddr = "resources/bibtex/" + pub.bib;
			bib.setAttribute("style","color:gray");
			bib.setAttribute("href",bibAddr);
			bib.setAttribute("target","_blank");
			bib.innerHTML = "[BibTex]";
			p.appendChild(bib);
			p.innerHTML += "&nbsp;&nbsp;"
		}
				
		// Adding "preprint"
		if (pub.preprint) {
			var preprint = document.createElement("a");
			var preprintAddr = "resources/preprints/" + pub.preprint;
			preprint.setAttribute("style","color:gray");
			preprint.setAttribute("href",preprintAddr);
			preprint.setAttribute("target","_blank");
			preprint.innerHTML = "[Preprint version]";
			p.appendChild(preprint);
			p.innerHTML += "&nbsp;&nbsp;"
		}
    });
}

/*
 * This function fills the list of program committee memberships.
 * [Usage: body.onload]
 */
function loadProgramCommitteesList(programCommittees) {
    var pcList = $('#pc-list')[0];
	
	// Forthcoming events
    if (programCommittees.ongoing.length > 0) {
        $.each(programCommittees.ongoing, function (i) {
			// Creating row for event
			var e = document.createElement("div");
			e.className = "list-group-item";
			pcList.appendChild(e);
			
			// Adding role and fullname
			e.innerHTML += " <b>" + this.role + "</b> @ " + this.fullname;

            // Adding shortname
            e.innerHTML += " ("
            var eShortname = document.createElement("a");
            eShortname.innerHTML = "<b>" + this.shortname + "</b>";
            eShortname.href = this.url;
            eShortname.target = "_blank";
            e.appendChild(eShortname);
            e.innerHTML += ")"

            // Adding where, when
            e.innerHTML += ", " + this.where + ", " + this.when + ".&nbsp;&nbsp;";
			
			// Adding "forthcoming" label
            var forthLabel = document.createElement('span');
			forthLabel.textContent = "Forthcoming";
			forthLabel.className = "label label-success";			
			e.appendChild(forthLabel);
        });

    }

	// Past events
    if (programCommittees.past.length > 0) {
        // Creating past PCs entry
        var past = document.createElement("div");
        past.className = "list-group-item";
        pcList.appendChild(past);
		
		var role = null;
		var roleSpan;
        // Loading past PCs description
        $.each(programCommittees.past, function (i) {
			if(this.role != role) {
				if(role != null) past.innerHTML += "<br>";
				role = this.role;
				roleSpan = document.createElement("span");
				roleSpan.innerHTML = this.role + " @ " + this.shortname;
				past.appendChild(roleSpan);
			}				
			else roleSpan.innerHTML += ", " + this.shortname;
        });
    }
}

/*
 * This function fills the list of research projects.
 * [Usage: body.onload]
 */
function loadProjectList(projects) {
	var projectsDiv = $("#projects-list")[0];
    $.each(projects, function (i) {
        // Creating project entry
        var proj = document.createElement("div");
        proj.id = "project-" + this.id;
        proj.className = "list-group-item";
        projectsDiv.appendChild(proj);

        // Creating project description
        var p = document.createElement('span');
        proj.appendChild(p);

        // Adding project title/subtitle
        var title = document.createElement("a");
        if(this.home) title.href = this.home;
        title.target = "_blank";
        var completeTitle = this.title;
        if (this.subtitle) completeTitle += ": " + this.subtitle;
        title.innerHTML = " <b>" + completeTitle + "</b>.";
        p.appendChild(title);
		
		p.appendChild(document.createElement("br"));

        // Adding funder, grant
        p.innerHTML += "Funded by the " + this.funder + ", under grant agreement: " + this.grant + "."
		
		p.appendChild(document.createElement("br"));
		
		// Adding period
        p.innerHTML += " Duration: " + this.period + ".";


    });
}

/*
 * This function fills the list of supervised theses.
 * [Usage: body.onload]
 */
function loadStudentsThesesList(studentsTheses) {
    var studentsThesesTable = $('#students-theses-list')[0];
    $.each(studentsTheses, function (i, st) {
        var stRow = document.createElement('tr');

        // Adding "candidate"
        var candidate = document.createElement('td');
        candidate.textContent = st.candidate;
        stRow.appendChild(candidate);

        // Adding "title"
        var title = document.createElement('td');
        var titleLabel = document.createElement('span')
        titleLabel.innerHTML = " <b>" + st.title + "</b>&nbsp;";
		title.appendChild(titleLabel);
        if (st.url) {
            titleLink = document.createElement('a');
			titleLink.className = "label label-default";
			titleLink.innerHTML = "PDF";
            titleLink.href = st.url;
            titleLink.target = "_blank";
            titleLink.style = 'text-decoration:none';
			title.appendChild(titleLink)
        }
        stRow.appendChild(title);

        // Adding "programme"
        var programme = document.createElement('td');
        programme.textContent = st.programme + ", " + st.university;
        stRow.appendChild(programme);

        // Adding "date"
        var date = document.createElement('td');
        if (st.date) date.textContent = st.date;
        stRow.appendChild(date);

        studentsThesesTable.appendChild(stRow)
    });
}

/*
 * This function fills the list of teaching activities.
 * [Usage: body.onload]
 */
function loadTeachingList(teaching) {
    var teachingTable = $('#teaching-activities-list')[0];
    $.each(teaching, function (i, activity) {
        var activityRow = document.createElement('tr');

        // Adding "ay"
        var ay = document.createElement('td');
        ay.textContent = activity.ay;
        activityRow.appendChild(ay);

        // Adding "role"
		var role = document.createElement('td');
		role.textContent = activity.role;
		activityRow.appendChild(role);
		
		// Adding "course" and "programme"
        var course = document.createElement('td');
        course.innerHTML = activity.course + ", " + activity.degree + ", " + activity.university;
        activityRow.appendChild(course);

        teachingTable.appendChild(activityRow);
    });
}

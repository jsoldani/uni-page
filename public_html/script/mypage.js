$(document).ready(function () {
	// Change this URL to create your own "uni-page"
	repoURL = "https://raw.githubusercontent.com/jacopogiallo/uni-page/";

	$.getJSON(repoURL + "master/public_html/resources/publications.json", (data) => { loadPublicationList(data) });
  $.getJSON(repoURL + "master/public_html/resources/program-committees.json", (data) => { loadProgramCommitteesList(data) });
  $.getJSON(repoURL + "master/public_html/resources/research-projects.json", (data) => { loadProjectList(data) });
  $.getJSON(repoURL + "master/public_html/resources/students-theses.json", (data) => { loadStudentsThesesList(data) });
  $.getJSON(repoURL + "master/public_html/resources/teaching.json", (data) => { loadTeachingList(data) });

});

/*
 * This function fills the list of publications.
 * [Usage: body.onload]
 */
function loadPublicationList(publications) {
    var pubList = $('#publication-list')[0];

    // For each year in which a paper has been published
    $.each(publications, function (i, pubYear) {
        var year = pubYear[0];
        var pubListYear = document.createElement('div');
        pubListYear.id = "research-" + year;
        pubListYear.className = "list-group-item";
        pubListYear.innerHTML = "<h4 class='list-group-item-heading'><b>" + year + "</b></h4>";
        pubList.appendChild(pubListYear);

        // For each published paper in a given year
        $.each(pubYear[1], function (j, pub) {
            // Creating publication entry
            var p = document.createElement('p');
            pubListYear.appendChild(p);

            // Creating label for publication type
            var typeLabel = document.createElement('span');

            if (year == "Ongoing") {
                if (pub.accepted) typeLabel.textContent = "Accepted";
                else if (pub.inpress) typeLabel.textContent = "In press";
                else typeLabel.textContent = "Submitted";
                typeLabel.className = "label label-ongoing";
                p.className = "ongoing";
            }
            else {
                typeLabel.textContent = pub.type;
                switch (pub.type) {
                    case "Book":
                        typeLabel.className = "label label-warning";
                        p.className = "book";
                        break;
                    case "Journal":
                        typeLabel.className = "label label-danger";
                        p.className = "journal";
                        break;
                    case "Conference":
                        typeLabel.className = "label label-primary";
                        p.className = "conference";
                        break;
                    case "Workshop":
                        typeLabel.className = "label label-info";
                        p.className = "workshop";
                        break;
                    default:
                        typeLabel.className = "label label-default";
                        p.className = "techrep";
                        break;
                }
            }
            p.appendChild(typeLabel);

            // Adding "bestpaper"
            if (pub.bestpaper) p.innerHTML += " <span class='label label-success'>Best paper 🏆</span>"

            // Adding "authors"
            p.innerHTML += " " + pub.author + ". ";

            // Adding "title"
            var title = document.createElement('span');
            if (pub.url) {
                title = document.createElement('a');
                title.href = pub.url;
                title.target = "_blank";
            }
            title.innerHTML = " <b>" + pub.title + ".</b>";
            p.appendChild(title);

            // Adding "where"
            if (pub.where) p.innerHTML += " " + pub.where + ".";

            // Completing description with indexing info
            if (pub.notDBLP) p.innerHTML += " <em class='text-info'>[Not indexed on DBLP]</em>";
            if (pub.notGoogleScholar) p.innerHTML += " <em class='text-info'>[Not indexed on Google Scholar]</em>";
        });
    });
}

/*
 * This function fills the list of program committee memberships.
 * [Usage: body.onload]
 */
function loadProgramCommitteesList(programCommittees) {
    var pcList = $('#program-committee-list')[0];

    if (programCommittees.ongoing.length > 0) {
        // Creating ongoing PCs entry
        var ongoing = document.createElement("div");
        ongoing.id = "ongoing-pc-list";
        ongoing.className = "list-group-item";
        ongoing.innerHTML = "<h4 class='list-group-item-heading'><b>Forthcoming events</b></h4>";
        pcList.appendChild(ongoing);

        // Loading ongoing PCs description
        $.each(programCommittees.ongoing, function (i) {
            // Creating PC description
            var pc = document.createElement("p");
            ongoing.appendChild(pc);

            // Adding project label
            var pcLabel = document.createElement("span");
            pcLabel.className = "label label-default";
            pcLabel.textContent = this.type;
            pc.appendChild(pcLabel);

            // Adding fullname
            pc.innerHTML += " " + this.fullname;

            // Adding shortname
            pc.innerHTML += " ("
            var pcShortname = document.createElement("a");
            pcShortname.innerHTML = "<b>" + this.shortname + "</b>";
            pcShortname.href = this.url;
            pcShortname.target = "_blank";
            pc.appendChild(pcShortname);
            pc.innerHTML += ")"

            // Adding where, when
            pc.innerHTML += ", " + this.where + ", " + this.when + ".";
        });

    }

    if (programCommittees.past.length > 0) {
        // Creating past PCs entry
        var past = document.createElement("div");
        past.id = "ongoing-pc-list";
        past.className = "list-group-item";
        past.innerHTML = "<h4 class='list-group-item-heading'><b>Past events</b></h4>";
        pcList.appendChild(past);

        // Loading past PCs description
        $.each(programCommittees.past, function (i) {
            // Adding shortname only
            var pastPC = document.createElement("div");
						pastPC.setAttribute("style", "display:inline");
						if (this.url) {
							var pastPCname = document.createElement("a");
	            pastPCname.innerHTML = "<b>" + this.shortname + "</b>";
							pastPCname.href = this.url;
							pastPCname.target = "_blank";
							pastPC.innerHTML = "["; // + this.role + " @ "
							pastPC.appendChild(pastPCname);
							pastPC.innerHTML += "]"
            }
						else {
							pastPC.innerHTML = "[<b>" + this.shortname + "</b>]"
						}
						past.appendChild(pastPC)
            past.innerHTML += " "
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
        var p = document.createElement('p');
        proj.appendChild(p);

        // Adding project label
        var pLabel = document.createElement('span');
        pLabel.className = "label label-default";
        pLabel.textContent = this.type.toUpperCase();
        p.appendChild(pLabel);

        // Adding project title/subtitle
        var title = document.createElement("a");
        title.href = this.home;
        title.target = "_blank";
        var completeTitle = this.title;
        if (this.subtitle) completeTitle += ": " + this.subtitle;
        title.innerHTML = " <b>" + completeTitle + "</b>.";
        p.appendChild(title);

        // Adding funder, grant, period
        p.innerHTML += " Funded by: <b>" + this.funder + "</b>";
        p.innerHTML += ", grant agreement: <b>" + this.grant + "</b>."
        p.innerHTML += " Duration: <b>" + this.period + "</b>.";


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
        if (st.url) {
            titleLabel = document.createElement('a');
            titleLabel.href = st.url;
            titleLabel.target = "_blank";
            titleLabel.style = 'text-decoration:none';
        }
        titleLabel.innerHTML = " <b>" + st.title + "</b>";
        title.appendChild(titleLabel)
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

        // Adding "role", "course", "programme"
        var act = document.createElement('td');
        act.textContent = activity.role + " @ " + activity.course + ", " + activity.degree + ", " + activity.university;
        activityRow.appendChild(act);

        teachingTable.appendChild(activityRow);
    });
}

$(document).ready(function () {
    loadPublicationList();
    loadProgramCommitteesList();
    loadProjectList();
    loadTeachingList();
    loadStudentsThesesList();
});

/*
 * This function fills the list of publications, by exploiting
 * the "publications" var in "publications.js"
 * [Usage: body.onlo
 */
function loadPublicationList() {
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
 * This function fills the list of program committee memberships,
 * by exploiting the "programCommittees" var in "program-committees.js"
 * [Usage: body.onload]
 */
function loadProgramCommitteesList() {
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
            var pastPC = document.createElement("a");
            pastPC.innerHTML = "<b>" + this.shortname + "</b>";
            pastPC.href = this.url;
            pastPC.target = "_blank";
            past.appendChild(pastPC);
            past.innerHTML += " "
        });
    }
}

/*
 * This function fills the list of research projects, by exploiting
 * the "projects" var in "research-projects.js"
 * [Usage: body.onload]
 */
function loadProjectList() {
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
 * This function fills the list of teaching activities, by exploiting
 * the "teaching" var in "teaching.js"
 * [Usage: body.onload]
 */
function loadTeachingList() {
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

function loadStudentsThesesList() {
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

        // Adding "mark"
        var mark = document.createElement('td');
        if (st.mark) mark.textContent = st.mark;
        stRow.appendChild(mark);

        studentsThesesTable.appendChild(stRow)
    });
}

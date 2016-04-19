$(function () {
    $(".accordion")
            .accordion({
                heightStyle: "content",
                header: "> div > h3"
            })
            .sortable({
                axis: "y",
                handle: "h3",
                stop: function (event, ui) {
                    ui.item.children("h3").triggerHandler("focusout");
                    $(this).accordion("refresh");
                }
            });
});
//$('#taskList').sortable();

$(document).ready(function () {
    $("#taskInput").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#plus").click();
        }
    })
});

var tasks = [],
        completedTasks = [];

if (JSON.parse(localStorage.getItem('taskList')))
    tasks = JSON.parse(localStorage.getItem('taskList'));
else
    localStorage.setItem("taskList", JSON.stringify(tasks));

updateListView();


/////// ADD NEW TASK IN LIST TASKS, UPDATING HTML, SAVING IN LOCAL STORAGE ////////
function addToList(task) {
    tasks.push({
        name: task,
        done: false
    });

    updateListView();
    saveLocalList();
}

/////// DELETE FROM LIST TASKS, UPDATING HTML, SAVING IN LOCAL STORAGE /////
function deleteFromList(e) {
    tasks.splice(e.target.parentElement.id, 1);    
    saveLocalList();
    updateListView();
}

/////// "PLUS" CLICK EVENT, CALL ADDTOLIST FUNCTION //////
$("#plus").click(function () {
    var itemValue = $('.new-todo').val();

    if (itemValue !== '') {
        addToList(itemValue);
    }

    $('.new-todo').val(null);
    $('.new-todo').focus();
});

/////// "REMOVE" CLICK EVENT, CALL "DELETEFROMLIST" FUNCTION ///////
$("#remove").click(function () {
    deleteFromList();
});


/////// UPDATING OF HTML //////
function updateListView() {
    var ul = document.getElementById('taskList');
    ul.innerHTML = '';

    tasks.forEach(function (task) {
        var li = document.createElement("li");
        li.className = "task";
        li.id = tasks.indexOf( task );

        var ch = document.createElement("input");
        ch.className = "toggle";
        ch.type = "checkbox";
        ch.onclick = toggleChecked;
        ch.id = tasks.indexOf(task);

        var label = document.createElement("label");
        label.className = "taskText";
        label.textContent = task.name;
        
        var span = document.createElement("span");
        span.className = "remove glyphicon glyphicon-remove";
        span.onclick = deleteFromList;

        li.appendChild(ch);
        li.appendChild(label);
        li.appendChild(span);

        ul.insertBefore(li, ul.firstChild);
		$('.new-todo').focus();
    });
}

////// SAVING IN LOCAL STORAGE //////
function saveLocalList() {
    localStorage.setItem("taskList", JSON.stringify(tasks));
}

function toggleChecked() {
    if ($(this).is(':checked')) {
        $(this).siblings('label').css('text-decoration', 'line-through');
    }
    else {
        $(this).siblings('label').css('text-decoration', 'none');
    }
    $('.new-todo').focus();
}

$(".toggle").on('click', toggleChecked);
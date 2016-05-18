var currentId = -1;
var completedTasks = [];
var tasks = [];
var countCompletedTasks = 0;
var countTasks = 0;

$(document).ready(function () {
    $("#taskInput").keyup(function (event) {
        if (event.keyCode == 13 && currentId == -1) {
            countTasks++;
            $("#plus").click();
        }

        if (event.keyCode == 13 && currentId > -1) {
            tasks[currentId].name = document.getElementById("taskInput").value;
            updateListView();
            currentId = -1;
        }
    })
});


$(document).ready(function () {
    var backgroundMap = new Map();
    backgroundMap.set('cats/1.jpg', '#494b73');
    backgroundMap.set('cats/2.jpg', '#5c65ad');
    backgroundMap.set('cats/3.jpg', '#b3d0db');
    backgroundMap.set('cats/4.jpg', '#9fbdd2');
    backgroundMap.set('cats/5.jpg', '#a9cbdf');
    backgroundMap.set('cats/6.jpg', '#a2a1fb');

    var min = 1;
    var max = 6;

    var num = Math.random() * (max - min) + min;
    num = 'cats/' + Math.round(num) + '.jpg';

    document.getElementById('listWrapper').style.backgroundImage = 'url(' + num + ')';
    document.getElementById('content').style.backgroundColor = backgroundMap.get(num);
});


/*$(document).ready(function () {
 var min = 1;
 var max = 7;
 
 var num = Math.random() * (max - min) + min;
 num = 'cars/' + Math.round(num) + '.jpg';
 
 document.getElementById('listWrapper').style.backgroundImage = 'url('+num+')';
 document.getElementById('content').style.backgroundColor = '#343433';
 });*/



function setTasks() {
    if (document.getElementById('json').value != '') {
        tasks = JSON.parse(document.getElementById('json').value);
        updateListView();
        updateCompletedListArray();
    }
}

window.onload = function () {
    document.getElementById('plus').onclick = saveTask;
    document.getElementById('deleteCompletedBtn').onclick = deleteCompleted;
    document.getElementById('clearTasksBtn').onclick = deleteAll;
}

/////// ADD NEW TASK IN LIST TASKS, UPDATING HTML, SAVING IN LOCAL STORAGE ////////
function addToList(task) {

    tasks.push({
        name: task,
        done: false
    });

    updateListView();
}

/////// DELETE FROM LIST TASKS, UPDATING HTML /////
function deleteFromList(e) {
    tasks.splice(e.target.parentElement.id, 1);

    updateListView();
    updateCompletedListArray();
}

function editTask(e) {
    currentId = e.target.parentElement.id;
    document.getElementById("taskInput").value = e.target.parentElement.innerText;
    $('.new-todo').focus();
}

function updateCompletedListArray() {
    completedTasks = [];

    tasks.forEach(function (task) {
        if (task.done)
            completedTasks.push(tasks.indexOf(task) + '');
    });
}


/////// "PLUS" CLICK EVENT, CALL ADDTOLIST FUNCTION //////
function saveTask() {

    if (currentId > -1) {
        tasks[currentId].name = document.getElementById("taskInput").value;
        updateListView();
        currentId = -1;
    }

    else {

        var itemValue = $('.new-todo').val();

        if (itemValue !== '') {

            addToList(itemValue);
        }

        $('.new-todo').val(null);
        $('.new-todo').focus();
    }
}

/////// "REMOVE" CLICK EVENT, CALL "DELETEFROMLIST" FUNCTION ///////
$("#remove").click(function () {
    deleteFromList();
});


/////// UPDATING OF HTML //////
function updateListView() {
    var ul = document.getElementById('taskList');
    ul.innerHTML = '';

    $('.new-todo').val(null);

    countTasks = 0;
    countCompletedTasks = 0;
    currentId = -1;

    if (tasks.length != 0) {
        tasks.forEach(function (task) {

            countTasks++;

            var li = document.createElement("li");
            li.className = "task";
            li.id = tasks.indexOf(task);


            var label = document.createElement("label");
            label.className = "taskText";
            label.textContent = task.name;
            label.style.width = '70%';

            var ch = document.createElement("input");
            ch.className = "toggle";
            ch.type = "checkbox";
            ch.style.width = '10%';
            ch.checked = task.done;
            ch.onclick = toggleChecked;
            ch.id = tasks.indexOf(task);

            if (task.done) {
                label.style.textDecoration = 'line-through';
                countCompletedTasks++;
            }

            var spanRemove = document.createElement("span");
            spanRemove.className = "remove glyphicon glyphicon-remove";
            spanRemove.onclick = deleteFromList;
            spanRemove.style.width = '10%';

            var spanEdit = document.createElement("span");
            spanEdit.className = "edit glyphicon glyphicon-pencil";
            spanEdit.onclick = editTask;
            spanEdit.style.width = '10%';

            li.appendChild(ch);
            li.appendChild(label);
            li.appendChild(spanEdit);
            li.appendChild(spanRemove);

            ul.insertBefore(li, ul.firstChild);
            $('.new-todo').focus();

            document.getElementById('json').value = JSON.stringify(tasks);

            document.getElementById('count').innerHTML = countCompletedTasks + '/' + countTasks;
        });
    } else {
        document.getElementById('json').value = '';
    }
    saveData();
}

function toggleChecked(e) {

    var checkStatus = e.target.checked,
            task = e.target.parentElement,
            taskId = task.id,
            removed = false;

    tasks[taskId].done = checkStatus;

    if (completedTasks.length === 0) {
        completedTasks.push(taskId);
    }

    else {
        completedTasks.forEach(function (index) {
            if (taskId === index) {
                completedTasks.splice(completedTasks.indexOf(index), 1);
                removed = true;
            }
        });

        if (!removed) {
            completedTasks.push(taskId);
            completedTasks.sort();
        }
    }

    document.getElementById('json').value = JSON.stringify(tasks);

    saveData();

    if ($(this).is(':checked')) {
        $(this).siblings('label').css('text-decoration', 'line-through');
        countCompletedTasks++;
        document.getElementById('count').innerHTML = countCompletedTasks + '/' + countTasks;
    }

    else {
        $(this).siblings('label').css('text-decoration', 'none');
        countCompletedTasks--;
        document.getElementById('count').innerHTML = countCompletedTasks + '/' + countTasks;
    }
    $('.new-todo').focus();
}

function deleteCompleted() {

    for (var i = completedTasks.length; i--; ) {
        tasks.splice(completedTasks[i], 1);
    }

    countCompletedTasks = 0;

    saveData();
    updateCompletedListArray();
    updateListView();
}

function deleteAll() {
    if ((tasks.length > 0) && confirm("Are you sure you want to delete all your tasks?")) {
        var ul = document.getElementById('taskList');
        ul.innerHTML = '';
        tasks = [];
        completedTasks = [];
        document.getElementById('json').value = JSON.stringify(tasks);

        countCompletedTasks = 0;
        countTasks = 0;

        document.getElementById('count').innerHTML = countCompletedTasks + '/' + countTasks;

        saveData();
    }
}

$(".toggle").on('click', toggleChecked);
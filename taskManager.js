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

$(document).ready(function () {
    $("#inputTask").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#plus").click();
        }
    })
});

$('.todo-list').sortable();
$("#plus").click(function () {
    var itemValue = $('.new-todo').val();
    
    var ul = document.getElementById('taskList');
    var li = document.createElement("li");
    li.className = "task";

    var ch = document.createElement("input");
    ch.className = "toggle";
    ch.type = "checkbox";
    ch.onclick = toggleChecked;

    var label = document.createElement("label");
    label.className = "taskText";
    label.textContent = itemValue;
    
    var a = document.createElement("a");
    a.id = "remove";
    
    var span = document.createElement("span");
    span.className = "glyphicon glyphicon-remove";
    
    a.appendChild(span);

    li.appendChild(ch);
    li.appendChild(label);
    li.appendChild(a);

    $(ul).prepend(li);

    $('.new-todo').val(null);
    $('.new-todo').focus();
});

$("#remove").click(function () {
    
});

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
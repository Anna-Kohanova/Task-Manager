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

$("#plus").click(function () {
    window.alert("dfgfdgd");
});

$(".toggle").click(function() {
    
});

function articleCount(obj) {
    return obj.length;
};
$(document).ready(function() {
    // add click listeners to save buttons
    $(".save").on("click", function() {

            // what article on the page is this?
            var index = $(this).attr("data-index");
            // build article object for post route based on index
            var thisArticle = {
                title: $("a[data-link-index='" + index + "']").text(),
                link: $("a[data-link-index='" + index + "']").attr("href"),
                summary: $(".summary[data-summary-index='" + index + "']").text()
            };
            $(".article[data-index='" + index + "']").slideUp("slow");
            // console.log(thisArticle.title + " " + thisArticle.link + " " + thisArticle.summary);
            $.post("/save", thisArticle),
                function(success) {
                    console.log(success);
                    if (success.message) {}
                };
        })
        // add click listener to remove button; we're not handling this entirely in back end because we want a nice slide-up action
    $(".remove").on("click", function() {
        $.get("/remove/" + $(this).attr("data-article-id"), function(success) {
            if (success.message) {
                $(".article[data-id='" + success.id + "']").slideUp("slow");
            }
        })
    });

    // remove Note
    $(document).on("click", ".delNotebtn", function() {
        var thisId = $(this).attr("value");
        $("#articleId").attr("value", $(this).attr("data-article-id"));
        // Now make an ajax call for the Article
        $.ajax({
                method: "GET",
                url: "/removeNote/" + thisId
            })
            // With that done, add the Note information to the page
            .done(function(data) {
                // console.log(data);
            });
    });
    // Whenever someone clicks add Note button, populate modal form with any existing Notes and add article id to Note button
    $(document).on("click", ".Notes", function() {
        var thisId = $(this).attr("data-article-id");
        $("#articleId").attr("value", $(this).attr("data-article-id"));
        // Now make an ajax call for the Article
        $.ajax({
                method: "GET",
                url: "/articles/" + thisId
            })
            // With that done, add the Note information to the page
            .done(function(data) {
                // console.log(data);
                // If there's a Note in the article
                if (data.Note) {
                    console.log(data.Note);
                    $("#modal-Notes").html("");
                    for (var i = 0; i < data.Note.length; i++) {
                        console.log(data.Note[i].body);

                        $("#modal-Notes").append(data.Note[i].body + "&nbsp;&nbsp;&nbsp;" + "<button type=\"submit\" value=" + data.Note[i]._id + " class=\"delNotebtn btn btn-primary\" data-dismiss=\"modal\">x</button><hr />");
                    }
                }
            });
    });

    // When you click the saveNote button
    $(document).on("click", ".Notebtn", function() {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("value");
        var saveNote = $("#bodyinput").val();
        // Run a POST request to change the Note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from Note textarea
                    body: saveNote
                }
            })
            // With that done
            .done(function(data) {
                // Log the response
                console.log(data);
            });
        // Also, remove the values entered in the input and textarea for Note entry
        $("#bodyinput").val("");
    });
});
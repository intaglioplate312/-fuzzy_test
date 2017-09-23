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

    // remove Comment
    $(document).on("click", ".delCommentbtn", function() {
        var thisId = $(this).attr("value");
        $("#articleId").attr("value", $(this).attr("data-article-id"));
        // Now make an ajax call for the Article
        $.ajax({
                method: "GET",
                url: "/removeComment/" + thisId
            })
            // With that done, add the Comment information to the page
            .done(function(data) {
                // console.log(data);
            });
    });
    // Whenever someone clicks add Comment button, populate modal form with any existing Comments and add article id to Comment button
    $(document).on("click", ".Comments", function() {
        var thisId = $(this).attr("data-article-id");
        $("#articleId").attr("value", $(this).attr("data-article-id"));
        // Now make an ajax call for the Article
        $.ajax({
                method: "GET",
                url: "/articles/" + thisId
            })
            // With that done, add the Comment information to the page
            .done(function(data) {
                // console.log(data);
                // If there's a Comment in the article
                if (data.Comment) {
                    console.log(data.Comment);
                    $("#modal-Comments").html("");
                    for (var i = 0; i < data.Comment.length; i++) {
                        console.log(data.Comment[i].body);

                        $("#modal-Comments").append(data.Comment[i].body + "&nbsp;&nbsp;&nbsp;" + "<button type=\"submit\" value=" + data.Comment[i]._id + " class=\"delCommentbtn btn btn-primary\" data-dismiss=\"modal\">x</button><hr />");
                    }
                }
            });
    });

    // When you click the saveComment button
    $(document).on("click", ".Commentbtn", function() {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("value");
        var saveComment = $("#bodyinput").val();
        // Run a POST request to change the Comment, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from Comment textarea
                    body: saveComment
                }
            })
            // With that done
            .done(function(data) {
                // Log the response
                console.log(data);
            });
        // Also, remove the values entered in the input and textarea for Comment entry
        $("#bodyinput").val("");
    });
});
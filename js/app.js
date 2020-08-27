var access_token;
var baseString;

function encodeImagetoBase64(element) {

    var file = element.files[0];

    var reader = new FileReader();

    reader.onloadend = function () {
        baseString = reader.result;
    }

    reader.readAsDataURL(file);
}

function onSignIn(googleUser) {
    var auth = googleUser.getAuthResponse(true);
    access_token = auth.access_token;
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        access_token = null;
    });
}


$(document).ready(function () {
    $("#submit").click(function () {
        if (!access_token) {
            alert("Please sign in");
            return;
        }

        if (!baseString) {
            alert("Please select an image");
        } else {
            var request = {
                "image": baseString
            }

            // Submit Form and upload file
            $.ajax({
                url: "/upload",
                data: JSON.stringify(request),
                type: "POST",
                dataType: "json", // Change this according to your response from the server.
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
                    xhr.setRequestHeader("Content-Type", "application/json");

                },
                error: function (err) {
                    console.error(err.responseJSON.error);
                    alert(err.responseJSON.error);
                },
                success: function (data) {
                    $("#response").find("tbody").empty();

                    var trHTML = '';

                    $.each(data.payload, function (i, item) {
                        trHTML += '<tr><td>' + data.payload[i].displayName
                            + '</td><td>' + data.payload[i].imageObjectDetection.score + '</td></tr>';
                    });

                    $('#response').find("tbody").append(trHTML);
                    $("#base64Img").attr("src", baseString);
                    console.log(data);
                },
                complete: function () {
                    console.log("Request finished.");
                }
            });
        }
    });

});
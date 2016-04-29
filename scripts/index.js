function string_converter(term){
    switch(term){
        case 'possibility':
            return "There is a possibility that this person suffers from PTSD";
        case 'none':
            return "Cannot find an answer with sufficient confidence";
        case 'normal':
        case 'nothing':
        case 'healthy':
            return "This is normal";
        case 'anxiety':
            return "There is a possibility that this person suffers from anxiety";
        default:
            return term;
    }
}

function sp(elem){
    return $(elem).val().split(/\s+/);
}

function spaces(text){
    return text.replace(/_/g, ' ');
}

function person2_defaults(aBoolean){
    if(aBoolean) return;

    $("#a").val("sometimes bad sometimes just okay");
    $("#b").val("yes");
    $("#c").val("yes");
    $("#d").val("no");
    $("#e").val("sometimes");
    $("#symptoms_list").val("headache");

    return false;
}

person1_defaults();

function person1_defaults(aBoolean){
    if(aBoolean) return;

    $("#a").val("sometimes bad sometimes just okay");
    $("#b").val("yes");
    $("#c").val("yes");
    $("#d").val("no");
    $("#e").val("sometimes");
    $("#symptoms_list").val("headache");

    return false;
}

$(document).ready(function () {
    $("#exit_container").hide();
    $.ajax({
        url: "/lib/rules.nools"
    }).then(function (res) {
        $("#exit_container").hide();
        flow = nools.compile(res, {name: "rules"}),
        Person = flow.getDefined("person");

        function createPerson() {
            return new Person({
                patient_concern : $("#patient_concern").val(),
                patient_age: $("#patient_age").val(),
                assult: $("#assult").is(":checked"),
                displaced : $("#displaced").is(":checked"),
                pain : $("#pain").is(":checked"),
                a : sp("#a"),
                b : sp("#b"),
                c : sp("#c"),
                d : sp("#d"),
                e : sp("#e"),
                symptoms_list: sp("#symptoms_list")
            });
        }

        function app() {
            var confidence_n =0;
            var diagnosis_n ='';

            flow.getSession(createPerson())
            .on("di", function (diagnosis) {
                diagnosis_n = diagnosis.di;
            })
            .on("co", function (confidence) {
                confidence_n += confidence.co;
            })
            .on("fire", function(name, rule){
                var rAr = [];
                if(rule.p !== undefined)
                    $.each(rule.p, function(index, value) {
                        if(value !== undefined)
                            if(value){
                                rAr.push(index);
                            }
                        }); 

                var aReason = [
                '<div class="col-sm-4">',
                '<div class="tile green">',
                '<h3 class="title">',
                spaces(name),
                '</h3>',
                '<p>Detected: <br>',
                rAr,
                '</p>',
                '</div>',
                '</div>'
                ].join('\n');

                $("#reason_container").append(aReason)
            }).match().then(function () {
                console.log(diagnosis_n)
                $("#results_container").html($("<h3/>", {
                    text: string_converter(diagnosis_n) + " with confidence " + confidence_n.co + "%"
                }))
            });
        }
        $("#results_container").html($("<h3/>", {
            text: string_converter('none')
        }));
        $("#app").on("submit", function () {
            $("#reason_container").html('');
            app();
            $("#exit_container").slideDown();
            return false;
        });
    });
});
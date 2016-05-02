/* helper functions */

person1_defaults();

function string_converter(term){
    switch(term){
        case 'low':
            return "These results loosely follow a the pattern of a person who suffers from PTSD";
        case 'high':
            return "These results closely follow a the pattern of a person who suffers from PTSD";
        case 'normal':
        case 'nothing':
        case '':
        case 'none':
        case 'healthy':
            return "This appears to be normal";
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

function person1_defaults(aBoolean){
    if(aBoolean) return;
    $("#patient_concern").find("option#1").attr("selected", true); 
    $("#patient_age").find("option#1").attr("selected", true); 

    $('#displaced').removeAttr('checked');
    $('#pain').removeAttr('checked');
    $('#assult').attr('checked', true);

    $("#a").val("sometimes bad sometimes just okay");
    $("#b").val("yes, sometimes");
    $("#c").val("not really, no");
    $("#d").val("once or twice");
    $("#e").val("sometimes");
    $("#symptoms_list").val("headache");

    // $('#app').submit();
    return false;
}

function person2_defaults(aBoolean){
    if(aBoolean) return;
    $("#patient_concern").find("option#1").attr("selected", true); 
    $("#patient_age").find("option#1").attr("selected", true); 

    $('#assult').removeAttr('checked');
    $('#pain').removeAttr('checked');
    $('#displaced').attr('checked', true);

    $("#a").val("yes but I wouldn't describe it as traumatic");
    $("#b").val("no");
    $("#c").val("no");
    $("#d").val("no");
    $("#e").val("sometimes");
    $("#symptoms_list").val("headache");

    // $('#app').submit();
    return false;
}

function person3_defaults(aBoolean){
    if(aBoolean) return;

    $("#patient_concern").find("option#2").attr("selected", true); 
    $("#patient_age").find("option#4").attr("selected", true); 


    $('#assult').removeAttr('checked');
    $('#displaced').removeAttr('checked');
    $('#pain').attr('checked', true);

    $("#a").val("no event that I can describe as traumatic");
    $("#b").val("only once");
    $("#c").val("not that I can recall");
    $("#d").val("not really");
    $("#e").val("no, not really");
    $("#symptoms_list").val("headache");

    // $('#app').submit();
    return false;
}

// clear();
function clear(){
    $("#patient_concern").find("option#1").attr("selected", true); 
    $("#patient_age").find("option#1").attr("selected", true); 
    $('#assult').removeAttr('checked');
    $('#displaced').removeAttr('checked');
    $('#pain').removeAttr('checked');
    $("#a").val("");
    $("#b").val("");
    $("#c").val("");
    $("#d").val("");
    $("#e").val("");
    $("#symptoms_list").val("");
    return false;
}

$("#exit_container").hide();

$(document).ready(function() {
    $("#default1").on("click", function() { person1_defaults(); return false; });
    $("#default2").on("click", function() { person2_defaults(); return false; });
    $("#default3").on("click", function() { person3_defaults(); return false; });

    $.ajax({ url: "/lib/rules.nools" }).then(function (res) {
        
        flow = nools.compile(res, {name: "rules"}),
        Person = flow.getDefined("person");

        $("#results_container").html($("<h3/>", {
            text: string_converter('none')
        }));

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
            var reason_n ='';

            flow.getSession(createPerson())
            .on("di", function(diagnosis){
                diagnosis_n = diagnosis.di;
            })
            .on("re", function(reason){
                reason_n += reason.re;
            })
            .on("co", function(confidence){
                confidence_n += confidence.co;
            })
            .on("rv", function(rv){
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
                '<p>Data used: <br>',
                rAr,
                '</p>',
                '</div>',
                '</div>'
                ].join('\n');

                $("#reason_container").append(aReason);

            }).match().then(function (err) {
                $("#results_container").html($("<h3/>", {
                    // text: string_converter(diagnosis_n) + " with confidence " + confidence_n.co + "%."
                    text: string_converter(diagnosis_n)
                }));
            });
        }
        $("#app").on("submit", function () {
            $("#reason_container").html('');
            app();
            $("#exit_container").slideDown();
            return false;
        });
    });
});
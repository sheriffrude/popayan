var TOTAL_DIAS = 0;
var TOTAL_HORAS = 0;

$(function () {
    $("input[data-content-horas]").change(function () {
        var content = $(this).attr("data-content-horas");
        if ($(this).is(":checked"))
            $(content).removeClass("hidden");
        else
            $(content).addClass("hidden");
        CalcularTotalDias();
    });
});

function CalcularTotalDias() {
    TOTAL_DIAS = 0;

    ///Lunes
    if ($("#CheckboxLunes").is(":checked"))
        TOTAL_DIAS++;

    ///Martes
    if ($("#CheckboxMartes").is(":checked"))
        TOTAL_DIAS++;

    ///Miercoles
    if ($("#CheckboxMiercoles").is(":checked"))
        TOTAL_DIAS++;

    ///Jueves
    if ($("#CheckboxJueves").is(":checked"))
        TOTAL_DIAS++;

    ///Viernes
    if ($("#CheckboxViernes").is(":checked"))
        TOTAL_DIAS++;

    ///Sabado
    if ($("#CheckboxSabado").is(":checked"))
        TOTAL_DIAS++;

    ///Domingo
    if ($("#CheckboxDomingo").is(":checked"))
        TOTAL_DIAS++;

    $("#TotalDias").val(TOTAL_DIAS);
    //CalcularTotalHoras();
}

function OnCompleteEditarHorarioLaboral(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (typeof resultado !== "undefined") {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }
}

function OnBeginHorarioLaboral(jqXHR, settings) {
    var listaDias = [];
    if ($("#CheckboxLunes").is(":checked"))
        listaDias.push(1);

    ///Martes
    if ($("#CheckboxMartes").is(":checked"))
        listaDias.push(2);

    ///Miercoles
    if ($("#CheckboxMiercoles").is(":checked"))
        listaDias.push(3);

    ///Jueves
    if ($("#CheckboxJueves").is(":checked"))
        listaDias.push(4);

    ///Viernes
    if ($("#CheckboxViernes").is(":checked"))
        listaDias.push(5);

    ///Sabado
    if ($("#CheckboxSabado").is(":checked"))
        listaDias.push(6);

    ///Domingo
    if ($("#CheckboxDomingo").is(":checked"))
        listaDias.push(7);

    var data = $(this).serializeObject();
    data["ListaDias"] = listaDias;
    settings.data = jQuery.param(data);
    return true;
}
/**
 * Variables Globales
 */
var FECHA_HOY = null;
var FECHA_AYER = null;
var FECHA_ACTUAL = null;
var HORA_INICIAL = null;
var HORA_FINAL = null;
var FECHA_CERRAR = null;

$(function () {
    FECHA_HOY = moment($("#FechaHoy").val(), "DD/MM/YYYY");
    FECHA_AYER = moment($("#FechaHoy").val(), "DD/MM/YYYY").subtract(1, 'day');
    FECHA_CERRAR = FECHA_AYER.format("DD/MM/YYYY");

    CrearCalendario();

    $("#FiltroAnio").change(function () {
        var ano = $(this).val();
        var fecha = FECHA_HOY;
        var mes = FECHA_HOY.get('month') + 2;

        $('#contenedor_calendario').fullCalendar('gotoDate', new Date(ano + "-" + mes + "-01"));
        $('#contenedor_calendario').fullCalendar('refresh');
    });
});

function RecargarCalendario() {
    $('#contenedor_calendario').fullCalendar('refetchEvents');
}

function CrearCalendario() {
    $('#contenedor_calendario').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay',
            lang: 'es',
        },
        defaultDate: FECHA_AYER,
        navLinks: true,
        defaultView: 'agendaDay',
        editable: false,
        eventLimit: true,
        selectable: true,
        eventSources: [{
            url: URL_CALENDARIO,
            type: 'POST',
            data: {},
            error: function (data) {
                Utils._BuilderMessage('danger', data);
            }
        }],
        dayClick: function (date, allDay, jsEvent, view) {
            //AbrirFormularioRegistrarActividad(date);
        },
        eventClick: function (events, jsEvent, view) {
            ConsultarEvento(events);
        },
        select: function (start, end, jsEvent, view) {
            AbrirFormularioRegistrarActividad(start, end);
        },
        eventRender: function (event, element) {
            console.info(event);
            var tipoActividad = event.title;
            var totalHoras = event.hora;
            var horaInicio = moment(event.start._i).format("HH:mm");
            var horaFinal = moment(event.end._i).format("HH:mm");
            var id = event.id;

            var tooltip = "Tipo de Actividad :" + event.title + "&#013 Horas trabajadas: " + event.hora + "&#013 porcentaje en el día : " + event.porcentaje + "%";
            var html = '<div class="fc-content" title="">[' + horaInicio + " - " + horaFinal + "] " + tipoActividad + '</div>';

            element[0].innerHTML = html;
        },
        viewRender: function (currentView) {

            var maxDate = FECHA_HOY;
            if (maxDate >= currentView.start && maxDate <= currentView.end) {
                $(".fc-next-button").prop("disabled", true);
                $(".fc-next-button").addClass("fc-state-disabled");
            } else {
                $(".fc-next-button").removeClass("fc-state-disabled");
                $(".fc-next-button").prop("disabled", false);
            }
        },
    });
    $('.fc-prev-button').click(function () {
        var moment = $('#contenedor_calendario').fullCalendar('getDate');
        FECHA_CERRAR = moment.format("DD/MM/YYYY");

    });
    $('.fc-next-button').click(function () {
        var moment = $('#contenedor_calendario').fullCalendar('getDate');
        FECHA_CERRAR = moment.format("DD/MM/YYYY");
    });
}

function ConsultarEvento(event) {
    FECHA_ACTUAL = moment(event.start._i, event.start._f).format("DD/MM/YYYY");
    var url = URL_CONSULTAR + "?id=" + event.id;
    Utils._OpenModal(url, "OnLoadEliminar");
}

function AbrirFormularioRegistrarActividad(start, end) {
    ///Fecha
    var fecha = moment(start).format("DD/MM/YYYY");
    $("#fecha_inicial").val(fecha);
    FECHA_ACTUAL = fecha;

    ///Hora inicial
    var horaInicial = moment(start).format("hh:mm A");
    $('#horaInicial').val(horaInicial);
    HORA_INICIAL = horaInicial;

    ///Hora final
    var horaFinal = (end != null)
        ? moment(end).format("hh:mm A")
        : horaFinal = moment(start).startOf('hour').add(1, 'hours').format('HH:mm A');
    $('#horaFinal').val(horaFinal);

    HORA_FINAL = horaFinal;

    var parametros = {
        fecha: FECHA_ACTUAL
    };

    RequestHttp._Post(URL_VALIDAR_FECHA, parametros, "POST", function (response) {
        if (response != null) {
            if (response.state == true && response.data == true) {
                Utils._OpenModal(URL_REGISTRAR_ACTIVIDAD, "OnLoadCrear", "lg");
            }
            else if (response.state == true && response.data == false) {
                Utils._BuilderMessage("warning", response.message);
            }
            else {
                Utils._BuilderMessage("danger", response.message);
            }
        }
    });
}

function CerrarRegistro() {
    var parametros = {
        fecha: FECHA_CERRAR
    };
    $.ajax({
        url: URL_CERRAR_REGISTRO,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            Utils._BuilderMessage("danger", data.message);
        }
    });
}

function Confirmar() {
    var titulo = "Salir de registro de actividades";
    var body = "¿Está seguro de salir de registro de actividades?";
    var footer = '<button type="button" class="btn btn-warning" data-dismiss="modal" >No</button>' +
        '<a href="' + URL_VOLVER + '"><input type="button" class="btn btn-horashombre" value="Si"></a>';
    Utils._BuilderConfirmation(titulo, body, footer);
}
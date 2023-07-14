var FECHA_HOY = null;
var FECHA_AYER = null;

var FECHA_ACTUAL = null;
var HORAINICIAL = null;
var HORAFINAL = null;
var FECHA_CERRAR = null;

$(function () {
    FECHA_HOY = moment($("#FechaHoy").val(), "DD/MM/YYYY");
    FECHA_AYER = moment($("#FechaHoy").val(), "DD/MM/YYYY");
    FECHA_CERRAR = FECHA_AYER.format("DD/MM/YYYY");
    console.log(FECHA_CERRAR);
    crearSelectAnos();
    crearCalendario();

    $("#Anios").change(function () {
        var ano = $(this).val();
        var fecha = FECHA_HOY;
        var mes = FECHA_HOY.get('month') + 2;
        
        $('#calendar').fullCalendar('gotoDate', new Date(ano + "-" + mes ));
        $('#calendar').fullCalendar('refresh');
    });
});

function crearSelectAnos() {
    for (var i = 2017; i <= FECHA_HOY.get('year') ; i++)
        $('#Anios').append($('<option />').val(i).html(i));
}

function RecargarCalendario() {
    $('#calendar').fullCalendar('refetchEvents');
}

function crearCalendario() {

    $('#calendarioTareas').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay',
            lang: 'es',
        },
        defaultDate: FECHA_AYER,
        navLinks: true,
        defaultView: 'month',
        editable: false,
        eventLimit: true,
        selectable: true,
        eventSources: [

            {
                url: URL_LISTAR_TIMETABLE,
                type: 'POST',
                error: function (data) {
                    Utils._BuilderMessage('danger', "Ha ocurrido un error.");
                }
               
             
            }
        ],
        dayClick: function (date, allDay, jsEvent, view) {
            //abrirModalRegistrarActividad(date);
        },
        eventClick: function (events, jsEvent, view) {
            Utils._BuilderModal();
        },
        select: function (start, end, jsEvent, view) {
            //abrirModalRegistrarActividad(start, end);
        },
        eventRender: function (event, element) {

            var tipo = event.Tipo;

            element.attr("href", URL_TAREA_RESPONDER + '/' + event.id);
            element.attr("data-toggle", "modal"); 
            element.attr("data-target", "#");
            element.attr("data-execute-onload", "TAREA_RESPONDER.OnLoad");
            element.attr("data-size", "lg");
            element.css('background-color', '#FE642E');
            element.find(".fc-title").attr("data-toggle", "tooltip");
            element.find(".fc-title").attr("data-placement", "left");
            element.find(".fc-title").attr("title", 'Cliente: ' + event.Cliente + ' Tipo Tarea: ' + event.TipoTarea + ' Fecha y hora de solicitud: ' + event.Finicial + ' Fecha y hora de entrega: ' + event.Ffinal);
            
           
            if (tipo == 'CUM') {
                foto = URL_IMAGEN;
                element.find(".fc-title").parent().append("<i class='pull-right'>" + "<img src='" + foto + "'/>" + "</i>");
                element.css('background-color', '#2E9AFE');
            }
            
        }

    });
    
}



var $TABLA_USUARIOS = null;
var FILTRO = "";
var ARRAY_HORAS_DIA = new Array(
        "00:01 - 00:30 am", "00:31 - 01:00 am", "01:01 - 01:30 am", "01:31 - 02:00 am",
        "02:01 - 02:30 am", "02:31 - 03:00 am", "03:01 - 03:30 am", "03:31 - 04:00 am",
        "04:01 - 04:30 am", "04:31 - 05:00 am", "05:01 - 05:30 am", "05:31 - 06:00 am",
        "06:01 - 06:30 am", "06:31 - 07:00 am", "07:01 - 07:30 am", "07:31 - 08:00 am",
        "08:01 - 08:30 am", "08:31 - 09:00 am", "09:01 - 09:30 am", "09:31 - 10:00 am",
        "10:01 - 10:30 am", "10:31 - 11:00 am", "11:01 - 11:30 am", "11:31 - 12:00 am",
        "12:01 - 12:30 am", "12:31 - 01:00 pm", "01:01 - 01:30 pm", "01:31 - 02:00 pm",
        "02:01 - 02:30 pm", "02:31 - 03:00 pm", "03:01 - 03:30 pm", "03:31 - 04:00 pm",
        "04:01 - 04:30 pm", "04:31 - 05:00 pm", "05:01 - 05:30 pm", "05:31 - 06:00 pm",
        "06:01 - 06:30 pm", "06:31 - 07:00 pm", "07:01 - 07:30 pm", "07:31 - 08:00 pm",
        "08:01 - 08:30 pm", "08:31 - 09:00 pm", "09:01 - 09:30 pm", "09:31 - 10:00 pm",
        "10:01 - 10:30 pm", "10:31 - 11:00 pm", "11:01 - 11:30 pm", "11:31 - 12:00 pm");

var ARRAY_HORAS_DIA_MILITAR = new Array(
        "00:15", "00:45", "01:15", "01:45",
        "02:15", "02:45", "03:15", "03:45",
        "04:15", "04:45", "05:15", "05:45",
        "06:15", "06:45", "07:15", "07:45",
        "08:15", "08:45", "09:15", "09:45",
        "10:15", "10:45", "11:15", "11:45",
        "12:15", "12:45", "13:15", "13:45",
        "14:15", "14:45", "15:15", "15:45",
        "16:15", "16:45", "17:15", "17:45",
        "18:15", "18:45", "19:15", "19:45",
        "20:15", "20:45", "21:15", "21:45",
        "22:15", "22:45", "23:15", "23:45");
$(function () {
    $("#Fecha").datepicker({

    }).datepicker("setDate", new Date());

    $("#Fecha").change(crearTabla);

    crearTabla();

});

function crearTabla() {
    if ($TABLA_USUARIOS != null) {
        $TABLA_USUARIOS.destroy();
    }
    var $filtro = $("#input-filtro");
    $TABLA_USUARIO = $("#tabla-usuario").DataTable({
        "sScrollX": "100%",
        "sScrollXInner": "110%",
        "ajax": {
            "url": URL_USUARIO,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                d.fecha = $("#Fecha").val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        },
        "columns": [
            { "data": "FotoId" },
            { "data": "nombre" },
            {
                "data": "actividades",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    var actividades = data;
                    var longActividades = actividades.length;
                    var horaInicial = null;
                    var horaFinal = null;
                    var horaActual = null;
                    var textoTooltip = null;
                    var classAdicionar = null;
                    var tablaHoras = "<table class='tabla-horas detalle'><tr>";
                    var longArrayHorasMilitarDia = ARRAY_HORAS_DIA_MILITAR.length;
                    for (var i = 0; i < longArrayHorasMilitarDia; i++) {


                        classAdicionar = "";
                        var textoTooltip = "";
                        horaActual = ARRAY_HORAS_DIA_MILITAR[i];

                        for (var j = 0; j < longActividades; j++) {

                            horaInicial = actividades[j]["horaInicial"];
                            horaFinal = actividades[j]["horaFinal"];

                            var fechaActual = new Date('1/1/1990 ' + horaActual);
                            var fechaInicial = new Date('1/1/1990 ' + horaInicial);
                            var fechaFinal = new Date('1/1/1990 ' + horaFinal);

                            if (fechaActual > fechaInicial && fechaActual < fechaFinal) {
                                classAdicionar = "active";

                                var titulo = "<h4>Detalle</h4><hr>";
                                var totalHoras = "<p><span>Horas: </span>" + restarHoras(horaInicial, horaFinal) + "</p>";
                                var porcentajeHoras = "<p><span>Porcentaje del día: </span>" + calcularPorcentajeHoras(horaInicial, horaFinal) + "</p>";

                                var cliente = actividades[j]["cliente"];
                                cliente = (cliente != null) ? "<p><span>Cliente: </span>" + cliente + "</p>" : "";

                                var ot = actividades[j]["ot"];
                                ot = (ot != null) ? "<p><span>OT: </span>" + ot + "</p>" : "";

                                var tipoActividad = actividades[j]["tipoActividad"];
                                tipoActividad = (tipoActividad != null) ? "<p><span>Actividad: </span>" + tipoActividad + "</p>" : null;
                                var observaciones = "<p><span>Observaciones: </span>" + actividades[j]["Observacion"] + "</p>";

                                textoTooltip = titulo + cliente + ot + tipoActividad + totalHoras + porcentajeHoras + observaciones;

                                break;
                            }
                        }

                        textoTooltip = (textoTooltip != "") ? "title='" + textoTooltip + "'" : "";
                        tablaHoras += "<td class='" + classAdicionar + "' " + textoTooltip + " data-hora='" + horaActual + "'>" + ARRAY_HORAS_DIA[i] + "</td>";

                    }
                    tablaHoras += "</tr>" +
                            "</table>";

                    return tablaHoras;
                }
            },
        ],
        "order": [[1, "desc"]],
        "drawCallback": function (settings) {
            $("td.active").tooltip({
                content: function () {
                    return $(this).prop('title');
                },
                position: {
                    my: "center bottom-20",
                    at: "center top",
                    using: function (position, feedback) {
                        $(this).css(position);
                        $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                    }
                }
            });
        }
    });
}


function calcularPorcentajeHoras(horaInicial, horaFinal) {
    var horasI = parseInt(horaInicial.substr(0, 2));
    var minutosI = parseInt(horaInicial.substr(3, 2));
    minutosI = parseFloat((minutosI == 30) ? 0.5 : 0);
    var totalI = parseFloat(horasI + minutosI);

    var horasF = parseInt(horaFinal.substr(0, 2));
    var minutosF = parseInt(horaFinal.substr(3, 2));
    minutosF = parseFloat((minutosF == 30) ? 0.5 : 0);
    var totalF = parseFloat(horasF + minutosF);

    var totalHIF = parseFloat(totalF - totalI);

    var porcentaje = ((totalHIF * 100) / 8) + "%";

    return porcentaje;
}


function restarHoras(inicio, fin) {
    var inicioMinutos = parseInt(inicio.substr(3, 2));
    var inicioHoras = parseInt(inicio.substr(0, 2));

    var finMinutos = parseInt(fin.substr(3, 2));
    var finHoras = parseInt(fin.substr(0, 2));

    var transcurridoMinutos = finMinutos - inicioMinutos;
    var transcurridoHoras = finHoras - inicioHoras;

    if (transcurridoMinutos < 0) {
        transcurridoHoras--;
        transcurridoMinutos = 60 + transcurridoMinutos;
    }

    var horas = transcurridoHoras.toString();
    var minutos = transcurridoMinutos.toString();
    minutos = (minutos.length == 1) ? minutos + "0" : minutos;

    if (horas.length < 2) {
        horas = "0" + horas;
    }

    if (horas.length < 2) {
        horas = "0" + horas;
    }
    return horas + ":" + minutos;
}

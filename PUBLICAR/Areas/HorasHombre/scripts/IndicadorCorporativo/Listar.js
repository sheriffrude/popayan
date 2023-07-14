var $TABLA_USUARIO = null;
var USUARIO_ID = 0;
var $TABLA_USUARIO_POR_EMPRESA = null;
var FECHAINICIO = null;
var FECHAFIN = null;
$(function () {
    Formatofechas();
    consultarUsuarios();
});
function Formatofechas() {
    $("#FechaInicio").datepicker();
    $("#FechaFin").datepicker();
}




/**
 * Contruir usuario
 * @returns {} 
 */
function consultarUsuarios() {
    var $filtro = $("#input-filtro-empleado");
    if ($TABLA_USUARIO != null) {
        $TABLA_USUARIO.destroy();
    }
    $TABLA_USUARIO = $("#tabla-usuario").DataTable({
        "ajax": {
            "url": URL_USUARIO,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                d.empresaId = $("#EmpresaId option:selected").val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        }, "columns": [
            {
                "data": "UsuarioId",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return '<div class="custom-radiobutton">' +
                            '<input type="radio" name="checkbox-cliente" id="radio-cliente-' + data + '" onclick="seleccionarUsuario(' + data + ')" class="radio">' +
                            '<label for="radio-cliente-' + data + '"></label>' +
                            '</div>';
                }
            },

        { "data": "NombreCompleto" }
        ],
        "drawCallback": function (settings) {
        }
    });
}


function seleccionarUsuario(i) {
    FECHAINICIO = $("#FechaInicio").val();
    FECHAFIN = $("#FechaFin").val();
    USUARIO_ID = i;
    crearBarra();
    crearTabla();
}


/**
 * Contruir usuario
 * @returns {} 
 */
function crearTabla() {
    if ($TABLA_USUARIO_POR_EMPRESA != null) {
        $TABLA_USUARIO_POR_EMPRESA.destroy();
    }
    var parametros = {
        empresaId: $("#EmpresaId option:selected").val(),
        usuarioId: USUARIO_ID,
        fechaInicio: FECHAINICIO,
        fechaFin: FECHAFIN
    };
    $.ajax({
        url: URL_USUARIO_POR_EMPRESA,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            var data = respuesta.data;

            $("#HorasTrabajadas").text(data.HorasTrabajadas); 
            $("#HorasPresupuestadas").text(data.HorasPresupuestadas);
          
        }
    });
}


//GENERA LA GRAFICA EN BARRAS

function crearBarra() {
    var parametros = {
        empresaId: $("#EmpresaId option:selected").val(),
        usuarioId: USUARIO_ID,
        fechaInicio: FECHAINICIO,
        fechaFin: FECHAFIN
    };
    $.ajax({
        url: URL_USUARIO_POR_EMPRESA_TABLA,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            console.log(obj);
            var chart = new CanvasJS.Chart("chartContainer", {
                title: {
                    text: "Indicador corporativo"
                },
                data: [obj]
            });
            chart.render();
        }
    });

}

/**
 * Variables globales
 */
var $TABLA_BRIEF = null;

/**
 * Onload page
 */
$(function () {
    ConstruirTablaBrief();
    $("#form-filtro-tabla").submit(RecargarTablaBrief);
});

/**
 * Filtrar tabla brief
 * @returns {boolean} 
 */
function RecargarTablaBrief() {

    if ($TABLA_BRIEF != null) {
        $TABLA_BRIEF.draw();
    }
    return false;
}

/**
 * Contruir tabla brief
 * @returns {} 
 */
function ConstruirTablaBrief() {
    var $filtro = $("#input-filtro");
    $TABLA_BRIEF = $("#tabla-brief").DataTable({
        "ajax": {
            "url": URL_LISTAR_BRIEF,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        }, "columns": [
            { "data": "Nombre" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<a href="' + URL_EDITAR_BRIEF + '?id=' + data + '" class="btn btn-secondary" >Editar</a>';
                }
            },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var resultado = "";
                    if (PERMISO_EDITAR == true) {
                        var checked = (data == true) ? "checked" : "";
                        resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="CambiarEstado(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">';
                    }
                    else
                        resultado = (data == true) ? "Activo" : "Inactivo";
                    return resultado;
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();

            $(".boton-desactivar-persona").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

/**
 * CambiarEstado
 * @param {any} e
 */
function CambiarEstado(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        Id: id,
        Estado: estado
    };

    RequestHttp._Post(URL_CAMBIAR_ESTADO_BRIEF, parameters, null, function (resultado) {
        if (resultado != null) {
            var tipoMensaje = (resultado.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoMensaje, resultado.message);
            RecargarTablaBrief();
        }
    });
}
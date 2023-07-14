///Variables globales
var $TABLA_PERSONAS = null;

//Onload page
$(function () {
    ConstruirTablaPersonas();
    $("#form-filtro-tabla").submit(RecargarTablaPersonas);
});

function RecargarTablaPersonas() {
    if ($TABLA_PERSONAS != null) {
        $TABLA_PERSONAS.draw();
    }
    return false;
}

function ConstruirTablaPersonas() {
    var $filtro = $("#input-filtro");
    $TABLA_PERSONAS = $("#tabla-Personas").DataTable({
        "ajax": {
            "url": URL_LISTAR_PERSONAS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            { "data": "Nombres" },
            { "data": "Apellidos" },
            { "data": "TipoDocumento" },
            { "data": "Documento" },
            { "data": "Sexo" },
            { "data": "Correo" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_PERSONAS)
                  ? '<a href="' + URL_EDITAR_PERSONAS + '/' + data + '" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_PERSONAS)
                        ? '<a href="' + URL_DETALLE_PERSONAS + '/' + data + '" data-target="#" class="btn btn-secondary btn-sm" >Detalle</a>'
                        : "";
                }
            },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var resultado = "";
                    if (PERMISO_EDITAR_PERSONAS == true) {
                        var checked = (data == true) ? "checked" : "";
                        resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="CambiarEstadoPersona(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">';
                    }
                    else
                        resultado = (data == true) ? "Activo" : "Inactivo";
                    return resultado;

                }
            },
        ],
        "drawCallback": function (settings) {
            $(".boton-desactivar-persona").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

function CambiarEstadoPersona(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        Id: id,
        Estado: estado
    };
    $.ajax({
        url: URL_CAMBIAR_ESTADO_PERSONA,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoRespuesta = (data.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, data.message);
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}
var tablaTarifarios = null;

var ListarTarifarios = function () {
    return {

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarTarifarios.construirTabla();
        },

        reconstruirTabla: function () {
            tablaTarifarios.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {
            var filtro = $("#input-filtro");
            tablaTarifarios = $("#tabla-cliente-tarifario").DataTable({
                "ajax": {
                    "url": URL_LISTAR_CLIENTE_TARIFARIO,
                    "type": "POST",
                    "data": function (d) {
                        d.search['value'] = filtro.val();
                        return $.extend({}, d, {
                            "adicional": {

                            }
                        });
                    }
                },
                "columns": [
                    { "data": "Nombre" },
                    { "data": "GrupoTarifario" },
                    {
                        "data": "Tarifa",
                        "width": "20%"
                    },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "10%",
                        "render": function (data, type, full, meta) {

                            var botonEditar = '<a href="' + URL_EDITAR_CLIENTE_TARIFARIO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'

                            var resultado = ""
                            resultado += (PERMISO_EDITAR_CLIENTE_TARIFARIO) ? botonEditar : "";
                            return resultado;
                        }
                    },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            var checked = (full.Estado == true) ? "checked" : "";
                            var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-cliente-tarifario" onchange="CambiarEstadoClienteTarifario(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">'

                            var resultado = botonEstado;
                            //resultado += (PERMISO_CAMBIAR_ESTADO_CLIENTE_TARIFARIO) ? botonEstado : "";
                            return resultado;
                        }
                    }
                ],
                "drawCallback": function (settings) {
                    Utils._BuilderModal();
                    $(".boton-desactivar-cliente-tarifario").bootstrapToggle({
                        on: '',
                        off: ''
                    });
                }
            });
        }
    }
}();

$(function () {
    ListarTarifarios.init();
});

/**
 * Cambiar estado  cliente tarifario
 * @param {int} id 
 */
function CambiarEstadoClienteTarifario(e) {

    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        estado: estado
    };

    $.ajax({
        url: URL_CAMBIAR_ESTADO_CLIENTES_TARIFARIO,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            ListarTarifarios.reconstruirTabla();
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}

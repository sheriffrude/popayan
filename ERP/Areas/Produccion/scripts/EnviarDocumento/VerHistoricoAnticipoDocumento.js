/*
*VARIBLES GLOBALES
*/
var $TABLA_ANTICIPO_ENVIAR_DOCUMENTO = null;
var ORDEN_COMPRA_ID = null;

/*
* Simula el onload
*/
function HistoricoAnticipoFactura() {
    ORDEN_COMPRA_ID = $("#OrdenCompraId").val();
    ConstruirTablaAnticiposHistoricoEnviarDocumento();
    $("#form-filtro-tabla").submit(RecargarTablaAnticipoEnviarDocumento);
}



function OnchangeFiltroHistoricoEnviarDocumento(e) {
    var filtro = parseInt($(e).val());
    if (filtro == 1) {
        $("#input-numero-anticipo").removeClass('hidden');
        $("#lista-estado").addClass('hidden');
        $("#EstadoAnticipo").val('');

    } else {
        $("#input-numero-anticipo").addClass('hidden');
        $("#lista-estado").removeClass('hidden');
        $("#numero-anticipo").val('');

    }

}


/**
 * Function para filtrar la tabla Paises
 * @returns {boolean} false
 */
function RecargarTablaAnticipoEnviarDocumento() {
    if ($TABLA_ANTICIPO_ENVIAR_DOCUMENTO != null) {
        $TABLA_ANTICIPO_ENVIAR_DOCUMENTO.draw();
    }
    return false;
}

/**
* Contruye la tabla de items
*/
function ConstruirTablaAnticiposHistoricoEnviarDocumento() {
    var $filtro = $("#input-filtro");
    var $numeroAnticipo = $("#numero-anticipo");
    var $estado = $("#EstadoAnticipo");
    var NumeroAnticipo;
    var Estado;

    $TABLA_ANTICIPO_ENVIAR_DOCUMENTO = $("#tabla-anticipos-enviar-documento").DataTable({
        //"initComplete": function (settings, json) {
        //    cargarImpuestoAnticipoMasivo(0);
        //    //CalcularValorDisponible();
        //},
        "order": [[1, "desc"]],
        "ajax": {
            "url": URL_CONSULTAR_ANTICIPO_ENVIAR_DOCUMENTO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val(),
                    d.id = ORDEN_COMPRA_ID,
                    d.NumeroAnticipo = NumeroAnticipo = ($numeroAnticipo.val() == "") ? null : $numeroAnticipo.val(),
                    d.Estado = Estado = ($estado.val() == "") ? null : $estado.val()
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "NumeroAnticipo" },
            { "data": "Usuario" },
            { "data": "FechaSolicitud" },
            { "data": "FechaRequerido" },
            { "data": "FechaLegalizacion" },
            {
                "data": "Estado",
                "render": function (data, type, full, meta) {
                    var costoItem = '<div widt="5%"><button type="button" name="estado" class="btn btn-success" onclick="VerJerarquiaAnticipo(' + full.NumeroAnticipo + ')" data-estado="' + data + '">' + data + '</button></div>'
                    //var resultado = ""
                    //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                    return costoItem;
                }
            },
            {
                "data": "NumeroAnticipo",
                "render": function (data, type, full, meta) {
                    return '<a type="button" onclick="DescargarPdfAnticipo(' + data + ')" title="Descargar">' +
                        '<img src="/Content/images/Gestion/boton-descargar.png" alt="Descargar" />' +
                        '</a>';
                }
            },
            {
                "data": "NumeroAnticipo",
                "render": function (data, type, full, meta) {
                    return '<a href="#"  target="_blank" title="Descargar">' +
                        '<img src="/Content/images/Gestion/boton-descargar.png" alt="Descargar" />' +
                        '</a>';
                }


            },
            {
                "data": "NumeroAnticipo",
                "render": function (data, type, full, meta) {
                    if (PERMISO_VER_DETALLE_CONTABLE_ANTICIPO) {
                        var tipoDetalle = 1;
                    } else {
                        tipoDetalle = 2;
                    }
                    var VerDetalle = '<div widt="5%"><button type="button" class="btn btn-success" onclick="VerDetalleAnticipo(' + data + ', ' + tipoDetalle + ')">Ver Detalle</button></div>'
                    //var resultado = ""
                    //resultado += (PERMISO_VER_DETALLE_CONTABLE_ANTICIPO) ? botonEstado : "";
                    return VerDetalle;
                }
            }

        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();

        }
    });




}


/**
*Consultar detalle del anticipo
*/
function VerDetalleAnticipo(id, tipoDetalleAnticipo) {

    if (tipoDetalleAnticipo == 1) {
        var onLoadModal = 'DetalleAnticipoContable';
    } else {
        onLoadModal = 'DetalleAnticipo';
    }

    URL_VER_DETALLE_ANTICIPO = '';
    URL_VER_DETALLE_ANTICIPO = URL_VER_DETALLE_ANTICIPOS + "/" + id
    Utils._OpenModal(URL_VER_DETALLE_ANTICIPO, onLoadModal, 'all');
}

/**
*Consultar jerarquia de aprobacion del anticipo
*/
function VerJerarquiaAnticipo(id) {
    URL_JERARQUIA_ANTICIPOS = '';
    URL_JERARQUIA_ANTICIPOS = URL_VER_JERARQUIA_ANTICIPO + "/" + id
    Utils._OpenModal(URL_JERARQUIA_ANTICIPOS, 'OnLoadVerJerarquiaAnticipo', 'lg');
}
/**
*Variables globales
*/
var $TABLA_IMAGEN_FACTURA = null;
var costoInterno = null;
var valorAcumulado = null;
var valorSolicitadoantiguo = 0;
var IMAGEN_FACTURA = [];
var IMAGEN_FACTURA_GUARDAR = [];

/**
*Simula el onload
*/
function CrearFactura() {
    IMAGEN_FACTURA = [];
    IMAGEN_FACTURA_GUARDAR = [];
    $.datepicker.setDefaults($.datepicker.regional["es"]);
    $("#FechaDocumento").datepicker({
        dateFormat: 'dd/mm/yy',
    }).datepicker("setDate", new Date()).val('');

    $.datepicker.setDefaults($.datepicker.regional["es"]);
    $("#FechaVencimientoDocumento").datepicker({
        dateFormat: 'dd/mm/yy',
    }).datepicker("setDate", new Date()).val('');

    var itemId = $("#ItemId").val();
   
    Utils._InputFormatPrice();

}

function CargarDatos(id) {
    $tr = $("#tabla-presupuesto-item tr.tr-item[data-item='" + id + "']");
    var nombreGrupo = $tr.find("input[name='GrupoItem']").val();
    var nombreItem = $tr.find("input[name='NombreItem']").val();
    var dias = $tr.find("input[name='Dias']").val();
    var cantidad = $tr.find("input[name='Cantidad']").val();
    var valorUnitario = $tr.find("input[name='ValorUnitarioInterno']").formatPriceGetVal();
    costoInterno = $tr.find("input[name='CostoInterno']").formatPriceGetVal();
    valorAcumulado = ($("#ValorAcumulado").val() == null) ? 0 : parseInt($("#ValorAcumulado").formatPriceGetVal());
    $("#ValorSolicitado").attr('data-valor-acumulado', valorAcumulado);
    var valorDisponible = (costoInterno - valorAcumulado);

    if (valorDisponible == 0) {
        $(".ocultar").addClass('hidden');
        Utils._BuilderMessage("warning", 'Ya ha superado el límite disponible para hacer anticipos sobre este ítem!');
    }

    $("#grupo").val(nombreGrupo);
    $("#nombre-item").val(nombreItem);
    $("#dias").val(dias);
    $("#cantidad").val(cantidad);
    $("#valor-unitario").val(formatNumber.new(valorUnitario));
    $("#valor-total").val(formatNumber.new(costoInterno));
    $("#ValorAcumulado").val(formatNumber.new(valorAcumulado));
    $("#valor-disponible").val(formatNumber.new(valorDisponible));
    $("#ValorSolicitado").val();
    $("#Excedente").val();
    $("#Impuesto").val();
    cargarImpuestoAnticipo(0);
}

function cargarImpuestoAnticipo(impuesto) {
    ///Cargar impuestos 
    $Impuesto = $("#Impuesto");
    CargarImpuestos($Impuesto);
    $Impuesto.val(impuesto);
}

function CalcularExcedente() {
    var totalAcumulado = 0;

    var valorSolicitado = ($("#ValorSolicitado").formatPriceGetVal() == '') ? 0 : parseInt($("#ValorSolicitado").formatPriceGetVal());
    var acumuladoInicial = parseInt($("#ValorSolicitado").attr('data-valor-acumulado'));
    var disponible = parseInt($("#valor-disponible").formatPriceGetVal());
    var acumulado = parseInt($("#ValorAcumulado").formatPriceGetVal());
    $excedentePorcentaje = $("#Excedente");
    if (disponible >= valorSolicitado) {
        excedentePorcentaje = parseInt(disponible - valorSolicitado);
        $excedentePorcentaje.val(formatNumber.new(excedentePorcentaje));

        if (acumulado > 0) {

            if (acumuladoInicial != acumulado) {
                totalAcumulado = (acumuladoInicial + valorSolicitado);
            } else {
                totalAcumulado = (acumulado + valorSolicitado);
            }

            valorSolicitadoantiguo = valorSolicitado;
            $("#ValorAcumulado").val(formatNumber.new(totalAcumulado));
        } else {
            $("#ValorAcumulado").val(formatNumber.new(valorSolicitado));
            valorSolicitadoantiguo = valorSolicitado;
        }

    } else {
        Utils._BuilderMessage("warning", 'Usted está sobrepasando el valor disponible para realizar el anticipo !');
        $("#ValorSolicitado").val(0);
        if (valorAcumulado > 0) {
            $("#ValorAcumulado").val(formatNumber.new(valorAcumulado));
        } else {
            $("#ValorAcumulado").val(0);
        }

        $excedentePorcentaje.val(formatNumber.new(disponible));
        $("#Excedente").val(0);

        Utils._InputFormatPrice();
    }

}

function UploadFileFactura(e) {

    RequestHttp._UploadFile(e, URL_UPLOAD, function (result) {
        console.info(result);

        if (result != null) {
            FILE = {
                'Name': result.Name,
                'Path': result.Path,
                'Nombre': result.OriginalName,
                'Url': result.Url
            };
            FILEGUARDAR = {
                'OriginalName': result.OriginalName,
                'Name': result.Name,
                'Path': result.Path,
                'Url': result.Url
            };
            IMAGEN_FACTURA.push(FILE);
            IMAGEN_FACTURA_GUARDAR.push(FILEGUARDAR);

            ConstruirTablaImagenesFacturas()
        }
    });

}

/**
* Contruye la tabla de imagenes
*/
function ConstruirTablaImagenesFacturas() {

    var tamanoImagen = IMAGEN_FACTURA.length;
    for (i = 0; tamanoImagen > i; i++) {
        IMAGEN_FACTURA[i].Orden = i;
    }

    $TABLA_IMAGEN_FACTURA = $("#tabla-imagen-factura").DataTable({
        "destroy": true,
        "serverSide": false,
        "bInfo": false,
        "data": IMAGEN_FACTURA,
        "columns": [
            {
                "title": "Nombre",
                "data": "Nombre",
                "orderable": false
            },
            {
                "data": "Url",
                "orderable": false,
                "searchable": false,
                "width": "30%",
                "render": function (data, type, full, meta) {
                    var imagen = '<div class="zoom"><img  src="' + data + '" class="img-responsive" heigth="200px" /></div>'
                    return imagen;
                }
            },
            {
                "data": "Orden",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var eliminar = '<div><button class="btn btn-danger btn-xs" value="' + data + '" onclick="EliminarImagen(' + data + ')"> <span class=" glyphicon glyphicon-remove" aria-hidden="true"></span></button></div>'
                    return eliminar;
                }
            }
        ]
    });

}

function EliminarImagen(id) {
    var tamanoImagen = IMAGEN_FACTURA.length;
    var posicionImagen = 0;
    for (i = 0; tamanoImagen > i; i++) {
        if (IMAGEN_FACTURA[i].Orden == id) {
            posicionImagen = i;
            break;
        }
    }
    IMAGEN_FACTURA_GUARDAR.splice(i, 1);
    IMAGEN_FACTURA.splice(i, 1);
    if ($TABLA_IMAGEN_FACTURA != null) {
        $TABLA_IMAGEN_FACTURA.draw();
    }

    ConstruirTablaImagenesFacturas();
    return false;
}

function OnBeginFormEnviarImagenFactura(jqXHR, settings) {

    var data = $(this).serializeObject();
    var longitudArray = IMAGEN_FACTURA_GUARDAR.length;

    if (longitudArray > 0) {

        data["Adjuntos"] = IMAGEN_FACTURA_GUARDAR;
        data.ValorDocumento = $("#ValorDocumento").formatPriceGetVal();
        data.ImpuestoDocumento = $("#ImpuestoDocumento").formatPriceGetVal();
        data.ValorTotalDocumento = $("#ValorTotalDocumento").formatPriceGetVal();
        settings.data = jQuery.param(data);
        return true;
    } else {
        Utils._BuilderMessage('info', 'Debe adjuntar las imagenes de la factura');
        return false;
    }
}

function OnCompleteCrearFactura(response) {

    var resultado = RequestHttp._ValidateResponse(response);

    if (resultado != null) {
        var mensaje = "";
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success"
            mensaje = resultado.message + " " + resultado.data;
            Utils._CloseModal();
            IMAGEN_GUARDAR = [];
            $("#orden-compra-factura").addClass('hidden');
        } else {
            mensaje = resultado.message
        }

        Utils._BuilderMessage(tipoMensaje, mensaje);
    }

}
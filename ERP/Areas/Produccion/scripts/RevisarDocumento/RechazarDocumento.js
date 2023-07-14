/*
* Simula el Onload
**/
function RechazarDocumento() {
    CargarDocumentosRechazar();
}




/**
*funcion para abrir el modal de rechazar documento
*/
function CargarDocumentosRechazar() {

    var arrayDocumento = ARRAY_DOCUMENTOS_REVISAR;
    var longitudArrayDocumentos = arrayDocumento.length;

    if (longitudArrayDocumentos > 0) {
        $('#rechazar-documento').modal("show", function () {
            Utils._InputFormatPrice();
        });
        for (i = 0; i < longitudArrayDocumentos; i++) {
            var numero = arrayDocumento[i].Numero;
            var ordenCompra = arrayDocumento[i].OrdenCompraId;

            var input = '<div id="caja-rechazar-factura"><div class="form-group col-md-4"><input type="text" class="form-control text-center" value="' + numero + '" readonly/><div> ';
            var textArea = '<div class="form-group col-md-8"><textarea class="textarea form-control" name="observacion-rechazo-documento" data-observacion-documento="' + ordenCompra + '" data-observacion-numero-factura="' + numero + '"></textarea><div>';

            var espacio = '<div class="clearfix"></div><hr /><div class="clearfix"></div><div>';
            $("#rechazar-factura-id").append(input, textArea, espacio);
            //$("#rechazar-factura-observacion").append(textArea);


        }

    } else {
        Utils._BuilderMessage("info", "Debe seleccionar un documento");
    }

}
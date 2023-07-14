var DEPTOID = 0;
var CONTADOR = 0;
var $TABLA_ARCHIVOS = null;
var FILE = [];

function OnloadCrearSolicitud() {
    $("#FechaTrabajo").datepicker().datepicker("setDate", new Date());
    FILE = [];
}

function OnchangeDepto(e, url) {

    var DEPTOID = $(e).val();
    var $dropDownList = $("#TipoRequerimiento");
    if (!(DEPTOID > 0)) {
        Utils._ClearDropDownList($dropDownList);
        return false;
    }

    var parameters = {
        id: DEPTOID
    };

    MostrarDirector(DEPTOID);
    Utils._GetDataDropDownList($dropDownList, url, parameters);
}

function MostrarDirector(DEPTOID) {

    $.ajax({
        url: URL_LISTA_DIRECTORES + "?id=" + DEPTOID,
        async: false,
        type: "POST",
        dataType: "json",
        success: function (result) {
            if (result.state == true) {
                var html = '';
                $("#ListaDirectores").empty();
                 $.each(result.data, function (index, item) {
                     html += '<li  class="list-group-item">' + item.Text + '</li>';
                }); $("#ListaDirectores")

                $("#ListaDirectores").append(html);
            } else {
                Utils._BuilderMessage("danger", result.message);
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}

function SubirArchivo(e) {
    RequestHttp._UploadFile(e, URL_SUBIR_ARCHIVOS_TEMP_INFOME_ENTREVISTA, function (result) {
        if (result != null) {
            CONTADOR++;
            var object = {
                'Id':CONTADOR,
                'Name': result.Name,
                'Path': result.Path,
                'OriginalName': result.OriginalName
            };
            FILE.push(object);
            TablaArchivos();
        }
    });
   
}

function TablaArchivos() {

    $("#Contenedor_Archivos").removeClass('hidden');
    $TABLA_ARCHIVOS = $("#tabla-Archivos").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": FILE,
        "columns": [
            {
                "data": "OriginalName"
            },
            {
                "data": "Id",
                "width": "20%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarArchivo(' + data + ')" >';
                }
            }
        ]
    });
}

function EliminarArchivo(id) {
    var tamanoDataSetOpciones = FILE.length;

    for (var i = 0; tamanoDataSetOpciones > i; i++) {
        if (FILE[i]["Id"] == id) {
            FILE.splice(i, 1);
            break;
        }
    }
    TablaArchivos();
}

function OnBeginCrearAprobacion(jqXHR, settings) {
    var data = $(this).serializeObject();
    var tamano = FILE.length;
    var ARCHIVOS = [];

    for (var i = 0; i < tamano; i++) {
        var object = {
            'Name': FILE[i]['Name'],
            'Path': FILE[i]['Path'],
            'OriginalName': FILE[i]['OriginalName']
        };
        ARCHIVOS.push(object);
    }

    data["ListaArchivos"] = ARCHIVOS;
    data["TipoRequerimiento"] = $("#TipoRequerimiento").val();
    settings.data = jQuery.param(data);
    
    return true;
}

function OnSuccessFormCrearSolicitud(resultado) {

    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
    }
    Utils._BuilderMessage(tipoMensaje, resultado.message);
    Utils._CloseModal();
    TablaSolicitudes();
}
var asociarEmpresa = function () {
    return {
        tablaRegistro: "",
        metodoFinalizacion: "",

        //Obtiene los valores del viewbag
        init: function () {
            this.tablaRegistro = $("#nombreTablaAsociacion").val();
            this.metodoFinalizacion = $("#metodoAsociacion").val();
        },

        //Verifica si la empresa fue asociada previamente y ejecuta el metodo pasado por parametro al action view
        asociarEmpresa: function(e) {
            $(e).validate();
            if (this.tablaRegistro != "" && this.metodoFinalizacion != "") {
                var empresaId = $("#EmpresaId").val();
                var identificador = $("#Identificador").val();
                
                var data = window[this.tablaRegistro];
                if (data != undefined && typeof data == "object") {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].EmpresaId == empresaId) {
                            Utils._BuilderMessage('danger', 'Esta Empresa ya se encuentra asociada.');
                            return false;
                        }

                        if (data[i].Identificador == identificador) {
                            Utils._BuilderMessage('danger', 'Ya existe un registro con este Identificador.');
                            return false;
                        }
                    }

                    var nombre = $("#EmpresaId option:selected").text();
                    var jsonEmpresa = {
                        Id: -1,
                        EmpresaId: empresaId,
                        Nombre: nombre,
                        Identificador: identificador,
                    };
                    
                    var metodoRegistro = window[this.metodoFinalizacion];
                    if (metodoRegistro != undefined && typeof metodoRegistro == "function") {
                        metodoRegistro(jsonEmpresa);
                        Utils._CloseModal();
                    }
                }
            }
        }
    }
}();
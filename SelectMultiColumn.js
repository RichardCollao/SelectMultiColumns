/**
@Select Multi Columns   componente similar en funcionamiento y apariencia a un componente de tipo Select 
                        que permite visualizar las opciones presentándolas en columnas.
@version                1.0.0
@author                 Richard Collao O.
@web                    http://www.richardcollao.cl/
@license                Creative Commons Reconocimiento-CompartirIgual 4.0 Internacional License
*/

class SelectMultiColumn {

    constructor(idElement) {
        this.data = [];
        this.originalInput = document.getElementById(idElement);
        this.container = this.originalInput.closest('.container');
        this.container.classList.add('unselect-text');

        this.fakeSelect = null; // imita la apariencia y comportamiento de un elemento select;
        this.keyboardInput = null; // caja invisible que captura el teclado
        this.boxTables = null; // caja que contiene la tabla
        this.tBody = null; // caja que contiene la tabla
        this.tHead = null; // caja que contiene el nombre de las columnas
        this.rows = []; // continene todos los elementos tr para facilitar las busquedas.   
        this._typedText = ''; // contiene el texto ingresado en keyboardInput
        this._totalMatch = 0; // guarda la cantidad de registros conincidentes con lo tipeado
        this._oldIndexPosition = 0;// guarda la ultima posicion del puntero
        this._indexPosition = 0; // guarda la posicion del puntero
        this._mapMatchs = new Map();
        this._nameColumuns = [];
        this._allowBlockCollapse = true;

    }

    setDataJson(data) {
        this.data = data;
    }

    _iterateColumns(arr, callback) {
        for (let i = 0; i < arr.length; i++) {
            let qs = '.container table td:nth-child(' + (i + 1) + ')';
            Array.from(document.querySelectorAll(qs)).forEach(elem => {
                if (elem !== null) {
                    callback(elem, arr[i]);
                }
            });
        }
    }

    setColumnsWidth(arr) {
        this._iterateColumns(arr, function (elem, val) {
            val += 'px';
            elem.style.minWidth = val;
            elem.style.maxWidth = val;
            elem.style.width = val;
        });
    }

    setColumnsTextAlign(arr) {
        this._iterateColumns(arr, function (elem, val) {
            elem.style.textAlign = val;
        });
    }

    setMaxWidth(w) {
        this.boxTables.style.maxWidth = w + 'px';
    }

    setMaxHeight(h) {
        this.boxTables.style.maxHeight = h + 'px';
    }

    setNameColumns(n) {
        this._nameColumuns = n;
    }

    run() {
        //TODO: Definir ancho de las tablas automaticamente... console.log(this.originalInput.offsetWidth);
               
        // inicializa _totalMatch con la misma cantidad de registros.
        this._totalMatch = this.data.length;
        // crea el elemento que emulara el componente select
        this._makeFakeSelect();

        this._prepareTables();
        // crea la tabla con las filas de acuerdo a la variable data
        this._makeTBody();

        // crea la cabecera
        if (this._nameColumuns.length > 0) {
            this._makeTHeader();
        }

        // asigna eventos para establecer el comportamiento del componete
        this._behavior();
        // actualiza las coincidencias
        this._actualizeMatchs();
        // Actualiza el componente de acuerdo a los cambios
        this._updateChanges();
    }

    _makeFakeSelect() {
        // agraga la clase css que bloquea(no siempre funciona) la seleccion de texto en el elemento
        this.originalInput.classList.add('unselect-text');
        // crea el falso elemento select
        this.fakeSelect = document.createElement('div');
        this._copyNodeStyle(this.originalInput, this.fakeSelect);
        this.fakeSelect.className = this.originalInput.className;

        this.fakeSelect.contenteditable = true;
        // crea el input transparente encargado de capturar el teclado
        this.keyboardInput = this.originalInput.cloneNode(false);
        this.keyboardInput.spellcheck = false; // TODO: add autocomplete='off' autocorrect='off' autocapitalize='off' 
        this.keyboardInput.value = '';
        this.keyboardInput.dataset.dataValue = '';
        this.keyboardInput.id = null;
        this.keyboardInput.addEventListener('keyup', this._resolveKeyUp.bind(this));

        this.keyboardInput.className = 'keyboard-input fake-select collapsed';
        this.container.appendChild(this.fakeSelect);
        this.container.appendChild(this.keyboardInput);
        // oculta el input original
        this.originalInput.type = 'hidden';
    }

    _prepareTables() {
        this.boxTables = document.createElement('div');
        this.boxTables.className = 'box-tables';
        this.boxTHead = document.createElement('div');
        this.boxTHead.className = 'box-tbody';
        this.boxTBody = document.createElement('div');
        this.boxTBody.className = 'box-tbody';

        this.tHead = document.createElement('table');
        this.tHead.className = 'thead';
        this.tBody = document.createElement('table');
        this.tBody.className = 'tbody';


        this.boxTHead.appendChild(this.tHead);
        this.boxTBody.appendChild(this.tBody);

        this.boxTables.appendChild(this.boxTHead);
        this.boxTables.appendChild(this.boxTBody);

        this.container.appendChild(this.boxTables);
    }

    // TODO: Mejorar este bodrio y encontrar la manera de obtener ancho real de columnas
    _makeTHeader() {
        var tr = document.createElement('tr');
        for (let i = 0; i < this._nameColumuns.length; i++) {
            let td = document.createElement('td');
            td.innerHTML = this._nameColumuns[i];
            tr.appendChild(td);
        }
        this.tHead.appendChild(tr);
    }

    // TODO: Mejorar este bodrio y encontrar la manera de obtener ancho real de columnas
    _calculateColumnWidth() {
        var tdsTHead = this.tHead.querySelectorAll('tr:first-of-type td');
        var tdsTBody = this.tBody.querySelectorAll('tr:first-of-type td');
        for (let i = 0; i < this._nameColumuns.length; i++) {
            tdsTHead[i].style.width = tdsTBody[i].offsetWidth + 'px';
        }
    }

    _makeTBody() {
        // Recorre las filas
        for (let i = 0; i < this.data.length; i++) {
            let tr = document.createElement('tr');
            let row = this.data[i]; // obtiene un array tipo [id, [col1, col2, col2, ...]]
            var cols = row[1];
            // Recorre las columnas
            for (let i = 0; i < cols.length; i++) {
                let td = document.createElement('td');
                td.innerHTML = cols[i];
                tr.appendChild(td);
            }
            // establece los atributos dataset
            tr.dataset.id = row[0];
            tr.dataset.value = cols[0];
            tr.onclick = this._resolveClick.bind(this);

            this.tBody.appendChild(tr);
            // crea objeto utilizado en las iteraciones de busqueda
            this.rows.push(tr);
        }
    }

    _resolveKeyUp(event) {
        var key = event.keyCode || event.which;

        var pattern = new RegExp(/^[a-z0-9 ñáéíóú\-_]+$/i);// Importante: el documento debe tener codificacion UTF-8 
        var char = this.keyboardInput.value;
        this.keyboardInput.value = '';// borra el contenido del input

        //TODO:  Si es pulsada la tecla SPACE antes que cualquier otra tecla se expande el componente
        if (key === 32 && this._typedText.length === 0) {
            this._showTable();
            return;
        }

        if (char.match(pattern)) {
            this._typedText = this._typedText + char;

            // llama al metodo que actualiza las coincidencias 
            // sino encuentra vuelve a llamar reseteando el parametro de busqueda
            if (!this._actualizeMatchs()) {
                this._typedText = '';
                this._actualizeMatchs();
            }
            // devuelve el puntero a la posicion inicial
            this._indexPosition = 0;
            this._oldIndexPosition = 0;
            // Actualiza el componente de acuerdo a los cambios
            this._updateChanges();

            return;
        }

        // Si son pulsadas pulsadas las TECLAS  ENTER o ESCAPE colapsa el componente
        if (key === 13 || key === 27) {
            this._hideTable();
            return;
        }

        // llama al metodo responsable de teclas de desplazamiento
        if (key >= 33 && key <= 40) {
            if (this._movePointerPosition(key)) {
                // Actualiza el componente de acuerdo a los cambios
                this._updateChanges();
            }
        }
        return;
    }

    _resolveClick(e) {
        this._oldIndexPosition = this._indexPosition;
        // devuelve el foco a la caja de entrada
        this.keyboardInput.focus();

        var row = e.currentTarget;
        this._indexPosition = parseInt(row.dataset.index);
        this._updateChanges();
        return;
    }

    _movePointerPosition(key) {
        // 13=ENTER 27=ESC, 33=REPAG, 34=AVPAG, 35=END, 36=HOME, 37=LEFT, 38=UP, 39=RIGHT, 40=DOWN 
        this._oldIndexPosition = this._indexPosition;
        //TODO 33 y 34
        switch (key) {
            case 38:
                this._indexPosition--;
                break;
            case 40:
                this._indexPosition++;
                break;
            case 36:
                this._indexPosition = 0;
                break;
            case 37:
                this._indexPosition = 0;
                break;
            case 35:
                this._indexPosition = this._totalMatch - 1;
                break;
            case 39:
                this._indexPosition = this._totalMatch - 1;
                break;
        }

        // Enmarca los límites de la seleccion
        if (this._indexPosition < 0) {
            this._indexPosition = (this._totalMatch - 1);
        } else if (this._indexPosition > (this._totalMatch - 1)) {
            this._indexPosition = 0;
        }
        return this._oldIndexPosition !== this._indexPosition;// devuelve true cuando el puntero cambia, false sino
    }

    _actualizeMatchs() {
        this._totalMatch = 0;
        // Resetea el arreglo que contiene objetos
        this._mapMatchs.clear();
        // convierte el valor tipeado en minusculas
        var _search = this._typedText.toLowerCase();
        var i = 0;
        // Recorre todas las filas en busca de valores coincidentes con lo tipeado 
        this.rows.forEach(function (row) {
            let dataValue = row.dataset.value.toLowerCase();
            // compara el texto tipeado con los valores de las filas y oculta los que no coinciden
            if (_search === dataValue.substr(0, _search.length) || _search === '') {
                row.style.display = 'table-row';
                row.dataset.index = i;
                this._mapMatchs.set(i, row);
                this._totalMatch++;
                i++;
            } else {
                row.dataset.index = null;
                row.style.display = 'none';
            }
            row.className = 'unselected-row';
        }.bind(this));

        return this._totalMatch > 0;
    }

    _updateChanges() {
        this._updateEntry();
        this._highlightSelectedRow();
        this._adjustScroll();
    }

    _updateEntry() {
        // muestra la cadena tipeada hasta el momento
        var len = this._typedText.length;
        let str = this._mapMatchs.get(this._indexPosition).dataset.value;
        // this.fakeSelect.querySelector('.text').innerHTML = '<b>' + str.substr(0, len) + '</b>' + str.substr(len);
        this.fakeSelect.innerHTML = '<b>' + str.substr(0, len) + '</b>' + str.substr(len);
        // Establece el valor que se enviara en el formulario
        this.originalInput.value = this._mapMatchs.get(this._indexPosition).dataset.id;
    }

    _highlightSelectedRow() {
        this._mapMatchs.get(this._oldIndexPosition).className = 'unselected-row';
        this._mapMatchs.get(this._indexPosition).className = 'selected-row';
    }

    _adjustScroll() {
        var row = this._mapMatchs.get(this._indexPosition);

        var container = this.boxTBody;
        var tableHeight = container.offsetHeight;

        var rowHeight = row.offsetHeight;
        var rowTop = row.offsetTop;// Posición real del elemento

        // Desplaza el scroll si la posición del puntero esta fuera de los bordes
        if (rowTop <= container.scrollTop) {
            container.scrollTop = rowTop;
        }
        if (rowTop >= (container.scrollTop + tableHeight) - rowHeight) {
            container.scrollTop = (rowTop - tableHeight + rowHeight);
        }
    }

    //COMPORTAMIENTO:
    // al hacer clic se expande
    // al recibir el foco por la tecla tab se mantiene igual
    // al presionar la tecla espacio se expande
    // al perder el foco se colapsa
    // al hacer pulsar enter cuando esta expandido se colapsa
    // al hacer pulsar enter cuando cuando esta colapsado se expande
    // al pulsar escape se colapsa
    // al pulsar tab estando expandido solo se colapsa
    // al presionar tab estando colapsado pierde el foco
    _behavior() {
        this.keyboardInput.onclick = function () {
            this._showTable();
        }.bind(this);

        this.keyboardInput.onkeydown = function () {
            // permite ocultar la tabla cuando se pierde el foco por un evento de teclado
            this._allowBlockCollapse = true;
        }.bind(this);

        this.keyboardInput.onblur = function () {
            if (this._allowBlockCollapse === true) {
                this._hideTable();
            }
        }.bind(this);

        this.tBody.onmouseenter = function () {
            this._allowBlockCollapse = false;
        }.bind(this);

        this.boxTables.onmouseleave = function () {
            this._allowBlockCollapse = true;
        }.bind(this);
    }

    _hideTable() {
        this.boxTables.style.display = 'none';
        this.keyboardInput.className = 'keyboard-input fake-select collapsed';

    }

    _showTable() {
        this.boxTables.style.display = 'block';
        this.keyboardInput.className = 'keyboard-input fake-select expanded';

        // Copia el ancho de las columnas desde TDody para THead 
        this._calculateColumnWidth();
    }

    _copyNodeStyle(sourceNode, targetNode) {
        const computedStyle = window.getComputedStyle(sourceNode);
        Array.from(computedStyle).forEach(key => targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)));
    }

}



// var tr = tbody.querySelector('tr:last-child');
// element.appendChild(a);
// element.setAttribute('style', 'visibility: hidden');            
// 
// element.className = 'name';
// element.dataset.classEnabled;            

// element.onclick = this.validateRenameFile.bind(this, file);
// element.style.display = 'none';
// element.classList.add('mystyle');
// 
//        Array.from(col).forEach(link => {
//            console.log(link[0], link[1]);
//        });
// 
// window.addEventListener('load', new SelectMultiColumn(), false);


//        this.keyboardInput.className = this.originalInput.className;
// setea los estilos en el nuevo elemento
//        this._copyNodeStyle(this.originalInput, this.keyboardInput);
//        var source = event.target || event.srcElement;
// La propiedad function.caller retorna la función que llamó a la función especificada
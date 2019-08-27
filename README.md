# Select Multi Columns

Select Multi Columns es un componente web open source desarrollado para extender la funcionalidad de cualquier formulario.
Es un componente similar en funcionamiento y apariencia a un componente de tipo Select o ComboBox, pero además permite visualizar las opciones presentándolas en columnas lo que incrementa la cantidad de información relevante para los usuarios.

## Descripción

Select Multi Colummns no es un componente como tal ya que de momento no existe de manera nativa un componente de estas características, sin embargo es posible crear un elemento de manera artesanal utilizando algunos trucos combinandos tecnologias web.
Como cualquier otro componente de formulario posee los correspondientes atributos name y value para la recuperación de datos, su comportamiento está basado en la etiqueta select, por lo tanto posible interactuar con el elemento mediante teclado y mouse, además es posible adaptar su apariencia como se haría con cualquier otro componente.

![Image description](https://raw.githubusercontent.com/RichardCollao/SelectMultiColumns/master/docs/captura.png)

## Requerimientos
vanilla.js (ECMAScript 6)

## Implementación
Enlazar los archivos necesarios
```html
<script type="text/javascript" src="SelectMultiColumn.js"></script>
```
```html
<link href="SelectMultiColumn.css" rel="stylesheet" type="text/css"/>
```
Incluir el input sobre el cual se construira el componente customizado, se debe asignar el atributo "id" el cual debera ser pasado a la clase javascript en su constructor, es importante que este control este envuelto en una caja cuya clase sea container

```html
<div class="container">
            <input id="select_multi_column" type="text" value="" style="width:450px;" class="fake-select" />
</div>
```
Finalmente se inicializa la clase cuando el documento se ha cargado totalmente.

```javascript
<script type="text/javascript">
// el arreglo con los items debe tener la siguiente estructura
    var materials = [
        [719, ["Perfil AT 3m", "272,00", "tira", "Estructura Metalcom"]],
        [569, ["Perfil C 60*38*6*0.85mm x 2.4mt", "1.978,00", "tira", "Estructura Metalcom"]],
        [568, ["Perfil C 60*38*6*0.85mm x 3mt", "30,00", "tira", "Estructura Metalcom"]],
        [567, ["Perfil C 60*38*6*0.85mm x 4mt", "159,00", "tira", "Estructura Metalcom"]]
    ];

    var selectMultiColumn = new SelectMultiColumn("select_multi_column");
    selectMultiColumn.setDataJson(materials);
    selectMultiColumn.setNameColumns(['Material', 'Stock', 'Medida', 'Origen']);// opcional
    selectMultiColumn.run();
    selectMultiColumn.setColumnsTextAlign(['left', 'right', 'center', 'left']);
    selectMultiColumn.setColumnsWidth([235, 80, 50, 120]);
    selectMultiColumn.setMaxWidth(525);
    selectMultiColumn.setMaxHeight(300);
</script>
```

## Licencia
<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
    <img alt="Licencia de Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
</a>

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Reconocimiento-CompartirIgual 4.0 Internacional License</a>.

## Versionado
El proyecto utiliza SemVer para el versionado. Para todas las versiones disponibles, mira los tags en este repositorio.

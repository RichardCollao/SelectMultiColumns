# Select Multi Columns

Select Multi Columns es un componente web open source desarrollado para extender la funcionalidad de un formulario.
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
```html
Incluir el input sobre el cual se construira el componente customizado, es importante que este control este envuelto en una caja cuya clase sea container
<div class="container">
            <input id="select_multi_column" type="text" value="" style="width:450px;" class="fake-select" />
</div>
```
una vez cargado el documento 

## Licencia
<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
                <img alt="Licencia de Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
</a>

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Reconocimiento-CompartirIgual 4.0 Internacional License</a>.

## Versionado
El proyecto utiliza SemVer para el versionado. Para todas las versiones disponibles, mira los tags en este repositorio.

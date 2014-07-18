Molecular Formula Input
================

jquery plugin for chemical formula input. It converts the numbers to subscript in the input field to make it more user friendly

![preview](http://raw.githubusercontent.com/CHEMIO/molecularFormulaInput/master/docs/molecularFormula.png)

##Usage##

Simple usage

``` html
  <script src="PATH_TO_JQUERY/jquery.min.js" type="text/javascript"></script>
  <script src="PATH_TO_SRC/jquery.molecularFormula.js" type="text/javascript"></script>

  <script type="text/javascript">
      $("#input").molecularFormula();
  </script>
```

Or if you want to use it directly in your code for something different than input:

```
    return $.chemicalFormula('C12HN23')
    //Will return C₁₂HN₂₃
```

If you want to convert from subscript characters to plain text you can use:

```
    $.chemicalFormula($('#input').val(), true)
```
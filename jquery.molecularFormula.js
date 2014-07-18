/*
 *  value (string) - the molecular formula
 *  parse (boolean) - default false. If this parameter is provided it converts from H₂O to plain text H2O
 *                    it should be used on form submit to avoid adding sub characters in the database
 */
$.molecularFormula = function(value, parse) {
    var chars = '+−=()0123456789aeoxəijruvβγδφχ',
        sup   = '⁺⁻⁼⁽⁾⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵉᵒˣᵊⁱʲʳᵘᵛᵝᵞᵟᵠᵡ',  //For future use
        sub   = '₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₒₓₔᵢⱼᵣᵤᵥᵦᵧᵨᵩᵪ',
        self  = this;

    function sub_char(char) {
        var n=chars.indexOf(char)
        return n == -1 ? char : sub[n]
    }

    function normal_char(char) {
        var n=sub.indexOf(char)
        return n == -1 ? char : chars[n]
    }

    if (parse) {
        return value.replace(new RegExp('['+sub+']', "g"), function(x) {
            return x.split('').map(function(c) { return normal_char(c) }).join('')
        });
    } else {
        return value.replace(/[0-9]*/g, function(x) {
            return x.split('').map(function(c) { return sub_char(c) }).join('')
        });
    }
}

/*
 *   Usage:
 *     $('input.fomula').molecularFormula()
 */
$.fn.molecularFormula = function() {

    $(this).bind('keypress', function(e) {
        var char = String.fromCharCode(e.which)
        if (char.match(/\s/)) {
            e.preventDefault()
        }
        if (char.match(/[0-9]/)) {
            e.preventDefault()
            var old_sel = this.selectionStart
            this.value = [
                this.value.substring(0, this.selectionStart),
                $.molecularFormula(char),
                this.value.substring(this.selectionEnd)
            ].join('')
            this.selectionStart = this.selectionEnd = old_sel+1;
        }
    })

    return this.each(function() {
        this.value = $.molecularFormula(this.value)
    });
}
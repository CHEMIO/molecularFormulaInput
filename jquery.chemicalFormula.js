$.chemicalFormula = function(value, parse) {
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

$.fn.chemicalFormula = function() {

    $(this).bind('keypress', function(e) {
        var char = String.fromCharCode(e.which)
        if (char.match(/[0-9]/)) {
            e.preventDefault()
            var old_sel = this.selectionStart
            this.value = [
                this.value.substring(0, this.selectionStart),
                $.chemicalFormula(char),
                this.value.substring(this.selectionEnd)
            ].join('')
            this.selectionStart = this.selectionEnd = old_sel+1;
        }
    })

    return this.each(function() {
        this.value = $.chemicalFormula(this.value)
    });
}
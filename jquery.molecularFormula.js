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
    var elements = [
        'H', 'D', 'T', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl',
        'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As',
        'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In',
        'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb',
        'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl',
        'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk',
        'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Uut',
        'Fl', 'Uup', 'Lv', 'Uus', 'Uuo'
    ]

    var _helper, _q, _this = this

    function helper() {
    }

    function getResults(str) {
        return elements.filter(function (entry) {
            return entry.match(new RegExp('^'+str, 'gi')) && formulaElements().indexOf(entry) == -1
        }).sort();
    }

    function showAutocomplete(str) {
        if (!str) return
        _helper = _helper || $('<ul class="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content"></ul>').appendTo('body')
        _q = str
        _helper.html('<li>'+_q+'</li>')
        var txtWidth = _helper.outerWidth()
        var results = getResults(str)
        if (results.length <= 1) {
            hideAutocomplete()
            return results.length > 0
        }

        _helper.css({top: _this.offset().top+_this.outerHeight(), left: _this.offset().left+txtWidth })

        _helper.html('').show()
        for (var i=0; i < results.length; i++) {
            _helper.append($('<li class="ui-menu-item">'+results[i]+'</li>'))
        }
        selectAutocomplete(0)
        return results.length > 0
    }

    function hideAutocomplete() {
        if (_helper) _helper.html('').hide()
    }

    function selectAutocomplete(i) {
        if (_helper.find('li').length == 0) return
        _helper.find('li').removeClass('ui-state-focus')
        var el = isNaN(i) ? i : _helper.find('li:nth-child('+(i+1)+')')
        el.addClass('ui-state-focus')
        var append = el.html().replace(_q,'')

        var old_sel = _this[0].selectionStart
        _this.val([ _this.val().substring(0, _this[0].selectionStart), append, _this.val().substring(_this[0].selectionEnd) ].join(''))
        _this[0].selectionStart = old_sel
        _this[0].selectionEnd = old_sel+append.length;
    }

    function selectPrevAutocomplete() {
        var el = _helper.find('li.ui-state-focus')
        if (el.length == 0) {
            selectAutocomplete(0)
        } else if (el.prev('li').length > 0) {
            selectAutocomplete(el.prev('li'))
        } else {
            selectAutocomplete(_helper.find('li:last'))
        }
    }

    function selectNextAutocomplete() {
        var el = _helper.find('li.ui-state-focus')
        if (el.length == 0 || el.next('li').length == 0) {
            selectAutocomplete(0)
        } else if (el.next('li').length > 0) {
            selectAutocomplete(el.next('li'))
        }
    }

    function isElement(str) {
        return str.match(new RegExp('^('+elements.join('|')+')'+'$'))
    }

    function lastPart() {
        var m = _this.val().substring(0, _this[0].selectionStart).match(/[a-zA-Z]+$/)
        return m ? m.toString() : ''
    }

    function formulaElements() {
        return _this.val().split(/[₀₁₂₃₄₅₆₇₈₉]+/).filter(function(n) { return n != ''})
    }

    $(this)
        .bind('keypress', function(e) {
            if (e.which == 13) return
            e.preventDefault();
            var char = String.fromCharCode(e.which)
            var prev_char = this.value[this.selectionStart-1]

            if (!char.match(/[0-9a-zA-Z]/)) {
                return
            } else if (char.match(/[0-9]/)) {
                if (!prev_char) return
                char = $.molecularFormula(char)
                if (_helper.is(':visible')) this.selectionStart = this.selectionEnd
                hideAutocomplete()
            } else if (char.match(/[a-zA-Z]/)) {
                var last3 = this.value.substring(this.selectionStart-3, this.selectionStart)
                if (last3.length == 3 && !last3.match(/[₀-₉]/)) return
                if (!prev_char || prev_char.match(/[₀-₉]/) || (!isElement(lastPart()+char) && isElement(lastPart())) ) {
                    char = char.toUpperCase()
                } else {
                    char = char.toLowerCase()
                }
            }
            var old_sel = this.selectionStart

            if (char.match(/[a-zA-Z]/) && !showAutocomplete(lastPart()+char)) {
                char = char.toUpperCase()
            }

            this.value = [ this.value.substring(0, this.selectionStart), char, this.value.substring(this.selectionEnd) ].join('')
            this.selectionStart = this.selectionEnd = old_sel+1;
            selectAutocomplete(0)
            $(this).trigger('change')
            return false;
        })
        .bind('paste', function(e) {
            var v = $.molecularFormula(e.originalEvent.clipboardData.getData("text/plain"))
            setTimeout(function() { e.target.value = v; }, 1)
        })
        .bind('keydown', function(e) {
            if (_helper && _helper.is(':visible'))  {
                if (e.which == 38) {             //uparrow
                    e.preventDefault()
                    selectPrevAutocomplete()
                } else if (e.which == 40) {      //down arrow
                    e.preventDefault()
                    selectNextAutocomplete()
                } else if (e.which == 39) {      //right arrow
                    hideAutocomplete()
                } else if (e.which == 37) {      //left arrow
                    hideAutocomplete()
                } else if (e.which == 13) {      // Enter
                    e.preventDefault()
                    this.selectionStart = this.selectionEnd
                    hideAutocomplete()
                }
            }
        })
        .bind('keyup', function(e) {
            if (e.which == 8) {       //backspace
                if (str = lastPart()) {
                    if (getResults().indexOf(str) == -1) {
                        var oldSel = this.selectionStart
                        this.value = [ this.value.substring(0, this.selectionStart-1), this.value.substring(this.selectionStart) ].join('')
                        this.selectionEnd = this.selectionStart = oldSel-1
                        if (str = lastPart())
                            showAutocomplete(str)
                        else
                            hideAutocomplete()
                    } else {
                        showAutocomplete(str)
                    }
                } else {
                    hideAutocomplete()
                }
            }
        })
        .bind('blur', function() {
            hideAutocomplete()
        })
        .bind('focus', function() {
            setTimeout(function() {
                showAutocomplete(lastPart())
            }, 1) //selectionStart = returns 0 if used without timeout
        })
        .attr('autocomplete','off')

    return this.each(function() {
        this.value = $.molecularFormula(this.value)
    });
}
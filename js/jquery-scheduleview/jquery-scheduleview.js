(function($) {
    $.fn.scheduleview = function(options) {
        // Establish our default settings
        var settings = $.extend({
            schedules: [],
            selected: "",
            src_prefix: '',
        toggle: function(elementId, imgStarId) {
            var src;
            var rnd = new Date().getTime();
            if ($('#' + imgStarId).hasClass('selected')) {
                $('#' + imgStarId).removeClass('selected')
                src = 'js/jquery-scheduleview/images/gray-star.png?' + rnd;
                $('#' + imgStarId).attr('src', src)
            } else {
                $('#' + imgStarId).addClass('selected')
                src = 'js/jquery-scheduleview/images/yellow-star.png?' + rnd;
                $('#' + imgStarId).attr('src', src)
            }
        }
        }, options);

        String.prototype.repeat = function(num) {
            return new Array(num + 1).join(this);
        }

        return this.each(function() {
            window['scheduleViewSelect'] = settings.toggle;

            var items = settings.schedules
            items.sort(function(a, b) {
                var blank = ' '
                var str1 = (a.where + blank.repeat(1024)).substr(0, 1024) + a.date + a.hour;
                var str2 = (b.where + blank.repeat(1024)).substr(0, 1024) + b.date + b.hour + b.where;
                if (str1 == str2)
                    return 0;
                else if (str1 < str2)
                    return -1;
                else if (str1 > str2)
                    return 1;
            });
            
            var where_images = {}
            for (var k in items) {
                var el = items[k]
                if ( el.image != '') {
                    where_images[el.where] = settings.src_prefix + el.image;
                }
            }
            console.log('where_images = ', where_images, ' | items = ', items)
            
            var lastDate = ''
            var lastWhere = ''
            for (var k in items) {
                var el = items[k]
                var hour = el.hour;

                if (lastWhere != el.where && el.where != '') {
                    var bgstyle = ''
                    if (where_images[el.where]!=undefined) bgstyle ='style="height: 128px; background: transparent url('+ where_images[el.where] +') no-repeat center center ;-webkit-background-size: cover; -moz-background-size: cover;-o-background-size: cover; background-size: cover;"';
                    var item = '<div id="where-' + k + '" class="schedule-where" '+bgstyle+'><div style="background-color: #333333; opacity: 0.7;color: #ffffff; top: 0px; height: 40px; font-size: large; vertical-align: middle;">' + el.where + '</div></div>'
                    $(this).append(item)
                    lastWhere = el.where;
                    lastDate = '';
                }

                if (lastDate != el.date) {
                    var item = '<div id="date-' + k + '" class="schedule-date"><strong>' + el.date + '</strong></div>'
                    $(this).append(item)
                    lastDate = el.date;
                }

                var rnd = new Date().getTime();
                var src = 'js/jquery-scheduleview/images/gray-star.png?' + rnd;
                var starClass = ''
                if ((',' + settings.selected + ',').indexOf(',' + el.id + ',') > -1) {
                    src = 'js/jquery-scheduleview/images/yellow-star.png?' + rnd;
                    starClass = 'class="selected"'
                }

                item = '<table class="schedule-table">';
                item += '<tr>';
                item += '<td class="first"><strong>' + hour + '</strong></td>';
                item += '<td># ' + +el.id + ' - ' + el.html + '</td>';
                item += '<td class="star"><img id="schedule-star-' + el.id + '" src="' + src + '"  ' + starClass + '/></td>';
                item += '</tr>';
                item += '</table>';
                $(this).append(item)
                $('#schedule-star-' + el.id).click(function() {
                    var imgStarId = this.id;
                    var elementId = imgStarId.replace('schedule-star-', '')
                    scheduleViewSelect(elementId, imgStarId)
                });

            } // fin boucle for


        });
    };
}(jQuery));


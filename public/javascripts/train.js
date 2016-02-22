var w = 500;
var h = 350;
var max = 1715;
var min = 1545;
var diff = max - min;

var now = Date.today().toString("yyyyMMdd");
var thirtyDaysAgo = Date.today().add(-30).days().toString("yyyyMMdd");
var url = "/api/times/"+thirtyDaysAgo+"/"+now;

d3.json(url, function(error, json) {
    if (error) return console.warn(error);
    var data = json;

    var datakeys = Object.keys(data);
    var dataset = datakeys.map(function(v) { return Date.parse(data[v]).toString("HHmm"); });

    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return ((d-1630)>=0?"+"+(d-1630):(d-1630)) + " minutes"; });

    var svg = d3.select('#chart')
        .append('svg')
        .attr('height', h)
        .attr('width', w);

    svg.call(tip);

    var yscale = d3.scale.linear()
                    .domain([min,max])
                    .range([h-50,0]);

    var xshift = function(key) {
        return new TimeSpan(Date.parseExact(key, "yyyyMMdd") - Date.parseExact(datakeys[0], "yyyyMMdd")).days;
    };

    var circles = svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle');

    circles.attr('cx', function(d, i) {
            return (xshift(datakeys[i]) * 15) + 30;
        })
        .attr('cy', function(d, i) {
            return yscale(d) + 25;
        })
        .attr('r', function(d) {
            return 5;
        })
        .attr('fill', 'transparent')
        .attr('stroke', function(d) {
            if (max-d > (diff/4)*3) {
                return '#A5B883';
            } else if(max-d > (diff/4)*2) {
                return '#5CC270';
            } else if(max-d == (diff/2)) {
                return '#13AB9F';
            } else if(max-d > (diff/4)) {
                return '#376EC2';
            } else {
                return '#7155B8';
            }

        })
        .attr('stroke-width', 3)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

});

var formPost = function() {
    $.post('/api/times', $('.password').serialize(), function() {
        location.reload();
    });
};

var showPass = function() {
    var pass = $('.password');
    if (pass.attr('type') == 'password') {
        pass.attr('type', 'text');
        $('.fa-eye').addClass('fa-eye-slash').removeClass('fa-eye');
    }
    else {
        pass.attr('type', 'password');
        $('.fa-eye-slash').addClass('fa-eye').removeClass('fa-eye-slash');
    }
};

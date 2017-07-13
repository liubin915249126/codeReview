var labelType, useGradients, nativeTextSupport, animate;
var moving = false;
(function () {
    var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
        typeOfCanvas = typeof HTMLCanvasElement,
        nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
        textSupport = nativeCanvasSupport
            && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
    elem: false,
    write: function (text) {
        if (!this.elem)
            this.elem = document.getElementById('log');
        this.elem.innerHTML = text;
        this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
    }
};

var st;
function init(data,typeFlag) {
    //init data

    var json = data;

    //end
    //init Spacetree
    //Create a new ST instance

     st = new $jit.ST({
        //id of viz container element
        injectInto: 'infovis',
        //set duration for the animation
        duration: 800,
        //set animation transition type
        transition: $jit.Trans.Quart.easeInOut,
        levelsToShow: 1,
        //set distance between node and its children
        levelDistance: 40,
        //enable panning
        orientation: "top",
        Navigation: {
            enable: true,
            panning: true
        },
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            height: 229,
            width: 140,
            type: 'rectangle',
            color: '#fff',
            overridable: true
        },

        Edge: {
            type: 'bezier',
            overridable: true
        },
        /*      onBeforeCompute: function(node){
         Log.write("loading " + node.name);
         },

         onAfterCompute: function(){
         Log.write("done");
         },*/

        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function (label, node) {
            label.id = node.id;
            var str1 = '<div class="firstLevel" data-staffno="" data-name="" style="cursor:pointer"><span class="name">&nbsp;</span><span class="img"><img src="" ondragstart="return false;"></span></div>';

            var $template1 = $(str1);
            var imgUrl = urlConnect(node.data.staffNo);
            $template1.attr("data-staffno", node.data.staffNo);
            $template1.attr('data-name', node.data.staffName);
            $template1.find('.img img').attr('src', imgUrl);
            if (node.data.staffName) {
                $template1.find('.name').text(node.data.staffName);
            } else {
                $template1.find('.name').text('无')
            }

            if (!node.data.isCurrent) {
            	var url = mngPerspectiveUrl;// + node.data.staffNo;
                $template1.find('.J_menuItem').attr("data-url", url);
                $template1.find('.J_menuItem').attr("name", node.data.staffName);
            } else {
                $template1.addClass('current');
            }

            var str11 = '<div class="firstLevel" data-staffno="" style="cursor:default"><span class="name">&nbsp;</span><span class="img"><img src="" ondragstart="return false;"></span></div>';

            var $template11 = $(str11);
            var imgUrl = urlConnect(node.data.staffNo);
            $template11.attr("data-staffno", node.data.staffNo);
            $template11.find('.img img').attr('src', imgUrl);
            if (node.data.staffName) {
            	$template11.find('.name').text(node.data.staffName);
            } else {
            	$template11.find('.name').text('无')
            }
            //if (!node.data.isCurrent) {
            //	var url = mngPerspectiveUrl;// + node.data.staffNo;
            //	$template11.find('.J_menuItem').attr("data-url", url);
            //	$template11.find('.J_menuItem').attr("name", node.data.staffName);
            //} else {
            //	$template11.addClass('current');
            //}
            

            var str2 = '<div class="len4-wrap" data-staffno="" data-level="" data-name=""><div class="main-wrap"><span class="staffNo" style="display:none;"></span>' +
                '<div class="main1" ondragstart="return false;"><span class="name">&nbsp;</span>' +
                '<span class="img"><img src="" ondragstart="return false;"></span></div>' +
                '<div class="main2">' +
                '<div style="cursor:default" class="ellipsis"><span>职级:</span><span class="degree" >&nbsp;</span></div>' +
                '<div style="cursor:default" class="ellipsis"><span>序列:</span><span class="sequence ">&nbsp;</span></div>' +
                '<div style="cursor:default" class="ellipsis"><span>岗位:</span><span class="deptName" data-toggle="tooltip" data-placement="right" title="">&nbsp;</span></div>' +
                //'<div>年龄:<span class="age">&nbsp;</span>岁</div>' +
                //'<div>司龄:<span class="divisionAge">&nbsp;</span>年</div></div>' +
				'<div style="text-align:center;" class="idpLink"  data-staffno="" data-name="" ondragstart="return false;"><span style="color:#337ab7;">查看职业发展</span></div></div>' +
                '<div class="arrow" id="addNode" data-nodeFlag="true"><i class="fa fa-sort-down">&nbsp;</i></div></div>' + '</div>';

            var $template2 = $(str2);
            $template2.find('.staffNo').text(node.data.staffNo);
            $template2.find('.name').text(node.data.staffName);
            $template2.find('.degree').text(node.data.gradeDescr);
            $template2.find('.sequence').text(node.data.jobFunctionDescr);
            $template2.find('.deptName').text(node.data.positionDescr);
            //tooltip
            $template2.find('.deptName').attr('title',node.data.positionDescr);
            $template2.find('.age').text(node.data.age);
            $template2.find('.divisionAge').text(node.data.serviceYear);
            var url = mngPerspectiveUrl
            $template2.find('.move').attr("data-url", url);
            $template2.attr("data-staffno", node.data.staffNo);
            $template2.find('.move').attr("name", node.data.staffName);
            $template2.attr('data-name', node.data.staffName)
            var imgUrl = urlConnect(node.data.staffNo);
            $template2.find('.img img').attr('src', imgUrl);
            $template2.find('.idpLink').attr("data-staffno", node.data.staffNo);
            $template2.find('.idpLink').attr("data-name", node.data.staffName);

            if (typeFlag == 'hrbp') {
                $template2.find('.idpLink span').text('查看个人详情')
            }

            if (node.data.childrenCount <= 0) {
                $template2.find('#addNode').addClass('arroNone');
            }
            $template2.attr('data-level', node._depth);
            //拼接url
            function urlConnect(staffNo) {
                return '/TalentManagement/EmpInfo/GetPortrait?staffNo=' + staffNo;
                
            }
            if (node.data.isRoot) {
            	if (node.data.isCurrent) {
            		//添加链接
            		$(label).append($template11);
            	} else {
            		$(label).append($template1);
            	}
            } else {
            	$(label).append($template2);
            }
            //set label styles
            var style = label.style;
            style.width = 90 + 'px';
            style.height = 40 + 'px';
            style.cursor = 'pointer';
            style.color = '#333';
            style.fontSize = '0.8em';
            style.textAlign = 'center';
            style.paddingTop = '3px';
        },

       
        onBeforePlotLine: function (adj) {
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = " #376e3d";
                adj.data.$lineWidth = 3;
            }
            else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        }
    });
    //load json data
    st.loadJSON(json);
    //compute node positions and layout
    st.compute();
    //optional: make a translation of the tree
    st.geom.translate(new $jit.Complex(-200, 0), "current");
    //emulate a click on the root node.
    st.onClick(st.root);
    //end
    //Add event handlers to switch spacetree orientation.
}

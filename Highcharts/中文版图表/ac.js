var $=function(a){return document.getElementById(a)}

Array.prototype.numericSortReverse = function(data){
    this.sort(function(a, b){
        return data[b] - data[a];
    });
}

Array.prototype.max = function() {
	return Math.max.apply({},this);
};

Array.prototype.min = function() {
    return Math.min.apply({},this);
};

var 图表={
    ctx : 0,
    width : 600,
    height : 450,
    
    numberOfDecimals : 0,
    series:0,
    proportionalSizes : true,
    widthSizeFactor : 1.5,
    heightSizeFactor : 1.125,
    
    chartType : '柱图',

    animate : '动画',
    animationFrames : 60,
    
    marginTop : 10,
    marginBottom : 10,
    marginLeft : 10,
    marginRight : 10,
    
    labelMargin : 10,
    dataValueMargin : 20,
    titleMargin : 10,
    yAxisLabelMargin : 5,
    
    data : [],
    labels : [],
    colors : ['red','blue'],
    title : 0,
	chartBackgroundFillStyle : function(){
		var t=this.ctx.createLinearGradient(0,0,0,this.height);
		t.addColorStop(0.2, '#fdfdfd');
		t.addColorStop(0.8, '#ededed');
		return t
	},
    
    backgroundFillStyle : 'rgba(255,255,255,0)',
    borderStrokeStyle : 'rgba(255,255,255,0)',
    borderWidth : 1.0,
    
    labelFont : 'sans-serif',
    labelFontHeight : 12,
    labelFontStyle : '',
    
    dataValueFillStyle : '#333',
    dataValueFont : 'sans-serif',
    dataValueFontHeight : 15,
    dataValueFontStyle : '',
    
    titleFillStyle : '#333',
    titleFont : 'sans-serif',
    titleFontHeight : 16,
    titleFontStyle : 'bold',
    
    yAxisLabelFillStyle : '#333',
    yAxisLabelFont : 'sans-serif',
    yAxisLabelFontHeight : 10,
    yAxisLabelFontStyle : '',
    chartBorderStrokeStyle : '#999',
    chartBorderLineWidth : 1,
    chartHorizontalLineStrokeStyle : '#999',
    chartHorizontalLineWidth : 1,
    chartVerticalLineStrokeStyle : '#999',
    chartVerticalLineWidth : 1,
    
    chartMarkerSize : 5,
    
    chartPointRadius : 4,
    chartPointFillStyle : 'rgb(150, 36, 0)',
    
    chartLineStrokeStyle : 'rgba(150, 36, 0, 0.5)',
    chartLineWidth : 2,
    
    barStrokeStyle : '#fff',
    barBorderWidth : 2.0,
    barShadowColor : 'rgba(0, 0, 0, 0.5)',
    barShadowBlur : 5,
    barShadowOffsetX : 3.0,
    barShadowOffsetY : 0.0,
    
    barHGap : 20,
    barVGap : 20,
    
    explosionOffset : 20,

    pieStrokeStyle : '#fff',
    pieBorderWidth : 2.0,
    pieShadowColor : 'rgba(0, 0, 0, 0.5)',
    pieShadowBlur : 5,
    pieShadowOffsetX : 3.0,
    pieShadowOffsetY : 0.0,
    
    pieStart : 0,
    pieTotal : null,
    
    画 : function(){
		var root=this;
		
		var setChartDataFromJSON = function(jsonObj){
		   for(var p in jsonObj){
			   root.labels.push(p);
			   root.data.push(jsonObj[p]);
		   }
		};
		setChartDataFromJSON(this.series);
		
		this.ctx.canvas.width=600;
		this.ctx.canvas.height=450;
        var context = this.ctx;
        context.lineCap = 'round';
        var minFactor = Math.min(this.widthSizeFactor, this.heightSizeFactor);
        
        if(this.proportionalSizes){            
            this.labelMargin = this.labelMargin * this.heightSizeFactor;
            this.dataValueMargin = this.dataValueMargin * this.heightSizeFactor;
            this.titleMargin = this.titleMargin * this.heightSizeFactor;
            this.yAxisLabelMargin = this.yAxisLabelMargin * this.heightSizeFactor;
            
            this.labelFontHeight = this.labelFontHeight * minFactor;
            this.dataValueFontHeight = this.dataValueFontHeight * minFactor;
            this.titleFontHeight = this.titleFontHeight * minFactor;
            this.yAxisLabelFontHeight = this.yAxisLabelFontHeight * minFactor;
            
            this.barHGap = this.barHGap * this.widthSizeFactor;
            this.barVGap = this.barHGap * this.heightSizeFactor;
            this.explosionOffset = this.explosionOffset * minFactor;
        }
        
        var 选={
			饼图:{
				普通:function(){root.drawPieChart(false)},
				动画:function(){root.animatePieChart("pie")},
			},
			环图:{
				普通:function(){root.drawPieChart(true)},
				动画:function(){root.animatePieChart("ring")},
			},
			分离饼图:{
				普通:function(){root.drawExplodedPieChart()},
				动画:function(){root.animatePieChart("exploded")},
			},
			横向柱图:{
				普通:function(){root.drawVerticalBarChart()},
				动画:function(){root.animateVerticalBarChart()},
			},
			柱图:{
				普通:function(){root.drawBarChart()},
				动画:function(){root.animateBarChart()},
			},
			帕累托图:{
				普通:function(){root.drawParetoChart()},
			},
			
		};
		选[this.chartType][this.animate]();
	
	
        this.drawTitleAndBorders();
        
    },
	



    drawTitleAndBorders : function() {
        var context = this.ctx;
        
        if(this.title!=null){
            //Draw the title:
            
            context.font = this.titleFontStyle + ' ' + this.titleFontHeight + 'px '+ this.titleFont;
            context.fillStyle = this.titleFillStyle;
            context.textAlign = 'center';
            context.textBaseline = 'bottom';
            context.fillText(this.title, this.width/2, this.marginTop+this.titleFontHeight, this.width-10);
        }
        
        //Draw the outer border:
        
        context.lineWidth = this.borderWidth;
        context.strokeStyle = this.borderStrokeStyle;
        context.strokeRect(0, 0, this.width, this.height);
        
        context.globalCompositeOperation = 'destination-over';
            
        //Fill the background:
        
        context.fillStyle = this.backgroundFillStyle;
        context.fillRect(0, 0, this.width, this.height);
        
        context.globalCompositeOperation = 'source-over';
    },



    drawBarChart : function(){
        var context = this.ctx;
        
        //Calculate bar size:
        
        var n = this.data.length;
        var maxData = this.data.max();
        var minData = this.data.min();
        
        var barWidth = (this.width - this.marginLeft
            - this.marginRight - (n-1) * this.barHGap) / n;
                            
        var barMaxTopY = this.marginTop + this.labelMargin + this.labelFontHeight + this.dataValueMargin + this.dataValueFontHeight;
        
        var barMinTopY = this.height - this.marginBottom;
        
        if(this.title!=null){
            barMaxTopY += this.titleFontHeight + this.titleMargin;
        }
        
        var barBottomY = this.height - this.marginBottom;
        
        if(minData<0){
        
            barMinTopY = this.height - this.marginBottom - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight;
            
            barBottomY =  barMinTopY + ((this.height - this.marginBottom -  barMaxTopY - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight) * minData) / (Math.abs(minData)+maxData);
            
        }
        
        
        var maxBarHeight = Math.max(Math.abs(barBottomY - barMaxTopY), Math.abs(barBottomY - barMinTopY));
        var maxBarAbsData = Math.max(Math.abs(minData), Math.abs(maxData));
        
        var x = this.marginLeft;
        var y = barBottomY;
        var barHeight = 0;
                
        var di = 0;
        for(var i=0; i<this.data.length; i++){
            di = this.data[i];
            
            barHeight = di * maxBarHeight / maxBarAbsData;
            
            //Draw the bar:
            
            context.fillStyle = this.colors[i%this.colors.length];
            context.strokeStyle = this.barStrokeStyle;
            context.lineWidth = this.barBorderWidth;
            
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, y - barHeight);
            context.lineTo(x + barWidth, y - barHeight);
            context.lineTo(x + barWidth, y);

            context.save();
            context.shadowOffsetX = this.barShadowOffsetX;
            context.shadowOffsetY = this.barShadowOffsetY;
            context.shadowBlur = this.barShadowBlur;
            context.shadowColor = this.barShadowColor;
            
            context.fill();
            context.restore();
            context.stroke();
            
            //Draw the label:
            
            context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
            context.fillStyle = this.colors[i%this.colors.length];
            context.textAlign = 'center';
            if(this.labels[i]){
                if(di>=0){
                    context.textBaseline = 'bottom';
                    context.fillText(this.labels[i], x + barWidth/2, barBottomY - barHeight - this.labelMargin, barWidth);
                }else{
                    context.textBaseline = 'top';
                    context.fillText(this.labels[i], x + barWidth/2, barBottomY - barHeight + this.labelMargin, barWidth);
                }
            }
            
            //Draw the data value:
            
            context.font = this.dataValueFontStyle + ' ' + this.dataValueFontHeight + 'px '+ this.dataValueFont;
            context.fillStyle = this.dataValueFillStyle;
            context.textAlign = 'center';
            if(di>=0){
                context.textBaseline = 'bottom';
                context.fillText(di, x + barWidth/2, barBottomY - barHeight - this.labelMargin - this.dataValueMargin, barWidth);
            }else{
                context.textBaseline = 'top';
                context.fillText(di, x + barWidth/2, barBottomY - barHeight + this.labelMargin + this.dataValueMargin, barWidth);
            }
            
            
            //Update x:
            
            x = x + barWidth + this.barHGap;
        }
    },



    animateBarChart : function() {
        var aw = this,
            numFrames = this.animationFrames,
            currentFrame = 0,
            
            maxData = this.data.max(),
            minData = this.data.min(),
            
            barMaxTopY = this.marginTop + this.labelMargin + this.labelFontHeight + this.dataValueMargin + this.dataValueFontHeight,
            barMinTopY = barBottomY = this.height - this.marginBottom;
        
        if(this.title!=null){
            barMaxTopY += this.titleFontHeight + this.titleMargin;
        }
        
        if(minData<0){
            barMinTopY = this.height - this.marginBottom - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight;
            
            barBottomY = barMinTopY + ((this.height - this.marginBottom -  barMaxTopY - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight) * minData) / (Math.abs(minData)+maxData);
        }
        
        var chartAreaHeight = barMinTopY - barMaxTopY,
            changeOfMarginBottom = 0,
            changeOfMarginTop = 0;
            
        var belowZeroMaxBarHeight = 0;
        if(minData<0){
            var maxBarHeight = Math.max(Math.abs(barBottomY - barMaxTopY), Math.abs(barBottomY - barMinTopY)),
                maxBarAbsData = Math.max(Math.abs(minData), Math.abs(maxData));
            belowZeroMaxBarHeight = Math.abs(minData * maxBarHeight / maxBarAbsData + this.labelMargin + this.labelFontHeight);
        }
        
        this.marginBottom += belowZeroMaxBarHeight;
        if(this.title!=null){
            this.titleMargin += chartAreaHeight - belowZeroMaxBarHeight;
        }else{
            this.marginTop += chartAreaHeight - belowZeroMaxBarHeight;
        }
        changeOfMarginBottom = belowZeroMaxBarHeight / numFrames;
        changeOfMarginTop = (chartAreaHeight - belowZeroMaxBarHeight) / numFrames;
        
        var updateBarChart = function() {
            if(currentFrame++ < numFrames) {

                aw.marginBottom -= changeOfMarginBottom;
                
                if(aw.title!=null){
                    aw.titleMargin -= changeOfMarginTop;
                }else{
                    aw.marginTop -= changeOfMarginTop;
                }
                
                aw.ctx.clearRect(0, 0, aw.width, aw.height);
                aw.drawBarChart();
                aw.drawTitleAndBorders();                
                
                // Standard
                if (typeof(window.requestAnimationFrame) == 'function') {
                    window.requestAnimationFrame(updateBarChart);

                // IE 10+
                } else if (typeof(window.msRequestAnimationFrame) == 'function') {
                    window.msRequestAnimationFrame(updateBarChart);

                // Chrome
                } else if (typeof(window.webkitRequestAnimationFrame) == 'function') {
                    window.webkitRequestAnimationFrame(updateBarChart);

                // Firefox
                } else if (window.mozRequestAnimationFrame) { // Seems rather slow in FF6 - so disabled
                    window.mozRequestAnimationFrame(updateBarChart);

                // Default fallback to setTimeout
                } else {
                    setTimeout(updateBarChart, 16.6666666);
                }
            }
        }        

        updateBarChart();
        
    },



    drawVerticalBarChart : function(){
        var context = this.ctx;

        context.save();
        context.translate(this.width/2, this.height/2);
        context.rotate(Math.PI/2);
        context.translate(-this.width/2, -this.height/2);
        
        //Calculate bar size:
        
        var n = this.data.length;
        var maxData = this.data.max();
        var minData = this.data.min();

        var marginLeft = this.marginLeft;
        if(this.title!=null){
            marginLeft += this.titleFontHeight + this.titleMargin;
        }
        
        var barWidth = (this.width - marginLeft - this.marginRight - (n-1) * this.barHGap) / n;

        context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
        var maxLabelWidth = 0;
        var labelWidth = 0;
        for(var i=0; i<this.labels.length; i++){
            labelWidth = context.measureText(this.labels[i]).width;
            if(labelWidth>maxLabelWidth){
                maxLabelWidth = labelWidth;
            }
        }

        context.font = this.dataValueFontStyle + ' ' + this.dataValueFontHeight + 'px '+ this.dataValueFont;
        var maxDataValueWidth = 0;
        var dataValueWidth = 0;
        for(var i=0; i<this.data.length; i++){
            dataValueWidth = context.measureText(this.data[i]).width;
            if(dataValueWidth>maxDataValueWidth){
                maxDataValueWidth = dataValueWidth;
            }
        }

        var barMaxTopY = this.marginTop + Math.max( (this.labelMargin + maxLabelWidth), (this.dataValueMargin + maxDataValueWidth) );
        
        var barMinTopY = this.height - this.marginBottom;
        
        var barBottomY = this.height - this.marginBottom;
        
        if(minData<0){
        
            barMinTopY = this.height - this.marginBottom - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight;
            
            barBottomY =  barMinTopY + ((this.height - this.marginBottom -  barMaxTopY - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight) * minData) / (Math.abs(minData)+maxData);
            
        }
        
        
        var maxBarHeight = Math.max(Math.abs(barBottomY - barMaxTopY), Math.abs(barBottomY - barMinTopY));
        var maxBarAbsData = Math.max(Math.abs(minData), Math.abs(maxData));
        
        var x = marginLeft;
        var y = barBottomY;
        var barHeight = 0;
                
        var di = 0;
        
        for(var i=0; i<this.data.length; i++){
            di = this.data[i];
            
            barHeight = di * maxBarHeight / maxBarAbsData;
            
            //Draw the bar:
            
            context.fillStyle = this.colors[i%this.colors.length];
            context.strokeStyle = this.barStrokeStyle;
            context.lineWidth = this.barBorderWidth;
            
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, y - barHeight);
            context.lineTo(x + barWidth, y - barHeight);
            context.lineTo(x + barWidth, y);

            context.save();
            context.shadowOffsetX = this.barShadowOffsetX;
            context.shadowOffsetY = this.barShadowOffsetY;
            context.shadowBlur = this.barShadowBlur;
            context.shadowColor = this.barShadowColor;
            
            context.fill();
            context.restore();
            context.stroke();
            
            //Draw the label:
            
            context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
            context.fillStyle = this.colors[i%this.colors.length];


            context.save();
            context.translate(x + barWidth/2, barBottomY - barHeight);
            context.rotate(-Math.PI/2);
            context.textBaseline = 'top';
            if(this.labels[i]){
                if(di>=0){
                    context.textAlign = 'left';
                    context.fillText(this.labels[i], this.labelMargin, 0);
                }else{
                    context.textAlign = 'right';
                    context.fillText(this.labels[i], -this.labelMargin, 0);
                }
            }

            //Draw the data value:
            
            context.font = this.dataValueFontStyle + ' ' + this.dataValueFontHeight + 'px '+ this.dataValueFont;
            context.fillStyle = this.dataValueFillStyle;
            context.textBaseline = 'bottom';
            if(di>=0){
                context.textAlign = 'left';
                context.fillText(di, this.labelMargin, 0);
            }else{
                context.textAlign = 'right';
                context.fillText(di, -this.labelMargin, 0);
            }
            
            context.restore();
            
            //Update x:
            
            x = x + barWidth + this.barHGap;
        }
        
        context.restore();
        
    },

    
    
    animateVerticalBarChart : function() {
        var aw = this,
            numFrames = this.animationFrames,
            currentFrame = 0,
            
            maxData = this.data.max(),
            minData = this.data.min(),
            dataLen = this.data.length,
            
            context = this.ctx,
            
            marginLeft = this.marginLeft
            marginTop = this.marginTop
            marginTopCurrent = 0;


        if(this.title!=null){
             marginLeft += this.titleFontHeight + this.titleMargin;
        }
        
        var barWidth = (this.width - marginLeft - this.marginRight - (dataLen-1) * this.barHGap) / dataLen;

        context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
        var maxLabelWidth = 0;
        var labelWidth = 0;
        for(var i=0; i<this.labels.length; i++){
            labelWidth = context.measureText(this.labels[i]).width;
            if(labelWidth>maxLabelWidth){
                maxLabelWidth = labelWidth;
            }
        }

        context.font = this.dataValueFontStyle + ' ' + this.dataValueFontHeight + 'px '+ this.dataValueFont;
        var maxDataValueWidth = 0;
        var dataValueWidth = 0;
        for(var i=0; i<dataLen; i++){
            dataValueWidth = context.measureText(this.data[i]).width;
            if(dataValueWidth>maxDataValueWidth){
                maxDataValueWidth = dataValueWidth;
            }
        }

        var barMaxTopY = this.marginTop + Math.max( (this.labelMargin + maxLabelWidth), (this.dataValueMargin + maxDataValueWidth) );
        
        var barMinTopY = this.height - this.marginBottom;
        
        var barBottomY = this.height - this.marginBottom;
        
        if(minData<0){
        
            barMinTopY = this.height - this.marginBottom - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight;
            
            barBottomY =  barMinTopY + ((this.height - this.marginBottom -  barMaxTopY - this.labelMargin - this.labelFontHeight - this.dataValueMargin - this.dataValueFontHeight) * minData) / (Math.abs(minData)+maxData);
            
        }
        
        
        var maxBarHeight = Math.max(Math.abs(barBottomY - barMaxTopY), Math.abs(barBottomY - barMinTopY));
        var maxBarAbsData = Math.max(Math.abs(minData), Math.abs(maxData));
        

        var belowZeroMaxBarHeight = 0;
        if(minData<0){
            belowZeroMaxBarHeight = Math.abs(minData * maxBarHeight / maxBarAbsData);
        }
        
        var chartAreaHeight = maxData * maxBarHeight / maxBarAbsData + belowZeroMaxBarHeight,
            changeOfMarginBottom = 0,
            changeOfMarginTop = 0;
        
        this.marginBottom += belowZeroMaxBarHeight;
        this.marginTop += chartAreaHeight - belowZeroMaxBarHeight;
        changeOfMarginBottom = belowZeroMaxBarHeight / numFrames;
        changeOfMarginTop = (chartAreaHeight - belowZeroMaxBarHeight) / numFrames;
        
        var updateVerticalBarChart = function() {
            if(currentFrame++ < numFrames) {

                aw.marginBottom -= changeOfMarginBottom;
                aw.marginTop -= changeOfMarginTop;
                
                aw.ctx.clearRect(0, 0, aw.width, aw.height);
                aw.drawVerticalBarChart();
                
                marginTopCurrent = aw.marginTop;
                aw.marginTop = marginTop;
                aw.drawTitleAndBorders();
                aw.marginTop = marginTopCurrent;
                
                // Standard
                if (typeof(window.requestAnimationFrame) == 'function') {
                    window.requestAnimationFrame(updateVerticalBarChart);

                // IE 10+
                } else if (typeof(window.msRequestAnimationFrame) == 'function') {
                    window.msRequestAnimationFrame(updateVerticalBarChart);

                // Chrome
                } else if (typeof(window.webkitRequestAnimationFrame) == 'function') {
                    window.webkitRequestAnimationFrame(updateVerticalBarChart);

                // Firefox
                } else if (window.mozRequestAnimationFrame) { // Seems rather slow in FF6 - so disabled
                    window.mozRequestAnimationFrame(updateVerticalBarChart);

                // Default fallback to setTimeout
                } else {
                    setTimeout(updateVerticalBarChart, 16.6666666);
                }
            }
        }        

        updateVerticalBarChart();
        
    },



    drawPieChart : function(ring){
        var context = this.ctx;
        context.lineWidth = this.pieBorderWidth;

        var dataSum = 0,
            dataSumForStartAngle = 0,
            dataLen = this.data.length;
            
        for (var i=0; i<dataLen; i++){
            dataSumForStartAngle += this.data[i];
            if(this.data[i]<0){
                return;
            }
        }
        if(this.pieTotal == null){
            dataSum = dataSumForStartAngle;
        }else{
            dataSum = this.pieTotal;
        }

        var pieAreaWidth = this.width - this.marginLeft - this.marginRight;
        var pieAreaHeight = this.height - this.marginTop - this.marginBottom;
        
        if(this.title){
            pieAreaHeight = pieAreaHeight - this.titleFontHeight - this.titleMargin;
        }
        
        var centerX = this.width / 2;
        var centerY = this.marginTop + (pieAreaHeight / 2);
        
        if(this.title){
            centerY += this.titleFontHeight + this.titleMargin;
        }

        var doublePI = 2 * Math.PI;
        var radius = (Math.min( pieAreaWidth, pieAreaHeight) / 2);
        
        context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
        var maxLabelWidth = 0;
        var labelWidth = 0;
        for(var i=0; i<this.labels.length; i++){
            labelWidth = context.measureText(this.labels[i]).width;
            if(labelWidth>maxLabelWidth){
                maxLabelWidth = labelWidth;
            }
        }
        
        radius = radius - maxLabelWidth - this.labelMargin;
        
        var startAngle = this.pieStart* doublePI / dataSumForStartAngle;
        var currentAngle = startAngle;
        var endAngle = 0;
        var incAngleBy = 0;
        
        for(var i=0; i<dataLen; i++){
            context.beginPath();
            incAngleBy = this.data[i] * doublePI / dataSum;
            endAngle = currentAngle + incAngleBy;

            
            context.moveTo(centerX, centerY);
            context.arc(centerX, centerY, radius, currentAngle, endAngle, false);
            context.lineTo(centerX, centerY);

            currentAngle = endAngle;
            
            context.fillStyle = this.colors[i%this.colors.length];
            context.fill();
            
            context.strokeStyle = this.pieStrokeStyle;
            context.stroke();
        }
        
        
        //Draw the outer shadow:
        
        context.save();
        
        context.shadowOffsetX = this.pieShadowOffsetX;
        context.shadowOffsetY = this.pieShadowOffsetY;
        
        context.translate(centerX, centerY);
        //context.rotate(this.pieStart* doublePI / dataSum);
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, radius, startAngle, endAngle, false);
        
        
        context.shadowBlur = this.pieShadowBlur;
        context.shadowColor = this.pieShadowColor;
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = 'rgba(0,0,0,1.0)';
        context.fill();

        context.restore();

        //Ring-charts:
                
        if(ring){
        
            var ringCenterRadius = radius/2;

            // draw the inner border
            context.save();
            context.beginPath();
            context.moveTo(centerX+ringCenterRadius, centerY);
            context.arc(centerX, centerY, ringCenterRadius+this.pieBorderWidth, startAngle, endAngle, false);
            context.fillStyle = this.pieStrokeStyle;
            context.fill();
            context.restore();
        
            // "cut" the central part:
            context.save();
            
            context.beginPath();
            context.moveTo(centerX+ringCenterRadius, centerY);
            context.arc(centerX, centerY, ringCenterRadius, 0, doublePI, false);
            
            context.globalCompositeOperation = 'destination-out';
            context.fillStyle = '#000';
            context.fill();
            
            context.restore();
            
            // draw the ring's inner shadow below the ring:
            context.save();
        
            context.shadowOffsetX = this.pieShadowOffsetX;
            context.shadowOffsetY = this.pieShadowOffsetY;
            
            context.translate(centerX, centerY);
            context.beginPath();
            context.arc(0, 0, ringCenterRadius, startAngle, endAngle, false);
            
            
            context.shadowBlur = this.pieShadowBlur;
            context.shadowColor = this.pieShadowColor;
            context.globalCompositeOperation = 'destination-over';
            context.strokeStyle = this.pieStrokeStyle;
            context.stroke();

            context.restore();
                    
        }
        
        
        // draw the labels:
        
        var currentAngle = this.pieStart* doublePI / dataSumForStartAngle;
        var endAngle = 0;
        var incAngleBy = 0;
        
        context.beginPath();
        

        for(var i=0; i<this.data.length; i++){
            context.save();
            incAngleBy = this.data[i] * doublePI / dataSum;
            endAngle = currentAngle + incAngleBy;
            
            var mAngle = currentAngle +  incAngleBy/2;
            context.translate(centerX, centerY);
            context.rotate(mAngle);
            
            context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
            context.fillStyle = this.colors[i%this.colors.length];
            context.textAlign = 'start';
            if(this.labels[i]){
                if( (mAngle>Math.PI/2) && (mAngle<=3*(Math.PI/2)) ){
                    var translateXBy = radius + this.labelMargin + context.measureText(this.labels[i]).width / 2;
                    context.translate(translateXBy, 0);
                    context.rotate(Math.PI);
                    context.translate(-translateXBy, 0);
                }
                context.textBaseline = 'middle';
                context.fillText(this.labels[i], radius+this.labelMargin, 0);
            }
            
            context.restore();
            currentAngle = endAngle;
        }
    },
    

    
    drawExplodedPieChart : function(){
        var context = this.ctx;
        context.lineWidth = this.pieBorderWidth;
       
        var dataSum = 0,
            dataSumForStartAngle = 0,
            dataLen = this.data.length;
            
        for (var i=0; i<dataLen; i++){
            dataSumForStartAngle += this.data[i];
            if(this.data[i]<0){
                return;
            }
        }
        if(this.pieTotal == null){
            dataSum = dataSumForStartAngle;
        }else{
            dataSum = this.pieTotal;
        }

        var pieAreaWidth = this.width - this.marginLeft - this.marginRight;
        var pieAreaHeight = this.height - this.marginTop - this.marginBottom;
        
        if(this.title!=null){
            pieAreaHeight = pieAreaHeight - this.titleFontHeight - this.titleMargin;
        }
        
        var centerX = this.width / 2;
        var centerY = this.marginTop + (pieAreaHeight / 2);
        
        if(this.title){
            centerY += this.titleFontHeight + this.titleMargin;
        }

        var doublePI = 2 * Math.PI;
        var radius = (Math.min( pieAreaWidth, pieAreaHeight) / 2);
        
        context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
        var maxLabelWidth = 0;
        var labelWidth = 0;
        for(var i=0; i<this.labels.length; i++){
            labelWidth = context.measureText(this.labels[i]).width;
            if(labelWidth>maxLabelWidth){
                maxLabelWidth = labelWidth;
            }
        }
        
        radius = radius - maxLabelWidth - this.labelMargin;
        
        var currentAngle = this.pieStart* doublePI / dataSumForStartAngle;
        var endAngle = 0;
        var incAngleBy = 0;
        var halfAngle = 0;
        var mAngle = 0;
        for(var i=0; i<this.data.length; i++){
            
            context.save();
            incAngleBy = this.data[i] * doublePI / dataSum;
            endAngle = currentAngle + incAngleBy;
            halfAngle = incAngleBy/2;
            mAngle = currentAngle +  halfAngle;
            
            context.translate(centerX, centerY);
            context.rotate(currentAngle);
         
            context.rotate(halfAngle);
            context.translate(this.explosionOffset,0);
            context.rotate(-halfAngle);
            
            context.beginPath();
            context.moveTo(0,0);
            context.arc(0, 0, radius, 0, incAngleBy, false);
            context.lineTo(0, 0);
            
            context.save();
        
            context.shadowOffsetX = this.pieShadowOffsetX;
            context.shadowOffsetY = this.pieShadowOffsetY;
            context.shadowBlur = this.pieShadowBlur;
            context.shadowColor = this.pieShadowColor;

            context.fillStyle = this.colors[i%this.colors.length];
            context.fill();

            context.restore();

            context.strokeStyle = this.pieStrokeStyle;
            context.stroke();
            
            
            // Draw the label:
            
            context.rotate(halfAngle);
            
            context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
            context.fillStyle = this.colors[i%this.colors.length];
            context.textAlign = 'start';
            if(this.labels[i]){
                if( (mAngle>Math.PI/2) && (mAngle<=3*(Math.PI/2)) ){
                    var translateXBy = radius + this.labelMargin + context.measureText(this.labels[i]).width / 2;
                    context.translate(translateXBy, 0);
                    context.rotate(Math.PI);
                    context.translate(-translateXBy, 0);
                }
                context.textBaseline = 'middle';
                context.fillText(this.labels[i], radius+this.labelMargin, 0);
            }
            
            
            // Restore the context:
            
            context.restore();
            currentAngle = endAngle;
            
        }
                
    },


    
    animatePieChart : function(pieType){
        var dataSum = 0,
            pieTotalReal = this.pieTotal,
            aw = this,
            numFrames = this.animationFrames,
            currentFrame = 0,
            pieAreaWidth = this.width - this.marginLeft - this.marginRight,
            pieAreaHeight = this.height - this.marginTop - this.marginBottom,
            marginTop = this.marginTop,
            marginLeft = this.marginLeft;
        
        if(this.title){
            pieAreaHeight = pieAreaHeight - this.titleFontHeight - this.titleMargin;
            marginTop += this.titleFontHeight + this.titleMargin;
        };
               
        for(var i=0; i<this.data.length; i++){
            dataSum += this.data[i];
            if(this.data[i]<0){
                return;
            }
        }
        
        if(pieTotalReal == null) {
           pieTotalReal = dataSum;
        }
        
        var updatePieChart = function() {
            if(currentFrame++ < numFrames) {
                
                aw.ctx.clearRect(0, 0, aw.width, aw.height);
                aw.pieTotal = (dataSum * (numFrames / currentFrame)) * (pieTotalReal / dataSum);
                if(pieType == "pie") {
                    aw.drawPieChart(false);
                }else if(pieType == "ring") {
                    aw.drawPieChart(true);
                }else if(pieType == "exploded") {
                    aw.drawExplodedPieChart();
                }
                aw.drawTitleAndBorders();
                
                // Standard
                if (typeof(window.requestAnimationFrame) == 'function') {
                    window.requestAnimationFrame(updatePieChart);

                // IE 10+
                } else if (typeof(window.msRequestAnimationFrame) == 'function') {
                    window.msRequestAnimationFrame(updatePieChart);

                // Chrome
                } else if (typeof(window.webkitRequestAnimationFrame) == 'function') {
                    window.webkitRequestAnimationFrame(updatePieChart);

                // Firefox
                } else if (window.mozRequestAnimationFrame) { // Seems rather slow in FF6 - so disabled
                    window.mozRequestAnimationFrame(updatePieChart);

                // Default fallback to setTimeout
                } else {
                    setTimeout(updatePieChart, 16.6666666);
                }
            }
        }        

        updatePieChart();

    },
    
    
    
    drawParetoChart : function(){
        var context = this.ctx;
        
        var n = this.data.length;
        
        var indices = new Array();
        for (var i = 0; i < this.data.length; i++){
            indices.push(i);
        }
        
        indices.numericSortReverse(this.data);
        
        
        
        var maxData = this.data[indices[0]];
        var minData = this.data[indices[indices.length-1]];
        
        var dataSum = 0;
        for (var i = 0; i < this.data.length; i++){
            dataSum += this.data[indices[i]];
            if(this.data[indices[i]]<0){
                return;
            }
        }
        dataSum = dataSum.toFixed(this.numberOfDecimals);
        
        var yAxisValues = new Array();
        yAxisValues.push(0);
        for (var i = 1; i < 10; i++){
            yAxisValues.push((dataSum * i/10).toFixed(this.numberOfDecimals));
        }
        yAxisValues.push(dataSum);
        
        // Find the widest Y-axis value's width:
        
        context.font = this.yAxisLabelFontStyle + ' ' + this.yAxisLabelFontHeight + 'px '+ this.yAxisLabelFont;
        var maxYAxisLabelWidth = 0;
        var yAxisLabelWidth = 0;
        for(var i=0; i<yAxisValues.length; i++){
            yAxisLabelWidth = context.measureText(yAxisValues[i]).width;
            if(yAxisLabelWidth>maxYAxisLabelWidth){
                maxYAxisLabelWidth = yAxisLabelWidth;
            }
        }
        
        var perCentMaxWidth = context.measureText("100%").width;
        
        // Calculate the chart size and position:
        
        var chartWidth = this.width - this.marginLeft - this.marginRight - 2*this.chartMarkerSize - maxYAxisLabelWidth - perCentMaxWidth - 2*this.yAxisLabelMargin;
        var chartHeight = this.height - this.marginTop - this.marginBottom;
        
        var chartTopLeftX = this.marginLeft + this.chartMarkerSize + maxYAxisLabelWidth + this.yAxisLabelMargin;
        var chartTopLeftY = this.marginTop;
        
        
        if(this.title){
            chartHeight -= this.titleFontHeight + this.titleMargin;
            chartTopLeftY += this.titleFontHeight + this.titleMargin;
        }
        
        
        // Draw the chart's background:
        
        context.save();
        
        context.translate(chartTopLeftX, chartTopLeftY);
        
        context.fillStyle = this.chartBackgroundFillStyle();
        context.fillRect(0,0,chartWidth,chartHeight);
        
        
        // Draw the markers, horizontal lines, and axis' labels:
        
        var yStep = chartHeight / 10;
        var lineY = 0;
        
        context.lineWidth = this.chartHorizontalLineWidth;
        context.font = this.yAxisLabelFontStyle + ' ' + this.yAxisLabelFontHeight + 'px '+ this.yAxisLabelFont;
        
        for(var i=0; i<=10; i++){
            lineY = i*yStep;
            
            if( i>0 && i<10){
            
                context.strokeStyle = this.chartHorizontalLineStrokeStyle;
                context.beginPath();
                context.moveTo(0,lineY);
                context.lineTo(chartWidth,lineY);
                context.stroke();
            
            }
            
            context.strokeStyle = this.chartBorderStrokeStyle;
            context.beginPath();
            context.moveTo(-this.chartMarkerSize,lineY);
            context.lineTo(0,lineY);
            context.stroke();
            
            context.beginPath();
            context.moveTo(chartWidth,lineY);
            context.lineTo(chartWidth+this.chartMarkerSize,lineY);
            context.stroke();
            
            context.fillStyle = this.yAxisLabelFillStyle;
            context.textAlign = 'right';
            context.textBaseline = 'middle';
            context.fillText(yAxisValues[10-i], -this.chartMarkerSize-this.yAxisLabelMargin, lineY);
            
            context.textAlign = 'left';
            context.fillText( ((10-i)*10)+'%', chartWidth+this.chartMarkerSize+this.yAxisLabelMargin, lineY);
        }
        
        // Draw the bars:
        
        context.save();
        
        context.translate(0, chartHeight);
        
        var barWidth = (chartWidth-2*this.barHGap) / n;
        var barHeight = 0;
        
        var halfBarWidth = barWidth/2;
        
        var y = 0;
        var x = this.barHGap;
        var x1 = x;
        var y1 = 0;
        var x2 = 0;
        var y2 = 0;
        
        for(var i=0; i<this.data.length; i++){
            
            barHeight = this.data[indices[i]] * chartHeight / dataSum;
            
            //Draw the bar:
            
            context.fillStyle = this.colors[i%this.colors.length];
            context.strokeStyle = this.barStrokeStyle;
            context.lineWidth = this.barBorderWidth;
            
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, y - barHeight);
            context.lineTo(x + barWidth, y - barHeight);
            context.lineTo(x + barWidth, y);

            context.save();
            context.shadowOffsetX = this.barShadowOffsetX;
            context.shadowOffsetY = this.barShadowOffsetY;
            context.shadowBlur = this.barShadowBlur;
            context.shadowColor = this.barShadowColor;
            
            context.fill();
            context.restore();
            context.stroke();
            
            
            // Draw the line:
            
            x2 = x1;
            y2 = y1;
            x1 = x + barWidth;
            y1 -= barHeight;
            if(i==this.data.length - 1){
                y1 = -chartHeight;
            }
            
            context.strokeStyle = this.chartLineStrokeStyle;
            context.lineWidth = this.chartLineWidth;
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
                        
            
            // Draw the label:
            
            context.font = this.labelFontStyle + ' ' + this.labelFontHeight + 'px '+ this.labelFont;
            context.fillStyle = this.colors[i%this.colors.length];
            context.textAlign = 'center';
            if(this.labels[indices[i]]){
                if(this.data[indices[i]]>=0){
                    context.textBaseline = 'bottom';
                    context.fillText(this.labels[indices[i]], x + halfBarWidth, - barHeight - this.labelMargin, barWidth);
                }else{
                    context.textBaseline = 'top';
                    context.fillText(this.labels[indices[i]], x + halfBarWidth, - barHeight + this.labelMargin, barWidth);
                }
            }
            
            // Draw the data value:
            
            context.font = this.dataValueFontStyle + ' ' + this.dataValueFontHeight + 'px '+ this.dataValueFont;
            context.fillStyle = this.dataValueFillStyle;
            context.textAlign = 'center';
            if(this.data[indices[i]]>=0){
                context.textBaseline = 'bottom';
                context.fillText(this.data[indices[i]], x + halfBarWidth, - barHeight - this.labelMargin - this.dataValueMargin, barWidth);
            }else{
                context.textBaseline = 'top';
                context.fillText(this.data[indices[i]], x + halfBarWidth, - barHeight + this.labelMargin + this.dataValueMargin, barWidth);
            }
            
            
            // Update x:
            
            x = x + barWidth;
            
        }
        
        // Draw the points:
        
        x = this.barHGap;
        x1 = x;
        y1 = 0;
        x2 = 0;
        y2 = 0;
        
        context.fillStyle = this.chartPointFillStyle;
        context.beginPath();
        context.arc(x1, y1, this.chartPointRadius, 0, 2*Math.PI, false);
        context.fill();
        
        for(var i=0; i<this.data.length; i++){
            barHeight = this.data[indices[i]] * chartHeight / dataSum;
            x2 = x1;
            y2 = y1;
            x1 = x + barWidth;
            y1 -= barHeight;
            if(i==this.data.length - 1){
                y1 = -chartHeight;
            }
            
            context.fillStyle = this.chartPointFillStyle;
            context.beginPath();
            context.arc(x1, y1, this.chartPointRadius, 0, 2*Math.PI, false);
            context.fill();
            x = x + barWidth;
        }
        context.restore();
        // Draw the chart's border:               
        context.lineWidth = this.chartBorderLineWidth;
        context.strokeStyle = this.chartBorderStrokeStyle;
        context.strokeRect(0,0,chartWidth,chartHeight);
        context.restore();
    },
    
};


var 转换={
	翻译:function(obj){
		var result,oClass=转换.isClass(obj);
			//确定result的类型
		if(oClass==="Object"){
			result={};
		}else if(oClass==="Array"){
			result=[];
		}else{
			return obj;
		}
		for(key in obj){
			var copy=obj[key];
			if(转换.isClass(copy)=="Object" || 转换.isClass(copy)=="Array"){
				result[转换.tutu(key)]=arguments.callee(copy);//递归调用
			}else{
				result[转换.tutu(key)]=转换.tutu(obj[key]);
			}
		}
		return result;
	},
	
	isClass:function(o){
		if(o===null) return "Null";
		if(o===undefined) return "Undefined";
		return Object.prototype.toString.call(o).slice(8,-1);
	},
	
	tutu:function(a){
		return 转换.isClass(字典[a])==="Undefined"?a:字典[a];
	},	
};


var 字典={
	场景:'ctx',//canvas对象
	图表样式:'chartType' ,//柱图,饼图,环图,分离饼图,水平柱图,帕累托图
	使用动画:'animate' ,//普通,动画
	自定义颜色序列:'colors' ,//一维数组
	标题:'title' ,
	序列:'series',
};

var 制表=function(a){
	var 配=转换.翻译(a);
	配.__proto__=图表;
	配.画();
};